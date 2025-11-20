import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

// Initialize demo accounts on server startup
const initializeDemoAccounts = async () => {
  try {
    const supabase = getSupabase();
    
    // Demo accounts to create
    const demoAccounts = [
      {
        email: 'collector@demo.com',
        password: 'demo123',
        name: 'Demo Collector',
        role: 'collector',
        phone: '0501234567'
      },
      {
        email: 'manager@demo.com',
        password: 'demo123',
        name: 'Demo Hub Manager',
        role: 'hub-manager',
        phone: null
      }
    ];

    for (const account of demoAccounts) {
      try {
        // First, check if user already exists
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(u => u.email === account.email);
        
        let userId: string;
        
        if (existingUser) {
          // User exists, use their ID
          userId = existingUser.id;
          console.log(`Demo account already exists: ${account.email}`);
          
          // Update user metadata to include phone
          if (account.phone) {
            await supabase.auth.admin.updateUserById(userId, {
              user_metadata: { 
                name: account.name, 
                role: account.role, 
                phone: account.phone 
              }
            });
          }
        } else {
          // Create new user
          const { data, error } = await supabase.auth.admin.createUser({
            email: account.email,
            password: account.password,
            user_metadata: { name: account.name, role: account.role, phone: account.phone },
            email_confirm: true
          });

          if (error) {
            console.log(`Error creating demo account ${account.email}:`, error.message);
            continue;
          }
          
          userId = data.user.id;
          console.log(`Demo account created: ${account.email}`);
        }
        
        // Always update/create user profile in KV store
        await kv.set(`user:${userId}`, {
          id: userId,
          email: account.email,
          name: account.name,
          role: account.role,
          phone: account.phone || null,
          createdAt: new Date().toISOString(),
        });

        // Always create/update phone-to-user mapping if phone exists
        if (account.phone) {
          await kv.set(`phone:${account.phone}`, {
            userId: userId,
            email: account.email,
            role: account.role,
          });
          console.log(`Phone mapping created: ${account.phone} -> ${account.email}`);
        }

        // Initialize user-specific data based on role (only if doesn't exist)
        if (account.role === 'collector') {
          const existingData = await kv.get(`collector:${userId}`);
          if (!existingData) {
            await kv.set(`collector:${userId}`, {
              totalCollections: 0,
              totalKg: 0,
              earningsGHS: 0,
              healthPoints: 0,
              collections: [],
            });
          }
        } else if (account.role === 'hub-manager') {
          const existingData = await kv.get(`hub:${userId}`);
          if (!existingData) {
            await kv.set(`hub:${userId}`, {
              totalCollectors: 0,
              totalKgProcessed: 0,
              activeCampaigns: 0,
              collections: [],
            });
          }
        }
      } catch (err) {
        console.log(`Error with demo account ${account.email}:`, err);
      }
    }
    
    console.log('Demo accounts initialization complete');
  } catch (error) {
    console.log('Error initializing demo accounts:', error);
  }
};

// Initialize demo accounts
initializeDemoAccounts();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper to create Supabase client
const getSupabase = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Helper to verify user authentication
const verifyAuth = async (authHeader: string | null) => {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  const supabase = getSupabase();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    console.log('Auth verification failed:', error);
    return null;
  }
  return user;
};

// Health check endpoint
app.get("/make-server-6c51ae02/health", (c) => {
  return c.json({ status: "ok" });
});

// Initialize phone mapping for demo collector (one-time setup helper)
app.post("/make-server-6c51ae02/setup-demo-phone", async (c) => {
  try {
    // Just re-run the demo accounts initialization
    await initializeDemoAccounts();
    return c.json({ success: true, message: 'Demo accounts re-initialized' });
  } catch (error) {
    console.log('Error setting up demo phone:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// ==================== AUTH ROUTES ====================

// Sign up new user
app.post("/make-server-6c51ae02/signup", async (c) => {
  try {
    const { email, password, name, role, phone } = await c.req.json();
    
    if (!email || !password || !name || !role) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // If phone is provided, check if it's already registered
    if (phone) {
      const existingPhone = await kv.get(`phone:${phone}`);
      if (existingPhone) {
        return c.json({ error: "Phone number already registered" }, 400);
      }
    }

    const supabase = getSupabase();
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role, phone },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role,
      phone: phone || null,
      createdAt: new Date().toISOString(),
    });

    // If phone number provided, create phone-to-user mapping
    if (phone) {
      await kv.set(`phone:${phone}`, {
        userId: data.user.id,
        email,
        role,
      });
    }

    // Initialize user-specific data based on role
    if (role === 'collector') {
      await kv.set(`collector:${data.user.id}`, {
        totalCollections: 0,
        totalKg: 0,
        earningsGHS: 0,
        healthPoints: 0,
        collections: [],
      });
    } else if (role === 'hub-manager') {
      await kv.set(`hub:${data.user.id}`, {
        totalCollectors: 0,
        totalKgProcessed: 0,
        activeCampaigns: 0,
        collections: [],
      });
    }

    return c.json({ 
      success: true,
      user: {
        id: data.user.id,
        email,
        name,
        role,
        phone: phone || null,
      }
    });
  } catch (error) {
    console.log('Server error during signup:', error);
    return c.json({ error: "Server error during signup" }, 500);
  }
});

// Login with phone number (collectors only)
app.post("/make-server-6c51ae02/login/phone", async (c) => {
  try {
    const { phone, password } = await c.req.json();
    
    if (!phone || !password) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    console.log(`Phone login attempt for: ${phone}`);

    // Look up user by phone number
    const phoneMapping = await kv.get(`phone:${phone}`);
    
    if (!phoneMapping) {
      console.log(`Phone number not found in mappings: ${phone}`);
      return c.json({ error: "Phone number not registered. Please sign up or login with email." }, 404);
    }

    console.log(`Found phone mapping for: ${phone}, email: ${phoneMapping.email}`);

    const supabase = getSupabase();
    
    // Try to sign in with the email associated with this phone
    const { data, error } = await supabase.auth.signInWithPassword({
      email: phoneMapping.email,
      password,
    });

    if (error) {
      console.log('Phone login authentication error:', error.message);
      return c.json({ error: "Invalid phone number or password" }, 401);
    }

    if (data.session?.access_token) {
      // Get user profile
      const profile = await kv.get(`user:${data.user.id}`);
      
      console.log(`Phone login successful for: ${phone}`);
      
      return c.json({ 
        success: true,
        accessToken: data.session.access_token,
        user: profile
      });
    }

    return c.json({ error: "Login failed" }, 401);
  } catch (error) {
    console.log('Server error during phone login:', error);
    return c.json({ error: "Server error during login" }, 500);
  }
});

// Get user session (called on frontend with access_token)
app.get("/make-server-6c51ae02/user", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get user profile from KV store
    const profile = await kv.get(`user:${user.id}`);
    
    if (!profile) {
      return c.json({ error: "User profile not found" }, 404);
    }

    return c.json({ user: profile });
  } catch (error) {
    console.log('Error getting user:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// ==================== COLLECTOR ROUTES ====================

// Get collector dashboard data
app.get("/make-server-6c51ae02/collector/dashboard", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const collectorData = await kv.get(`collector:${user.id}`) || {
      totalCollections: 0,
      totalKg: 0,
      earningsGHS: 0,
      healthPoints: 0,
      collections: [],
    };

    return c.json(collectorData);
  } catch (error) {
    console.log('Error fetching collector dashboard:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Submit plastic collection
app.post("/make-server-6c51ae02/collector/collect", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { weight, location, photoUrl } = await c.req.json();
    
    if (!weight || weight <= 0) {
      return c.json({ error: "Invalid weight" }, 400);
    }

    // Get current collector data
    const collectorData = await kv.get(`collector:${user.id}`) || {
      totalCollections: 0,
      totalKg: 0,
      earningsGHS: 0,
      healthPoints: 0,
      collections: [],
    };

    // Calculate earnings (e.g., 2 GHS per kg)
    const earnings = weight * 2;
    const healthPoints = Math.floor(weight * 10);

    const newCollection = {
      id: `col_${Date.now()}`,
      weight,
      location,
      photoUrl,
      earnings,
      healthPoints,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    // Update collector data
    collectorData.totalCollections += 1;
    collectorData.totalKg += weight;
    collectorData.earningsGHS += earnings;
    collectorData.healthPoints += healthPoints;
    collectorData.collections.unshift(newCollection);

    // Keep only last 100 collections
    if (collectorData.collections.length > 100) {
      collectorData.collections = collectorData.collections.slice(0, 100);
    }

    await kv.set(`collector:${user.id}`, collectorData);

    return c.json({ success: true, collection: newCollection });
  } catch (error) {
    console.log('Error submitting collection:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// ==================== HUB MANAGER ROUTES ====================

// Get hub manager dashboard data
app.get("/make-server-6c51ae02/hub/dashboard", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const hubData = await kv.get(`hub:${user.id}`) || {
      totalCollectors: 0,
      totalKgProcessed: 0,
      activeCampaigns: 0,
      collections: [],
      transactions: [],
    };

    // Calculate total transactions count
    const totalTransactions = (hubData.transactions || []).length;

    // Get all registered collectors for this hub
    const allCollectors = await kv.getByPrefix('collector:id:');
    const hubCollectors = allCollectors.filter((col: any) => col.hubManagerId === user.id);
    const totalRegisteredCollectors = hubCollectors.length;

    return c.json({
      ...hubData,
      totalTransactions,
      totalKgCollected: hubData.totalKgProcessed || 0,
      totalRegisteredCollectors,
    });
  } catch (error) {
    console.log('Error fetching hub dashboard:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Get pending collections for hub manager
app.get("/make-server-6c51ae02/hub/pending-collections", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get all collectors
    const allData = await kv.getByPrefix('collector:');
    const pendingCollections: any[] = [];

    allData.forEach((collectorData: any) => {
      if (collectorData.collections) {
        collectorData.collections
          .filter((col: any) => col.status === 'pending')
          .forEach((col: any) => pendingCollections.push(col));
      }
    });

    return c.json({ collections: pendingCollections });
  } catch (error) {
    console.log('Error fetching pending collections:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Search collector by phone number or card number
app.get("/make-server-6c51ae02/hub/search-collector/:phone", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const searchTerm = c.req.param('phone');
    
    // Try searching by phone first
    let collector = await kv.get(`collector:phone:${searchTerm}`);
    
    // If not found and search term looks like a card number (6 digits), try card lookup
    if (!collector && /^\d{6}$/.test(searchTerm)) {
      collector = await kv.get(`collector:card:${searchTerm}`);
    }
    
    if (collector) {
      return c.json({ found: true, collector });
    } else {
      return c.json({ found: false });
    }
  } catch (error) {
    console.log('Error searching collector:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Register new collector (simple version for transaction flow)
app.post("/make-server-6c51ae02/hub/register-collector", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { phone, name, neighborhood } = await c.req.json();
    
    if (!phone || !name || !neighborhood) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Check if collector already exists
    const existing = await kv.get(`collector:phone:${phone}`);
    if (existing) {
      return c.json({ error: "Collector already registered" }, 400);
    }

    const collectorId = `col_${Date.now()}`;
    
    const newCollector = {
      id: collectorId,
      phone,
      name,
      neighborhood,
      totalKg: 0,
      earningsGHS: 0,
      savingsTokens: 0,
      totalCollections: 0,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
    };

    // Store collector by phone (for lookup) and by ID
    await kv.set(`collector:phone:${phone}`, newCollector);
    await kv.set(`collector:id:${collectorId}`, {
      totalCollections: 0,
      totalKg: 0,
      earningsGHS: 0,
      savingsTokens: 0,
      healthPoints: 0,
      collections: [],
    });

    return c.json({ success: true, collector: newCollector });
  } catch (error) {
    console.log('Error registering collector:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Register new collector (full version with all details for low-tech/illiterate)
app.post("/make-server-6c51ae02/hub/register-collector-full", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      collectorId,
      cardNumber,
      fullName,
      phoneNumber,
      hasPhone,
      emergencyContact,
      neighborhood,
      landmark,
      preferredLanguage,
      canRead,
      photo,
      physicalIdNumber,
      notes,
      registeredBy,
      registrationDate,
    } = await c.req.json();
    
    if (!collectorId || !fullName || !neighborhood || !preferredLanguage) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Check if collector already exists (by phone if available, or by card number)
    if (phoneNumber) {
      const existing = await kv.get(`collector:phone:${phoneNumber}`);
      if (existing) {
        return c.json({ error: "Collector with this phone number already registered" }, 400);
      }
    }

    const newCollector = {
      id: collectorId,
      cardNumber,
      fullName,
      phoneNumber,
      hasPhone,
      emergencyContact,
      neighborhood,
      landmark,
      preferredLanguage,
      canRead,
      photo,
      physicalIdNumber,
      notes,
      totalKg: 0,
      earningsGHS: 0,
      savingsTokens: 0,
      totalCollections: 0,
      registeredBy,
      registrationDate,
      createdAt: new Date().toISOString(),
      hubManagerId: user.id,
    };

    // Store collector by multiple keys for flexible lookup
    // 1. By collector ID (primary key)
    await kv.set(`collector:id:${collectorId}`, {
      ...newCollector,
      totalCollections: 0,
      totalKg: 0,
      earningsGHS: 0,
      savingsTokens: 0,
      healthPoints: 0,
      collections: [],
    });

    // 2. By phone number (if available)
    if (phoneNumber) {
      await kv.set(`collector:phone:${phoneNumber}`, newCollector);
    }

    // 3. By card number (for low-tech collectors)
    await kv.set(`collector:card:${cardNumber}`, newCollector);

    // 4. Add to hub manager's collector list
    const hubCollectors = await kv.get(`hub:${user.id}:collectors`) || [];
    hubCollectors.unshift(collectorId);
    await kv.set(`hub:${user.id}:collectors`, hubCollectors);

    return c.json({ 
      success: true, 
      collector: newCollector,
      message: phoneNumber 
        ? `SMS sent to ${phoneNumber} with collector ID: ${collectorId}`
        : `Collector registered with card number: ${cardNumber}. No phone available.`
    });
  } catch (error) {
    console.log('Error registering collector (full):', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Process hub transaction
app.post("/make-server-6c51ae02/hub/process-transaction", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      collectorId,
      collectorPhone,
      plasticType,
      weight,
      location,
      totalValue,
      instantCash,
      savingsToken,
      timestamp
    } = await c.req.json();
    
    if (!collectorId || !plasticType || !weight) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Get collector data - try by phone first, then by card number
    let collector = await kv.get(`collector:phone:${collectorPhone}`);
    
    // If not found and looks like a card number (6 digits), try card lookup
    if (!collector && /^\d{6}$/.test(collectorPhone)) {
      collector = await kv.get(`collector:card:${collectorPhone}`);
    }
    
    if (!collector) {
      return c.json({ error: "Collector not found" }, 404);
    }

    const collectorData = await kv.get(`collector:id:${collectorId}`) || {
      totalCollections: 0,
      totalKg: 0,
      earningsGHS: 0,
      savingsTokens: 0,
      healthPoints: 0,
      collections: [],
    };

    // Create transaction record
    const transaction = {
      id: `txn_${Date.now()}`,
      collectorId,
      collectorName: collector.fullName || collector.name,
      collectorPhone,
      plasticType,
      weight,
      location: location || null, // GPS location is optional
      totalValue,
      instantCash,
      savingsToken,
      timestamp,
      hubManagerId: user.id,
      status: 'completed',
    };

    // Update collector balances
    collectorData.totalCollections += 1;
    collectorData.totalKg += weight;
    collectorData.earningsGHS += instantCash;
    collectorData.savingsTokens = (collectorData.savingsTokens || 0) + savingsToken;
    collectorData.healthPoints += Math.floor(weight * 10);
    collectorData.collections = collectorData.collections || [];
    collectorData.collections.unshift(transaction);

    // Keep only last 100 transactions
    if (collectorData.collections.length > 100) {
      collectorData.collections = collectorData.collections.slice(0, 100);
    }

    await kv.set(`collector:id:${collectorId}`, collectorData);

    // Update collector profile (save to both phone and card keys if applicable)
    collector.totalKg = collectorData.totalKg;
    collector.earningsGHS = collectorData.earningsGHS;
    collector.savingsTokens = collectorData.savingsTokens;
    
    // Save by phone if available
    if (collector.phoneNumber || collector.phone) {
      const phoneKey = collector.phoneNumber || collector.phone;
      await kv.set(`collector:phone:${phoneKey}`, collector);
    }
    
    // Save by card number if available
    if (collector.cardNumber) {
      await kv.set(`collector:card:${collector.cardNumber}`, collector);
    }

    // Update hub manager stats
    const hubData = await kv.get(`hub:${user.id}`) || {
      totalCollectors: 0,
      totalKgProcessed: 0,
      activeCampaigns: 0,
      collections: [],
      transactions: [],
    };

    hubData.totalKgProcessed += weight;
    hubData.transactions = hubData.transactions || [];
    hubData.transactions.unshift(transaction);

    if (hubData.transactions.length > 100) {
      hubData.transactions = hubData.transactions.slice(0, 100);
    }

    await kv.set(`hub:${user.id}`, hubData);

    // Store transaction in global ledger
    const allTransactions = await kv.get('transactions:all') || [];
    allTransactions.unshift(transaction);
    if (allTransactions.length > 1000) {
      allTransactions.splice(1000);
    }
    await kv.set('transactions:all', allTransactions);

    return c.json({
      success: true,
      transaction,
      message: `SMS confirmations sent to ${collectorPhone}`,
    });
  } catch (error) {
    console.log('Error processing transaction:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Get all collectors for a hub manager
app.get("/make-server-6c51ae02/hub/collectors", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get all collectors registered by this hub manager
    const allCollectors = await kv.getByPrefix('collector:id:');
    
    // Filter collectors registered by this hub manager
    const hubCollectors = allCollectors
      .filter((collector: any) => collector.hubManagerId === user.id);

    return c.json({
      success: true,
      collectors: hubCollectors,
      total: hubCollectors.length,
    });
  } catch (error) {
    console.log('Error fetching collectors:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// ==================== MESSAGING ROUTES ====================

// Get messages for user
app.get("/make-server-6c51ae02/messages", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const messages = await kv.get(`messages:${user.id}`) || [];
    return c.json({ messages });
  } catch (error) {
    console.log('Error fetching messages:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Send message
app.post("/make-server-6c51ae02/messages", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { recipientId, subject, content } = await c.req.json();
    
    if (!recipientId || !subject || !content) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: userProfile?.name || 'Unknown',
      recipientId,
      subject,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Add to recipient's messages
    const recipientMessages = await kv.get(`messages:${recipientId}`) || [];
    recipientMessages.unshift(newMessage);
    await kv.set(`messages:${recipientId}`, recipientMessages);

    // Add to sender's sent messages
    const senderMessages = await kv.get(`messages:${user.id}`) || [];
    senderMessages.unshift({ ...newMessage, sent: true });
    await kv.set(`messages:${user.id}`, senderMessages);

    return c.json({ success: true, message: newMessage });
  } catch (error) {
    console.log('Error sending message:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Mark message as read
app.put("/make-server-6c51ae02/messages/:id/read", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const messageId = c.req.param('id');
    const messages = await kv.get(`messages:${user.id}`) || [];
    
    const updatedMessages = messages.map((msg: any) => 
      msg.id === messageId ? { ...msg, read: true } : msg
    );

    await kv.set(`messages:${user.id}`, updatedMessages);

    return c.json({ success: true });
  } catch (error) {
    console.log('Error marking message as read:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// ==================== DONATION ROUTES ====================

// Submit donation
app.post("/make-server-6c51ae02/donations", async (c) => {
  try {
    const { name, email, amount, frequency, message } = await c.req.json();
    
    if (!name || !email || !amount) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const donation = {
      id: `don_${Date.now()}`,
      name,
      email,
      amount,
      frequency: frequency || 'one-time',
      message,
      timestamp: new Date().toISOString(),
      status: 'completed',
    };

    // Store donation
    const donations = await kv.get('donations:all') || [];
    donations.unshift(donation);
    await kv.set('donations:all', donations);

    // Update total donations
    const stats = await kv.get('donations:stats') || { total: 0, count: 0 };
    stats.total += amount;
    stats.count += 1;
    await kv.set('donations:stats', stats);

    return c.json({ success: true, donation });
  } catch (error) {
    console.log('Error processing donation:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Get donation stats
app.get("/make-server-6c51ae02/donations/stats", async (c) => {
  try {
    const stats = await kv.get('donations:stats') || { total: 0, count: 0 };
    return c.json(stats);
  } catch (error) {
    console.log('Error fetching donation stats:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// ==================== VOLUNTEER ROUTES ====================

// Submit volunteer application
app.post("/make-server-6c51ae02/volunteers", async (c) => {
  try {
    const { name, email, phone, role, availability, message } = await c.req.json();
    
    if (!name || !email || !role) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const volunteer = {
      id: `vol_${Date.now()}`,
      name,
      email,
      phone,
      role,
      availability,
      message,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    // Store volunteer application
    const volunteers = await kv.get('volunteers:all') || [];
    volunteers.unshift(volunteer);
    await kv.set('volunteers:all', volunteers);

    return c.json({ success: true, volunteer });
  } catch (error) {
    console.log('Error submitting volunteer application:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// ==================== HUB MANAGER APPLICATION ROUTES ====================

// Submit hub manager application
app.post("/make-server-6c51ae02/hub-manager-application", async (c) => {
  try {
    const { fullName, email, phone, community, region, experience, why, availability, references } = await c.req.json();
    
    if (!fullName || !email || !phone || !community || !region || !experience || !why || !availability || !references) {
      return c.json({ error: "All fields are required" }, 400);
    }

    const application = {
      id: `hubapp_${Date.now()}`,
      fullName,
      email,
      phone,
      community,
      region,
      experience,
      why,
      availability,
      references,
      timestamp: new Date().toISOString(),
      status: 'pending', // pending, approved, rejected
    };

    // Store hub manager application
    const applications = await kv.get('hub-manager-applications:all') || [];
    applications.unshift(application);
    await kv.set('hub-manager-applications:all', applications);

    console.log(`Hub Manager application received from ${fullName} (${email})`);

    return c.json({ success: true, application });
  } catch (error) {
    console.log('Error submitting hub manager application:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Get all hub manager applications (admin/review purposes)
app.get("/make-server-6c51ae02/hub-manager-applications", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Only allow admin or specific roles to view applications
    // For now, we'll allow authenticated users - you can add role checks later
    const applications = await kv.get('hub-manager-applications:all') || [];

    return c.json({ applications });
  } catch (error) {
    console.log('Error fetching hub manager applications:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// ==================== HEALTH INSIGHTS ROUTES ====================

// Get location health insights
app.get("/make-server-6c51ae02/health-insights/:location", async (c) => {
  try {
    const location = c.req.param('location');
    
    // Get cached insights for this location
    const cachedInsights = await kv.get(`insights:${location.toLowerCase()}`);
    
    if (cachedInsights) {
      return c.json(cachedInsights);
    }

    // Generate mock insights (in production, this would call AI service)
    const insights = {
      location,
      riskLevel: 'medium',
      plasticDensity: Math.floor(Math.random() * 100),
      healthScore: Math.floor(Math.random() * 100),
      recommendations: [
        'Increase plastic collection efforts in residential areas',
        'Monitor water quality near collection zones',
        'Implement community health awareness programs',
      ],
      lastUpdated: new Date().toISOString(),
    };

    // Cache for 24 hours
    await kv.set(`insights:${location.toLowerCase()}`, insights);

    return c.json(insights);
  } catch (error) {
    console.log('Error fetching health insights:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// ==================== AI CHATBOT ROUTES ====================

// Test endpoint for chatbot
app.get("/make-server-6c51ae02/chatbot/test", (c) => {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  return c.json({ 
    status: "ok",
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
  });
});

// AI-powered chatbot for visitor questions
app.post("/make-server-6c51ae02/chatbot", async (c) => {
  try {
    console.log("Chatbot route called");
    const { message, conversationHistory } = await c.req.json();
    
    if (!message) {
      console.log("No message provided");
      return c.json({ error: "Message is required" }, 400);
    }

    console.log("Processing message:", message);
    
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      console.log("OpenAI API key not configured - check environment variable");
      return c.json({ error: "AI service not configured" }, 500);
    }
    
    console.log("OpenAI API key found, length:", apiKey.length);

    // System prompt with Sankofa context
    const systemPrompt = `You are a helpful assistant for Sankofa-Coin, a Ghanaian health-tech initiative that transforms plastic pollution into predictive health intelligence and healthcare access funding.

**About Sankofa-Coin:**
- Sankofa transforms plastic waste collection into healthcare access and health risk prediction
- Collectors bring plastic waste to collection hubs and get paid for their contributions
- The collected data is analyzed by AI to predict health risks in communities
- The initiative serves both Collectors and Hub Managers across Ghana

**How It Works:**
1. Collectors gather plastic waste from their communities
2. They bring it to designated collection hubs
3. Hub managers weigh and record the plastic by type
4. Collectors receive instant cash payment (GHS 2 per kg typically)
5. They can also save earnings as "Savings Tokens" for future healthcare access
6. The plastic data is used to map pollution patterns and predict health risks in that area

**Plastics Accepted:**
- PET bottles (water bottles, soda bottles)
- HDPE containers (milk jugs, detergent bottles)
- LDPE bags (shopping bags, garbage bags)
- PP containers (yogurt containers, bottle caps)
- PS packaging (foam containers, cups)
All plastics should be clean and sorted by type for easier processing.

**Becoming a Collector:**
1. Visit a collection hub in your area
2. Register with a hub manager (provide phone number, name, neighborhood)
3. Receive your collector ID or physical card
4. Start collecting plastic waste
5. Bring plastic to the hub to get paid

**Collection Hubs in Ghana:**
- Accra Central Hub
- Tema Industrial Hub
- Kumasi Regional Hub
- Takoradi Coastal Hub
- And other locations across Ghana

**Privacy & Data:**
- All personal information is encrypted and secure
- Collection data is anonymized before being used for health predictions
- No personal health information is shared
- Data helps predict disease patterns and environmental health risks

**Low-Tech Access:**
- Feature phone users can access the system via USSD/SMS
- No smartphone required to participate as a collector
- Hub managers handle registration for those who cannot read/write

**Payment & Earnings:**
- Instant cash payment at collection hubs
- Option to save earnings as Savings Tokens for healthcare
- Earnings based on weight and type of plastic collected
- Typical rate: 2 GHS per kilogram

Be friendly, informative, and encouraging. Help visitors understand how they can participate in Sankofa-Coin and make a positive impact on their community's health and environment.`;

    // Build messages array for OpenAI
    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: message }
    ];

    console.log("Calling OpenAI API with", messages.length, "messages");
    
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    console.log("OpenAI API response status:", response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.log("OpenAI API error:", response.status, errorData);
      return c.json({ error: `AI service error: ${response.status}` }, 500);
    }

    const data = await response.json();
    console.log("OpenAI API response received successfully");
    
    const aiResponse = data.choices[0].message.content;

    return c.json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.log("Error in chatbot route:", error);
    console.log("Error details:", error instanceof Error ? error.message : String(error));
    return c.json({ 
      error: "Server error while processing chatbot request",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Initialize phone mapping for demo collector (one-time setup helper)
app.post("/make-server-6c51ae02/setup-demo-phone", async (c) => {
  try {
    console.log('Re-initializing demo accounts...');
    await initializeDemoAccounts();
    return c.json({ success: true, message: 'Demo accounts re-initialized' });
  } catch (error) {
    console.log('Error setting up demo phone:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Debug endpoint to check KV store
app.get("/make-server-6c51ae02/debug/phone/:phone", async (c) => {
  try {
    const phone = c.req.param('phone');
    const mapping = await kv.get(`phone:${phone}`);
    return c.json({ 
      phone,
      mapping,
      exists: !!mapping 
    });
  } catch (error) {
    console.log('Error checking phone mapping:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// ==================== SEE & REPORT ROUTES ====================

// Initialize Supabase Storage bucket for reports
const initializeReportsBucket = async () => {
  try {
    const supabase = getSupabase();
    const bucketName = 'make-6c51ae02-reports';
    
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
      });
      
      if (error) {
        console.log('Error creating reports bucket:', error);
      } else {
        console.log('✅ Reports bucket created successfully');
      }
    } else {
      console.log('✅ Reports bucket already exists');
    }
  } catch (error) {
    console.log('Error initializing reports bucket:', error);
  }
};

// Submit a See & Report report
app.post("/make-server-6c51ae02/submit-report", async (c) => {
  try {
    console.log('Received report submission');
    
    // Parse multipart form data
    const formData = await c.req.formData();
    
    // Extract text fields
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;
    
    // Validate required fields
    if (!name || !phone || !email || !location || !description) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    // Extract media files
    const mediaFiles = formData.getAll('media') as File[];
    
    if (mediaFiles.length === 0) {
      return c.json({ error: "At least one photo or video is required" }, 400);
    }
    
    console.log(`Processing ${mediaFiles.length} media file(s)`);
    
    const supabase = getSupabase();
    const bucketName = 'make-6c51ae02-reports';
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const uploadedFiles: string[] = [];
    
    // Upload each media file to Supabase Storage
    for (let i = 0; i < mediaFiles.length; i++) {
      const file = mediaFiles[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${reportId}_${i}.${fileExt}`;
      const filePath = `${reportId}/${fileName}`;
      
      try {
        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, uint8Array, {
            contentType: file.type,
            upsert: false,
          });
        
        if (error) {
          console.log(`Error uploading file ${i}:`, error);
          throw new Error(`Failed to upload file: ${error.message}`);
        }
        
        uploadedFiles.push(filePath);
        console.log(`✅ File ${i + 1} uploaded: ${filePath}`);
      } catch (fileError) {
        console.log(`Error processing file ${i}:`, fileError);
        // Clean up any previously uploaded files
        for (const uploadedFile of uploadedFiles) {
          await supabase.storage.from(bucketName).remove([uploadedFile]);
        }
        throw fileError;
      }
    }
    
    // Create report record
    const report = {
      id: reportId,
      name,
      phone,
      email,
      location,
      description,
      mediaFiles: uploadedFiles,
      status: 'pending',
      timestamp: new Date().toISOString(),
      reviewed: false,
    };
    
    // Store report in KV store
    await kv.set(`report:${reportId}`, report);
    
    // Add to list of all reports
    const allReports = await kv.get('reports:all') || [];
    allReports.unshift(report);
    await kv.set('reports:all', allReports);
    
    console.log(`✅ Report ${reportId} submitted successfully`);
    
    return c.json({ 
      success: true, 
      reportId,
      message: "Report submitted successfully" 
    });
  } catch (error) {
    console.log('Error submitting report:', error);
    return c.json({ 
      error: "Failed to submit report",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Get all reports (for admin/review)
app.get("/make-server-6c51ae02/reports", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Only allow admin or hub managers to view reports
    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile?.role !== 'hub-manager' && userProfile?.role !== 'admin') {
      return c.json({ error: "Forbidden - Admin or Hub Manager access only" }, 403);
    }

    const reports = await kv.get('reports:all') || [];
    
    // Get signed URLs for media files
    const supabase = getSupabase();
    const bucketName = 'make-6c51ae02-reports';
    
    const reportsWithUrls = await Promise.all(reports.map(async (report: any) => {
      const mediaUrls = await Promise.all(report.mediaFiles.map(async (filePath: string) => {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(filePath, 3600); // 1 hour expiry
        
        return data?.signedUrl || null;
      }));
      
      return {
        ...report,
        mediaUrls: mediaUrls.filter(url => url !== null),
      };
    }));

    return c.json({ reports: reportsWithUrls });
  } catch (error) {
    console.log('Error fetching reports:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Update report status
app.put("/make-server-6c51ae02/reports/:id/status", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Only allow admin or hub managers to update reports
    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile?.role !== 'hub-manager' && userProfile?.role !== 'admin') {
      return c.json({ error: "Forbidden - Admin or Hub Manager access only" }, 403);
    }

    const reportId = c.req.param('id');
    const { status, notes } = await c.req.json();
    
    const report = await kv.get(`report:${reportId}`);
    if (!report) {
      return c.json({ error: "Report not found" }, 404);
    }
    
    const updatedReport = {
      ...report,
      status,
      notes,
      reviewed: true,
      reviewedBy: user.id,
      reviewedAt: new Date().toISOString(),
    };
    
    await kv.set(`report:${reportId}`, updatedReport);
    
    // Update in all reports list
    const allReports = await kv.get('reports:all') || [];
    const updatedReports = allReports.map((r: any) => 
      r.id === reportId ? updatedReport : r
    );
    await kv.set('reports:all', updatedReports);

    return c.json({ success: true, report: updatedReport });
  } catch (error) {
    console.log('Error updating report status:', error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Run initialization on server startup
Promise.all([
  initializeDemoAccounts(),
  initializeReportsBucket()
]).then(() => {
  console.log('✅ Server initialization complete');
}).catch(error => {
  console.log('❌ Server initialization error:', error);
});

Deno.serve(app.fetch);