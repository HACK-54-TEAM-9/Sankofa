// const twilio = require('twilio');
const logger = require('../utils/logger');
const Queue = require('bull');
const { supabaseAdmin } = require('../config/supabase');

// Initialize Bull queue for SMS processing
let smsQueue = null;

const initializeSMSQueue = () => {
  if (!smsQueue) {
    try {
      // Use Redis connection if available, otherwise use in-memory
      const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
      
      smsQueue = new Queue('sms-queue', redisUrl, {
        defaultJobOptions: {
          removeOnComplete: 100, // Keep last 100 completed jobs
          removeOnFail: 200, // Keep last 200 failed jobs
          attempts: 3, // Retry failed jobs 3 times
          backoff: {
            type: 'exponential',
            delay: 5000 // Start with 5 second delay, exponentially increase
          }
        }
      });

      // Process SMS jobs
      smsQueue.process('send-sms', async (job) => {
        const { to, message, template, data } = job.data;
        return await processSingleSMS({ to, message, template, data });
      });

      // Process bulk SMS jobs
      smsQueue.process('bulk-sms', async (job) => {
        const { recipients, template, data } = job.data;
        return await processBulkSMSBatch(recipients, template, data);
      });

      // Queue event handlers
      smsQueue.on('completed', (job, result) => {
        logger.info('SMS job completed', { jobId: job.id, result });
      });

      smsQueue.on('failed', (job, err) => {
        logger.error('SMS job failed', { jobId: job.id, error: err.message });
      });

      smsQueue.on('error', (error) => {
        logger.error('SMS queue error:', error);
      });

      logger.info('SMS queue initialized successfully');
      
      // Update module.exports.smsQueue
      module.exports.smsQueue = smsQueue;
    } catch (error) {
      logger.warn('Failed to initialize SMS queue, using synchronous processing:', error.message);
    }
  }
  return smsQueue;
};

// Initialize Twilio client lazily - only when credentials are available
// COMMENTED OUT: Twilio SMS service disabled for development
let client = null;

const getTwilioClient = () => {
  // COMMENTED OUT: Twilio SMS service disabled for development
  logger.warn('SMS service is disabled for development - Twilio integration commented out');
  return null;
  
  /* ORIGINAL CODE - COMMENTED OUT
  if (!client && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    // Check if we have valid Twilio credentials (not placeholder values)
    if (!process.env.TWILIO_ACCOUNT_SID.startsWith('AC') || 
        process.env.TWILIO_ACCOUNT_SID === 'AC00000000000000000000000000000000' ||
        process.env.TWILIO_AUTH_TOKEN === 'your-twilio-auth-token') {
      logger.warn('Invalid or placeholder Twilio credentials - SMS service will not be available');
      return null;
    }
    
    try {
      client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      logger.info('Twilio client initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Twilio client:', error.message);
      return null;
    }
  }
  return client;
  */
};

// SMS templates
const templates = {
  phoneVerification: (code) => `Your Sankofa-Coin verification code is: ${code}. Valid for 10 minutes.`,
  
  collectionConfirmation: (data) => `Collection confirmed! ${data.weight}kg plastic collected. Earned GH₵${data.cashAmount} cash + GH₵${data.healthTokens} health tokens. Impact: ${data.co2Reduced}kg CO₂ prevented.`,
  
  paymentReceived: (amount) => `Payment received! GH₵${amount} has been credited to your account. Thank you for contributing to community health.`,
  
  healthAlert: (location, risk) => `Health Alert: ${risk} risk detected in ${location}. Check Sankofa-Coin app for prevention tips and collection opportunities.`,
  
  hubUpdate: (hubName, message) => `Update from ${hubName}: ${message}. Visit your nearest hub or check the app for details.`,
  
  nhisReminder: (amount) => `You have GH₵${amount} in Health Tokens available for NHIS enrollment. Visit any collection hub to activate your health insurance.`,
  
  weeklyReport: (data) => `Weekly Report: ${data.collections} collections, ${data.weight}kg plastic, GH₵${data.earnings} earned. You're making a difference! Keep it up!`,
  
  donationThankYou: (amount) => `Thank you for your GH₵${amount} donation to Sankofa-Coin! Your contribution helps fund plastic collection and healthcare access across Ghana.`,
  
  volunteerReminder: (event, date, location) => `Reminder: ${event} on ${date} at ${location}. Your volunteer work makes a real difference in community health.`,
  
  systemMaintenance: (duration) => `Sankofa-Coin will be under maintenance for ${duration}. Services will resume shortly. Thank you for your patience.`
};

// Send SMS function
const sendSMS = async ({ to, message, template, data }) => {
  try {
    let smsMessage = message;
    
    // Use template if provided
    if (template && templates[template]) {
      smsMessage = templates[template](data);
    }

    // Validate phone number format
    if (!to.startsWith('+233')) {
      throw new Error('Invalid phone number format. Must start with +233');
    }

    const twilioClient = getTwilioClient();
    if (!twilioClient) {
      // Log to database even if Twilio is not configured
      await logSMSToDatabase({
        to,
        message: smsMessage,
        status: 'mock',
        template
      });
      
      logger.info('SMS mock sent (Twilio not configured)', { to, message: smsMessage });
      return {
        success: true,
        messageId: `mock_${Date.now()}`,
        status: 'mock',
        to: to
      };
    }

    const result = await twilioClient.messages.create({
      body: smsMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    // Log successful SMS to database
    await logSMSToDatabase({
      to,
      message: smsMessage,
      status: result.status,
      messageId: result.sid,
      template
    });

    logger.info('SMS sent successfully', {
      to: to,
      messageId: result.sid,
      status: result.status
    });

    return {
      success: true,
      messageId: result.sid,
      status: result.status,
      to: to
    };
  } catch (error) {
    // Log failed SMS to database
    await logSMSToDatabase({
      to,
      message: message,
      status: 'failed',
      error: error.message,
      template
    });

    logger.error('SMS sending failed', {
      to: to,
      error: error.message,
      code: error.code
    });
    throw error;
  }
};

// Process single SMS (used by queue)
const processSingleSMS = async ({ to, message, template, data }) => {
  return await sendSMS({ to, message, template, data });
};

// Send bulk SMS
const sendBulkSMS = async (recipients, template, data) => {
  const results = [];
  const errors = [];

  // Process in batches to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (recipient) => {
      try {
        const result = await sendSMS({ 
          to: recipient.phone, 
          template, 
          data: { ...data, name: recipient.name } 
        });
        results.push({ ...result, recipient: recipient.name });
      } catch (error) {
        errors.push({ 
          recipient: recipient.name, 
          phone: recipient.phone, 
          error: error.message 
        });
      }
    });

    await Promise.all(batchPromises);
    
    // Add delay between batches to respect rate limits
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  logger.info('Bulk SMS completed', {
    total: recipients.length,
    successful: results.length,
    failed: errors.length
  });

  return { results, errors };
};

// Process bulk SMS batch (used by queue)
const processBulkSMSBatch = async (recipients, template, data) => {
  return await sendBulkSMS(recipients, template, data);
};

// Send bulk SMS with job queue (recommended for large batches)
const sendBulkSMSQueued = async (recipients, template, data, options = {}) => {
  try {
    const queue = initializeSMSQueue();
    
    if (!queue) {
      // Fallback to synchronous processing if queue not available
      logger.warn('SMS queue not available, using synchronous processing');
      return await sendBulkSMS(recipients, template, data);
    }

    // Split recipients into manageable chunks
    const chunkSize = options.chunkSize || 50;
    const chunks = [];
    
    for (let i = 0; i < recipients.length; i += chunkSize) {
      chunks.push(recipients.slice(i, i + chunkSize));
    }

    // Add each chunk as a separate job
    const jobs = [];
    for (const chunk of chunks) {
      const job = await queue.add('bulk-sms', {
        recipients: chunk,
        template,
        data
      }, {
        priority: options.priority || 5,
        delay: options.delay || 0
      });
      jobs.push(job);
    }

    logger.info('Bulk SMS jobs queued', {
      totalRecipients: recipients.length,
      chunks: chunks.length,
      jobIds: jobs.map(j => j.id)
    });

    return {
      success: true,
      totalRecipients: recipients.length,
      jobsCreated: jobs.length,
      jobIds: jobs.map(j => j.id),
      message: 'Bulk SMS queued for processing'
    };
  } catch (error) {
    logger.error('Failed to queue bulk SMS:', error);
    throw error;
  }
};

// USSD Menu System for Feature Phones
const ussdMenus = {
  main: {
    text: 'Welcome to Sankofa-Coin\n1. Check Balance\n2. Recent Collections\n3. Nearest Hub\n4. Health Tokens\n5. Report Collection\n0. Exit',
    options: {
      '1': 'checkBalance',
      '2': 'recentCollections',
      '3': 'nearestHub',
      '4': 'healthTokens',
      '5': 'reportCollection',
      '0': 'exit'
    }
  },
  checkBalance: {
    text: 'Your Balances:\nCash: GH₵{cash}\nHealth Tokens: GH₵{healthTokens}\nTotal Earnings: GH₵{totalEarnings}\n\n0. Main Menu',
    options: { '0': 'main' }
  },
  recentCollections: {
    text: 'Recent Collections:\n{collections}\n\n0. Main Menu',
    options: { '0': 'main' }
  },
  nearestHub: {
    text: 'Nearest Hub:\n{hubName}\n{hubAddress}\nOpen: {hours}\n\n0. Main Menu',
    options: { '0': 'main' }
  },
  healthTokens: {
    text: 'Health Tokens: GH₵{healthTokens}\nAvailable for NHIS enrollment\nVisit nearest hub to activate\n\n0. Main Menu',
    options: { '0': 'main' }
  },
  reportCollection: {
    text: 'Report Collection:\n1. Submit New\n2. Check Status\n0. Main Menu',
    options: {
      '1': 'submitCollection',
      '2': 'checkCollectionStatus',
      '0': 'main'
    }
  }
};

// Handle USSD session
const handleUSSDSession = async (sessionId, phoneNumber, input, userData = null) => {
  try {
    // Get or create session
    let session = await getUSSDSession(sessionId);
    
    if (!session) {
      // New session - show main menu
      session = {
        sessionId,
        phoneNumber,
        currentMenu: 'main',
        history: [],
        data: {}
      };
      await saveUSSDSession(session);
    }

    // Process input
    const currentMenu = ussdMenus[session.currentMenu];
    
    if (!currentMenu) {
      return {
        text: 'Error: Invalid menu. Please try again.\n0. Main Menu',
        continueSession: true
      };
    }

    // Handle navigation
    const selectedOption = currentMenu.options[input];
    
    if (!selectedOption) {
      return {
        text: 'Invalid option. Please try again.\n\n' + currentMenu.text,
        continueSession: true
      };
    }

    if (selectedOption === 'exit') {
      await endUSSDSession(sessionId);
      return {
        text: 'Thank you for using Sankofa-Coin!',
        continueSession: false
      };
    }

    // Fetch user data if needed
    if (!userData && selectedOption !== 'main') {
      userData = await getUserDataByPhone(phoneNumber);
    }

    // Navigate to new menu
    session.currentMenu = selectedOption;
    session.history.push(input);
    await saveUSSDSession(session);

    const nextMenu = ussdMenus[selectedOption];
    let menuText = nextMenu.text;

    // Replace placeholders with actual data
    if (userData) {
      menuText = menuText
        .replace('{cash}', userData.cash || '0.00')
        .replace('{healthTokens}', userData.health_tokens || '0.00')
        .replace('{totalEarnings}', userData.total_earnings || '0.00');
      
      if (selectedOption === 'recentCollections') {
        const collections = await getRecentCollections(userData.id, 3);
        const collectionText = collections.length > 0
          ? collections.map((c, i) => `${i + 1}. ${c.weight}kg ${c.plastic_type} - GH₵${c.amount}`).join('\n')
          : 'No recent collections';
        menuText = menuText.replace('{collections}', collectionText);
      }
      
      if (selectedOption === 'nearestHub') {
        const hub = await getNearestHub(userData.location);
        menuText = menuText
          .replace('{hubName}', hub?.name || 'N/A')
          .replace('{hubAddress}', hub?.address || 'N/A')
          .replace('{hours}', hub?.operating_hours || 'Contact hub');
      }
    }

    return {
      text: menuText,
      continueSession: true
    };
  } catch (error) {
    logger.error('USSD session handling failed:', error);
    return {
      text: 'Service temporarily unavailable. Please try again later.',
      continueSession: false
    };
  }
};

// Send USSD message (for feature phone users)
const sendUSSDMessage = async (phoneNumber, message) => {
  try {
    // USSD messages are typically initiated by the user dialing a code
    // This function can be used to send USSD-formatted SMS as fallback
    const twilioClient = getTwilioClient();
    
    if (!twilioClient) {
      logger.info('USSD message logged (Twilio not configured)', {
        to: phoneNumber,
        message: message
      });
      
      await logSMSToDatabase({
        to: phoneNumber,
        message,
        status: 'mock',
        type: 'ussd'
      });
      
      return {
        success: true,
        messageId: `ussd_${Date.now()}`,
        message: 'USSD message logged'
      };
    }

    // Send as regular SMS (USSD push is not widely supported)
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    await logSMSToDatabase({
      to: phoneNumber,
      message,
      status: result.status,
      messageId: result.sid,
      type: 'ussd'
    });

    logger.info('USSD message sent', {
      to: phoneNumber,
      messageId: result.sid
    });

    return {
      success: true,
      messageId: result.sid,
      message: 'USSD message sent as SMS'
    };
  } catch (error) {
    logger.error('USSD message failed', {
      to: phoneNumber,
      error: error.message
    });
    throw error;
  }
};

// Send WhatsApp message (if Twilio WhatsApp is configured)
const sendWhatsAppMessage = async ({ to, message, template, data }) => {
  try {
    let whatsappMessage = message;
    
    if (template && templates[template]) {
      whatsappMessage = templates[template](data);
    }

    // Format phone number for WhatsApp (remove + and add country code)
    const formattedNumber = to.replace('+', '') + '@c.us';

    const twilioClient = getTwilioClient();
    if (!twilioClient) {
      throw new Error('Twilio service is not properly configured');
    }

    const result = await twilioClient.messages.create({
      body: whatsappMessage,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${formattedNumber}`
    });

    logger.info('WhatsApp message sent successfully', {
      to: to,
      messageId: result.sid,
      status: result.status
    });

    return {
      success: true,
      messageId: result.sid,
      status: result.status,
      to: to
    };
  } catch (error) {
    logger.error('WhatsApp message failed', {
      to: to,
      error: error.message
    });
    throw error;
  }
};

// Verify phone number
const verifyPhoneNumber = async (phoneNumber) => {
  try {
    const twilioClient = getTwilioClient();
    if (!twilioClient) {
      throw new Error('Twilio service is not properly configured');
    }
    
    const result = await twilioClient.lookups.v1.phoneNumbers(phoneNumber).fetch();
    
    logger.info('Phone number verified', {
      phoneNumber: phoneNumber,
      countryCode: result.countryCode,
      nationalFormat: result.nationalFormat
    });

    return {
      valid: true,
      countryCode: result.countryCode,
      nationalFormat: result.nationalFormat,
      phoneNumber: result.phoneNumber
    };
  } catch (error) {
    logger.error('Phone number verification failed', {
      phoneNumber: phoneNumber,
      error: error.message
    });
    return {
      valid: false,
      error: error.message
    };
  }
};

// Get SMS delivery status
const getSMSStatus = async (messageId) => {
  try {
    const twilioClient = getTwilioClient();
    if (!twilioClient) {
      throw new Error('Twilio service is not properly configured');
    }

    const message = await twilioClient.messages(messageId).fetch();
    
    return {
      messageId: message.sid,
      status: message.status,
      to: message.to,
      from: message.from,
      body: message.body,
      dateCreated: message.dateCreated,
      dateSent: message.dateSent,
      dateUpdated: message.dateUpdated,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage
    };
  } catch (error) {
    logger.error('Failed to get SMS status', {
      messageId: messageId,
      error: error.message
    });
    throw error;
  }
};

// Schedule SMS for later delivery
const scheduleSMS = async ({ to, message, sendAt, template, data, priority = 5 }) => {
  try {
    let smsMessage = message;
    
    if (template && templates[template]) {
      smsMessage = templates[template](data);
    }

    const queue = initializeSMSQueue();
    
    if (!queue) {
      logger.warn('SMS queue not available, cannot schedule SMS');
      return {
        success: false,
        message: 'SMS scheduling not available - queue system offline'
      };
    }

    // Calculate delay in milliseconds
    const sendAtTime = new Date(sendAt);
    const now = new Date();
    const delay = sendAtTime.getTime() - now.getTime();

    if (delay < 0) {
      throw new Error('Scheduled time must be in the future');
    }

    // Add job to queue with delay
    const job = await queue.add('send-sms', {
      to,
      message: smsMessage,
      template,
      data
    }, {
      delay,
      priority,
      jobId: `scheduled_${to}_${sendAtTime.getTime()}`
    });

    // Log scheduled SMS
    await logSMSToDatabase({
      to,
      message: smsMessage,
      status: 'scheduled',
      scheduled_at: sendAt,
      job_id: job.id,
      template
    });

    logger.info('SMS scheduled successfully', {
      to,
      sendAt,
      jobId: job.id,
      delay: `${Math.round(delay / 1000)}s`
    });

    return {
      success: true,
      message: 'SMS scheduled for delivery',
      sendAt: sendAt,
      jobId: job.id,
      estimatedDelay: `${Math.round(delay / 1000)}s`
    };
  } catch (error) {
    logger.error('SMS scheduling failed', {
      to,
      sendAt,
      error: error.message
    });
    throw error;
  }
};

// Cancel scheduled SMS
const cancelScheduledSMS = async (jobId) => {
  try {
    const queue = initializeSMSQueue();
    
    if (!queue) {
      throw new Error('SMS queue not available');
    }

    const job = await queue.getJob(jobId);
    
    if (!job) {
      throw new Error('Job not found');
    }

    await job.remove();

    logger.info('Scheduled SMS cancelled', { jobId });

    return {
      success: true,
      message: 'Scheduled SMS cancelled successfully',
      jobId
    };
  } catch (error) {
    logger.error('Failed to cancel scheduled SMS:', error);
    throw error;
  }
};

// Get queue statistics
const getQueueStats = async () => {
  try {
    const queue = initializeSMSQueue();
    
    if (!queue) {
      return {
        available: false,
        message: 'Queue system not available'
      };
    }

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount()
    ]);

    return {
      available: true,
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + delayed
    };
  } catch (error) {
    logger.error('Failed to get queue stats:', error);
    throw error;
  }
};

// Get account balance and usage
const getAccountInfo = async () => {
  try {
    const twilioClient = getTwilioClient();
    if (!twilioClient) {
      throw new Error('Twilio service is not properly configured');
    }
    
    const account = await twilioClient.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    
    return {
      accountSid: account.sid,
      friendlyName: account.friendlyName,
      status: account.status,
      type: account.type
    };
  } catch (error) {
    logger.error('Failed to get account info', error);
    throw error;
  }
};

// Verify Twilio configuration
const verifyTwilioConfig = async () => {
  try {
    const twilioClient = getTwilioClient();
    if (!twilioClient) {
      logger.warn('Twilio service is not properly configured');
      return false;
    }
    
    const account = await twilioClient.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    logger.info('Twilio configuration verified successfully');
    return true;
  } catch (error) {
    logger.error('Twilio configuration verification failed', error);
    return false;
  }
};

// ===== HELPER FUNCTIONS =====

// Log SMS to database for tracking
const logSMSToDatabase = async (smsData) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert([{
        type: smsData.type || 'sms',
        recipient: smsData.to,
        message: smsData.message,
        status: smsData.status || 'sent',
        metadata: {
          message_id: smsData.messageId,
          template: smsData.template,
          error: smsData.error,
          scheduled_at: smsData.scheduled_at,
          job_id: smsData.job_id
        }
      }]);

    if (error) {
      logger.error('Failed to log SMS to database:', error);
    }
  } catch (error) {
    logger.error('Error logging SMS:', error);
  }
};

// USSD session management
const getUSSDSession = async (sessionId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('ussd_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      logger.error('Error fetching USSD session:', error);
    }

    return data;
  } catch (error) {
    logger.error('Error in getUSSDSession:', error);
    return null;
  }
};

const saveUSSDSession = async (session) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('ussd_sessions')
      .upsert([{
        session_id: session.sessionId,
        phone_number: session.phoneNumber,
        current_menu: session.currentMenu,
        history: session.history,
        data: session.data,
        updated_at: new Date().toISOString()
      }], { onConflict: 'session_id' });

    if (error) {
      logger.error('Error saving USSD session:', error);
    }
  } catch (error) {
    logger.error('Error in saveUSSDSession:', error);
  }
};

const endUSSDSession = async (sessionId) => {
  try {
    const { error } = await supabaseAdmin
      .from('ussd_sessions')
      .delete()
      .eq('session_id', sessionId);

    if (error) {
      logger.error('Error ending USSD session:', error);
    }
  } catch (error) {
    logger.error('Error in endUSSDSession:', error);
  }
};

// Get user data by phone number
const getUserDataByPhone = async (phoneNumber) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, name, phone, cash, health_tokens, total_earnings, location')
      .eq('phone', phoneNumber)
      .single();

    if (error) {
      logger.error('Error fetching user data:', error);
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Error in getUserDataByPhone:', error);
    return null;
  }
};

// Get recent collections
const getRecentCollections = async (userId, limit = 5) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('collections')
      .select('weight, plastic_type, amount, created_at')
      .eq('collector_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      logger.error('Error fetching recent collections:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error('Error in getRecentCollections:', error);
    return [];
  }
};

// Get nearest hub
const getNearestHub = async (userLocation) => {
  try {
    // Simple implementation - in production, use geospatial queries
    const { data, error } = await supabaseAdmin
      .from('hubs')
      .select('name, address, operating_hours, location')
      .eq('status', 'active')
      .limit(1)
      .single();

    if (error) {
      logger.error('Error fetching nearest hub:', error);
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Error in getNearestHub:', error);
    return null;
  }
};

module.exports = {
  sendSMS,
  sendBulkSMS,
  sendBulkSMSQueued,
  sendUSSDMessage,
  handleUSSDSession,
  sendWhatsAppMessage,
  verifyPhoneNumber,
  getSMSStatus,
  scheduleSMS,
  cancelScheduledSMS,
  getQueueStats,
  getAccountInfo,
  verifyTwilioConfig,
  initializeSMSQueue,
  templates,
  // Additional exports for testing
  getUserDataByPhone,
  getRecentCollections,
  getNearestHub,
  logSMSToDatabase,
  smsQueue: null, // Will be set by initializeSMSQueue
  renderTemplate: (templateName, data) => {
    if (templates[templateName]) {
      return templates[templateName](data);
    }
    return `Template ${templateName} not found`;
  },
  normalizePhoneNumber: (phone) => {
    // Remove spaces and dashes
    phone = phone.replace(/[\s-]/g, '');
    
    // If starts with 0, replace with +233
    if (phone.startsWith('0')) {
      return '+233' + phone.substring(1);
    }
    
    // If starts with 233, add +
    if (phone.startsWith('233')) {
      return '+' + phone;
    }
    
    // If already has +233, return as is
    if (phone.startsWith('+233')) {
      return phone;
    }
    
    return phone;
  }
};
