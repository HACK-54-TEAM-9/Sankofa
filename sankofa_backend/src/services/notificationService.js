const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const { supabase } = require('../config/supabase');

// Email configuration
const createTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn('SMTP credentials not configured. Email notifications disabled.');
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const transporter = createTransporter();

// Twilio SMS configuration
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  const twilio = require('twilio');
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  logger.info('Twilio SMS service initialized');
} else {
  logger.warn('Twilio credentials not configured. SMS notifications disabled.');
}

/**
 * Send email notification
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content
 */
const sendEmail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    logger.warn('Email service not configured. Skipping email to:', to);
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Sankofa" <noreply@sankofa.app>',
      to,
      subject,
      text,
      html
    });
    
    logger.info('Email sent successfully', { to, subject, messageId: info.messageId });
    
    // Log notification in database
    await supabase.from('notifications').insert([{
      type: 'email',
      recipient: to,
      subject,
      content: text || html,
      status: 'sent',
      sent_at: new Date().toISOString()
    }]);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Email send error:', error);
    
    // Log failed notification
    await supabase.from('notifications').insert([{
      type: 'email',
      recipient: to,
      subject,
      content: text || html,
      status: 'failed',
      error: error.message
    }]);

    return { success: false, error: error.message };
  }
};

/**
 * Send SMS notification
 * @param {Object} options - SMS options
 * @param {string} options.to - Recipient phone number (E.164 format)
 * @param {string} options.message - SMS message
 */
const sendSMS = async ({ to, message }) => {
  if (!twilioClient) {
    logger.warn('SMS service not configured. Skipping SMS to:', to);
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    
    logger.info('SMS sent successfully', { to, sid: result.sid });
    
    // Log notification in database
    await supabase.from('notifications').insert([{
      type: 'sms',
      recipient: to,
      content: message,
      status: 'sent',
      sent_at: new Date().toISOString(),
      external_id: result.sid
    }]);

    return { success: true, sid: result.sid };
  } catch (error) {
    logger.error('SMS send error:', error);
    
    // Log failed notification
    await supabase.from('notifications').insert([{
      type: 'sms',
      recipient: to,
      content: message,
      status: 'failed',
      error: error.message
    }]);

    return { success: false, error: error.message };
  }
};

/**
 * Send push notification (placeholder for FCM integration)
 * @param {Object} options - Push notification options
 * @param {string} options.userId - User ID
 * @param {string} options.title - Notification title
 * @param {string} options.body - Notification body
 * @param {Object} options.data - Additional data
 */
const sendPushNotification = async ({ userId, title, body, data = {} }) => {
  // TODO: Implement with Firebase Cloud Messaging (FCM) or similar service
  logger.info('Push notification requested (not yet implemented)', { userId, title });
  
  // Log notification in database for tracking
  await supabase.from('notifications').insert([{
    user_id: userId,
    type: 'push',
    title,
    content: body,
    data,
    status: 'pending',
    error: 'Push notifications not yet implemented'
  }]);

  return { success: false, error: 'Push notifications not yet implemented' };
};

/**
 * Send verification email
 * @param {Object} user - User object
 * @param {string} verificationToken - Verification token
 */
const sendVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2E7D32;">Welcome to Sankofa!</h2>
      <p>Hi ${user.name},</p>
      <p>Thank you for joining Sankofa. Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #2E7D32; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="color: #666; font-size: 12px;">${verificationUrl}</p>
      <p>If you didn't create this account, please ignore this email.</p>
      <hr style="border: 1px solid #eee; margin: 30px 0;" />
      <p style="color: #999; font-size: 12px;">Sankofa - Transforming plastic pollution into healthcare access</p>
    </div>
  `;

  return await sendEmail({
    to: user.email,
    subject: 'Verify Your Sankofa Account',
    html,
    text: `Welcome to Sankofa! Please verify your email by visiting: ${verificationUrl}`
  });
};

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {string} resetToken - Password reset token
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2E7D32;">Password Reset Request</h2>
      <p>Hi ${user.name},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #2E7D32; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="color: #666; font-size: 12px;">${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
      <hr style="border: 1px solid #eee; margin: 30px 0;" />
      <p style="color: #999; font-size: 12px;">Sankofa - Transforming plastic pollution into healthcare access</p>
    </div>
  `;

  return await sendEmail({
    to: user.email,
    subject: 'Reset Your Sankofa Password',
    html,
    text: `Reset your password by visiting: ${resetUrl}`
  });
};

/**
 * Send collection verified notification
 * @param {Object} user - User object
 * @param {Object} collection - Collection object
 */
const sendCollectionVerifiedNotification = async (user, collection) => {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2E7D32;">Collection Verified! 🎉</h2>
      <p>Hi ${user.name},</p>
      <p>Great news! Your plastic collection has been verified.</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Collection Details:</h3>
        <p><strong>Weight:</strong> ${collection.weight} kg</p>
        <p><strong>Type:</strong> ${collection.plastic_type}</p>
        <p><strong>Cash Amount:</strong> GHS ${collection.cash_amount}</p>
        <p><strong>Health Tokens:</strong> ${collection.token_amount}</p>
      </div>
      <p>Your earnings will be processed shortly. Keep up the great work!</p>
      <hr style="border: 1px solid #eee; margin: 30px 0;" />
      <p style="color: #999; font-size: 12px;">Sankofa - Transforming plastic pollution into healthcare access</p>
    </div>
  `;

  const smsMessage = `Sankofa: Your collection of ${collection.weight}kg has been verified! You earned GHS ${collection.cash_amount} + ${collection.token_amount} health tokens.`;

  // Send both email and SMS
  await Promise.all([
    sendEmail({
      to: user.email,
      subject: 'Collection Verified!',
      html: emailHtml,
      text: smsMessage
    }),
    sendSMS({
      to: user.phone,
      message: smsMessage
    })
  ]);

  return { success: true };
};

/**
 * Send new message notification
 * @param {Object} recipient - Recipient user object
 * @param {Object} sender - Sender user object
 * @param {string} message - Message content
 */
const sendNewMessageNotification = async (recipient, sender, message) => {
  const messagePreview = message.substring(0, 100) + (message.length > 100 ? '...' : '');
  
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2E7D32;">New Message from ${sender.name}</h2>
      <p>Hi ${recipient.name},</p>
      <p>You have received a new message:</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;">${messagePreview}</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/messages" style="background-color: #2E7D32; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Messages</a>
      </div>
      <hr style="border: 1px solid #eee; margin: 30px 0;" />
      <p style="color: #999; font-size: 12px;">Sankofa - Transforming plastic pollution into healthcare access</p>
    </div>
  `;

  return await sendEmail({
    to: recipient.email,
    subject: `New Message from ${sender.name}`,
    html: emailHtml,
    text: `You have a new message from ${sender.name}: ${messagePreview}`
  });
};

module.exports = {
  sendEmail,
  sendSMS,
  sendPushNotification,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendCollectionVerifiedNotification,
  sendNewMessageNotification,
  // Additional functions for testing
  sendMulticastNotification: async (tokens, notification) => {
    logger.info('Multicast push notification requested (not yet implemented)', { tokens, notification });
    return { success: false, error: 'Multicast push not yet implemented' };
  },
  sendNotification: async (userId, options) => {
    const { type, channels = ['email'], title, message } = options;
    const results = [];
    
    for (const channel of channels) {
      if (channel === 'email') {
        results.push(await sendEmail({ to: userId, subject: title, text: message, html: `<p>${message}</p>` }));
      } else if (channel === 'sms') {
        results.push(await sendSMS({ to: userId, message }));
      } else if (channel === 'push') {
        results.push(await sendPushNotification({ userId, title, body: message }));
      }
    }
    
    return { success: true, results };
  },
  updateNotificationStatus: async (notificationId, status, metadata = {}) => {
    try {
      await supabase
        .from('notifications')
        .update({ status, ...metadata, updated_at: new Date().toISOString() })
        .eq('id', notificationId);
      return { success: true };
    } catch (error) {
      logger.error('Failed to update notification status:', error);
      return { success: false, error: error.message };
    }
  },
  sendBatchNotifications: async (userIds, notification) => {
    const results = [];
    let sent = 0;
    let failed = 0;
    
    for (const userId of userIds) {
      try {
        await sendNotification(userId, notification);
        sent++;
        results.push({ userId, success: true });
      } catch (error) {
        failed++;
        results.push({ userId, success: false, error: error.message });
      }
    }
    
    return { success: true, sent, failed, results };
  },
  scheduleNotification: async (userId, notification, scheduledTime) => {
    const scheduledId = `scheduled_${Date.now()}`;
    // TODO: Implement actual scheduling with a job queue
    logger.info('Notification scheduled (not yet implemented)', { userId, notification, scheduledTime, scheduledId });
    return { success: true, scheduledId };
  },
  cancelScheduledNotification: async (scheduledId) => {
    logger.info('Cancel scheduled notification (not yet implemented)', { scheduledId });
    return { success: true };
  },
  renderCustomTemplate: (template, variables) => {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
  },
  validateTemplateVariables: (template, variables) => {
    const requiredVars = template.match(/{{(\w+)}}/g) || [];
    const missing = [];
    
    for (const varMatch of requiredVars) {
      const varName = varMatch.replace(/{{|}}/g, '');
      if (!(varName in variables)) {
        missing.push(varName);
      }
    }
    
    return missing;
  }
};
