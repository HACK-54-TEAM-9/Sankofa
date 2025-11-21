import { publicAnonKey } from './supabase/info';
import * as supabaseDB from './supabase/database';

// Backend API URL - automatically switches between local dev and production
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV 
    ? 'http://localhost:5000/api' 
    : 'https://sankofa-b2jm.onrender.com/api');

// Flag to use direct Supabase when backend is unavailable
const USE_DIRECT_SUPABASE = import.meta.env.VITE_USE_DIRECT_DB === 'true' || true; // Default to true for now

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchAPI(
  endpoint: string,
  options: RequestInit = {},
  token?: string
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Use access token if provided, otherwise use public anon key
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, error.error || 'Request failed');
  }

  return response.json();
}

// Auth API with Supabase fallback
export const authAPI = {
  signup: async (data: { email: string; password: string; name: string; role: string; phone?: string }) => {
    if (USE_DIRECT_SUPABASE) {
      return supabaseDB.supabaseAuth.signUp(data.email, data.password, {
        name: data.name,
        role: data.role,
        phone: data.phone
      });
    }
    return fetchAPI('/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  loginWithPhone: async (data: { phone: string; password: string }) => {
    if (USE_DIRECT_SUPABASE) {
      // For phone login, we need to find user by phone and use email
      const collector = await supabaseDB.supabaseCollectors.getByPhone(data.phone);
      if (collector && collector.user_id) {
        const user = await supabaseDB.supabaseAuth.getUser();
        return { user, session: await supabaseDB.supabaseAuth.getSession() };
      }
      throw new Error('User not found with this phone number');
    }
    return fetchAPI('/login/phone', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getUser: async (token: string) => {
    if (USE_DIRECT_SUPABASE) {
      return supabaseDB.supabaseAuth.getUser();
    }
    return fetchAPI('/user', {}, token);
  },

  // Additional direct auth methods
  signIn: (email: string, password: string) => supabaseDB.supabaseAuth.signIn(email, password),
  signOut: () => supabaseDB.supabaseAuth.signOut(),
  getSession: () => supabaseDB.supabaseAuth.getSession(),
};

// Collector API with Supabase fallback
export const collectorAPI = {
  getDashboard: async (token: string) => {
    if (USE_DIRECT_SUPABASE) {
      const user = await supabaseDB.supabaseAuth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const collector = await supabaseDB.supabaseCollectors.getByUserId(user.id) as any;
      const stats = await supabaseDB.supabaseDashboard.getCollectorStats(collector.id);
      
      return { collector, ...stats };
    }
    return fetchAPI('/collector/dashboard', {}, token);
  },

  submitCollection: async (token: string, data: { weight: number; location: string; photoUrl?: string }) => {
    if (USE_DIRECT_SUPABASE) {
      const user = await supabaseDB.supabaseAuth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const collector = await supabaseDB.supabaseCollectors.getByUserId(user.id) as any;
      
      return supabaseDB.supabaseCollections.create({
        collector_id: collector.id,
        hub_id: collector.primary_hub_id || '',
        plastic_type: 'PET', // Default, should be from form
        weight_kg: data.weight,
        price_per_kg: 2.5, // Default rate
        total_value: data.weight * 2.5,
        collection_location: data.location ? JSON.parse(data.location) : null
      });
    }
    return fetchAPI('/collector/collect', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  },
};

// Hub Manager API with Supabase fallback
export const hubAPI = {
  getDashboard: async (token: string) => {
    if (USE_DIRECT_SUPABASE) {
      const user = await supabaseDB.supabaseAuth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const hub = await supabaseDB.supabaseHubs.getByManagerId(user.id) as any;
      const stats = await supabaseDB.supabaseDashboard.getHubStats(hub.id);
      
      return { hub, ...stats };
    }
    return fetchAPI('/hub/dashboard', {}, token);
  },

  getPendingCollections: async (token: string) => {
    if (USE_DIRECT_SUPABASE) {
      const user = await supabaseDB.supabaseAuth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const hub = await supabaseDB.supabaseHubs.getByManagerId(user.id) as any;
      return supabaseDB.supabaseCollections.getPending(hub.id);
    }
    return fetchAPI('/hub/pending-collections', {}, token);
  },

  searchCollector: async (token: string, phone: string) => {
    if (USE_DIRECT_SUPABASE) {
      try {
        return await supabaseDB.supabaseCollectors.getByPhone(phone);
      } catch {
        return null;
      }
    }
    return fetchAPI(`/hub/search-collector/${encodeURIComponent(phone)}`, {}, token);
  },

  registerCollector: async (token: string, data: { phone: string; name: string; neighborhood: string }) => {
    if (USE_DIRECT_SUPABASE) {
      return supabaseDB.supabaseCollectors.create({
        card_number: `COL-${Date.now()}`,
        full_name: data.name,
        phone: data.phone,
        neighborhood: data.neighborhood
      });
    }
    return fetchAPI('/hub/register-collector', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  },

  registerCollectorFull: (token: string, data: {
    collectorId: string;
    cardNumber: string;
    fullName: string;
    phoneNumber: string | null;
    hasPhone: 'yes' | 'no' | 'shared';
    emergencyContact: string | null;
    neighborhood: string;
    landmark: string | null;
    preferredLanguage: string;
    canRead: 'yes' | 'no';
    photo: string | null;
    physicalIdNumber: string | null;
    notes: string | null;
    registeredBy: string;
    registrationDate: string;
  }) =>
    fetchAPI('/hub/register-collector-full', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  processTransaction: (token: string, data: {
    collectorId: string;
    collectorPhone: string;
    plasticType: string;
    weight: number;
    location: { latitude: number; longitude: number } | null;
    totalValue: number;
    instantCash: number;
    savingsToken: number;
    timestamp: string;
  }) =>
    fetchAPI('/hub/process-transaction', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  getCollectors: (token: string) =>
    fetchAPI('/hub/collectors', {}, token),
};

// Messaging API
export const messagesAPI = {
  getMessages: (token: string) =>
    fetchAPI('/messages', {}, token),

  sendMessage: (token: string, data: { recipientId: string; subject: string; content: string }) =>
    fetchAPI('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  markAsRead: (token: string, messageId: string) =>
    fetchAPI(`/messages/${messageId}/read`, {
      method: 'PUT',
    }, token),
};

// Donations API
export const donationsAPI = {
  submit: (data: { name: string; email: string; amount: number; frequency?: string; message?: string }) =>
    fetchAPI('/donations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStats: () =>
    fetchAPI('/donations/stats'),
};

// Volunteers API
export const volunteersAPI = {
  submit: (data: { name: string; email: string; phone?: string; role: string; availability?: string; message?: string }) =>
    fetchAPI('/volunteers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Health Insights API
export const healthAPI = {
  getInsights: (location: string) =>
    fetchAPI(`/health-insights/${encodeURIComponent(location)}`),
};
