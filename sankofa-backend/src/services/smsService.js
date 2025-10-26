// const twilio = require('twilio');
const logger = require('../utils/logger');

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
      throw new Error('Twilio service is not properly configured');
    }

    const result = await twilioClient.messages.create({
      body: smsMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
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
    logger.error('SMS sending failed', {
      to: to,
      error: error.message,
      code: error.code
    });
    throw error;
  }
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

// Send USSD message (for feature phone users)
const sendUSSDMessage = async (phoneNumber, message) => {
  try {
    // For USSD, we might need to use a different service or API
    // This is a placeholder for USSD integration
    logger.info('USSD message sent', {
      to: phoneNumber,
      message: message
    });

    return {
      success: true,
      message: 'USSD message queued for delivery'
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
const scheduleSMS = async ({ to, message, sendAt, template, data }) => {
  try {
    let smsMessage = message;
    
    if (template && templates[template]) {
      smsMessage = templates[template](data);
    }

    // Note: Twilio doesn't support scheduled SMS directly
    // This would need to be implemented with a job queue system
    logger.info('SMS scheduled', {
      to: to,
      sendAt: sendAt,
      message: smsMessage
    });

    return {
      success: true,
      message: 'SMS scheduled for delivery',
      sendAt: sendAt
    };
  } catch (error) {
    logger.error('SMS scheduling failed', {
      to: to,
      error: error.message
    });
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

module.exports = {
  sendSMS,
  sendBulkSMS,
  sendUSSDMessage,
  sendWhatsAppMessage,
  verifyPhoneNumber,
  getSMSStatus,
  scheduleSMS,
  getAccountInfo,
  verifyTwilioConfig,
  templates
};
