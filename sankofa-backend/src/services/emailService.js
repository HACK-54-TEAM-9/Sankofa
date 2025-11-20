// const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// COMMENTED OUT: Email service disabled for development
// Create transporter
const createTransporter = () => {
  // COMMENTED OUT: Email service disabled for development
  logger.warn('Email service is disabled for development - SMTP integration commented out');
  return null;
  
  /* ORIGINAL CODE - COMMENTED OUT
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  */
};

// Email templates
const templates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Email - Sankofa-Coin',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #14b8a6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐦 Welcome to Sankofa-Coin</h1>
            <p>Transform plastic into predictive health intelligence</p>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>Thank you for joining Sankofa-Coin. To complete your registration and start making an impact, please verify your email address.</p>
            <p>Click the button below to verify your email:</p>
            <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${data.verificationUrl}">${data.verificationUrl}</a></p>
            <p>This link will expire in 24 hours for security reasons.</p>
            <p>If you didn't create an account with Sankofa-Coin, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2025 Sankofa Ghana Ltd. All rights reserved.</p>
            <p>Se wo were fi na wosankofa a yenkyi — It is not wrong to go back for that which you have forgotten</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Reset Your Password - Sankofa-Coin',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #14b8a6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fef3cd; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Password Reset Request</h1>
            <p>Sankofa-Coin Account Security</p>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>We received a request to reset your password for your Sankofa-Coin account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${data.resetUrl}" class="button">Reset Password</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${data.resetUrl}">${data.resetUrl}</a></p>
            <div class="warning">
              <strong>Security Notice:</strong> This link will expire in 10 minutes for your security. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </div>
          </div>
          <div class="footer">
            <p>© 2025 Sankofa Ghana Ltd. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  welcome: (data) => ({
    subject: 'Welcome to Sankofa-Coin - Start Your Impact Journey!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Sankofa-Coin</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #14b8a6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #10b981; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Sankofa-Coin!</h1>
            <p>Your journey to transform plastic into health intelligence begins now</p>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>Welcome to the Sankofa-Coin community! You're now part of a movement that's transforming plastic pollution into predictive health intelligence and healthcare access across Ghana.</p>
            
            <div class="feature">
              <h3>🌱 What You Can Do:</h3>
              <ul>
                <li><strong>Collect Plastic:</strong> Earn rewards while cleaning your community</li>
                <li><strong>Access Health Intelligence:</strong> Get AI-powered health insights for your area</li>
                <li><strong>Fund Healthcare:</strong> Use Health Tokens for NHIS enrollment</li>
                <li><strong>Make an Impact:</strong> Track your contribution to community health</li>
              </ul>
            </div>

            <div class="feature">
              <h3>🚀 Get Started:</h3>
              <p>Ready to make your first impact? Here's how to begin:</p>
              <ol>
                <li>Find your nearest collection hub</li>
                <li>Start collecting plastic waste</li>
                <li>Earn 70% cash + 30% Health Tokens</li>
                <li>Track your health impact</li>
              </ol>
            </div>

            <a href="${data.dashboardUrl}" class="button">Go to Dashboard</a>
            
            <p>Need help getting started? Our AI assistant is available 24/7 to answer your questions and provide personalized guidance.</p>
          </div>
          <div class="footer">
            <p>© 2025 Sankofa Ghana Ltd. All rights reserved.</p>
            <p>Se wo were fi na wosankofa a yenkyi — It is not wrong to go back for that which you have forgotten</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  collectionConfirmation: (data) => ({
    subject: 'Collection Confirmed - Your Impact is Growing!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Collection Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #14b8a6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat { text-align: center; background: white; padding: 20px; border-radius: 8px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Collection Confirmed!</h1>
            <p>Thank you for making a difference</p>
          </div>
          <div class="content">
            <h2>Great work, ${data.name}!</h2>
            <p>Your plastic collection has been processed and confirmed. Here's your impact summary:</p>
            
            <div class="stats">
              <div class="stat">
                <h3>${data.weight} kg</h3>
                <p>Plastic Collected</p>
              </div>
              <div class="stat">
                <h3>GH₵${data.cashAmount}</h3>
                <p>Cash Earned</p>
              </div>
              <div class="stat">
                <h3>GH₵${data.healthTokens}</h3>
                <p>Health Tokens</p>
              </div>
            </div>

            <p><strong>Environmental Impact:</strong></p>
            <ul>
              <li>${data.co2Reduced} kg CO₂ emissions prevented</li>
              <li>${data.waterSaved} liters of water saved</li>
              <li>${data.energySaved} kWh of energy saved</li>
            </ul>

            <p><strong>Health Impact:</strong></p>
            <p>Your collection contributes to reducing disease risk in your community and helps fund healthcare access for fellow Ghanaians.</p>

            <a href="${data.dashboardUrl}" class="button">View Full Impact</a>
          </div>
          <div class="footer">
            <p>© 2025 Sankofa Ghana Ltd. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  donationThankYou: (data) => ({
    subject: 'Thank You for Your Donation - Making a Real Impact!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Your Donation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FBBF24, #F59E0B); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .impact { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #FBBF24; }
          .button { display: inline-block; background: #FBBF24; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💛 Thank You for Your Generosity!</h1>
            <p>Your donation is already making a difference</p>
          </div>
          <div class="content">
            <h2>Dear ${data.name},</h2>
            <p>Thank you for your generous donation of <strong>GH₵${data.amount}</strong> to Sankofa-Coin. Your contribution directly supports our mission to transform plastic pollution into predictive health intelligence and healthcare access across Ghana.</p>
            
            <div class="impact">
              <h3>Your Impact:</h3>
              <ul>
                ${data.impact.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>

            <p>Your donation will be allocated as follows:</p>
            <ul>
              <li><strong>${data.allocation.plasticCollection}%</strong> - Plastic collection programs</li>
              <li><strong>${data.allocation.healthcareAccess}%</strong> - Healthcare access funding</li>
              <li><strong>${data.allocation.healthIntelligence}%</strong> - AI health intelligence</li>
              <li><strong>${data.allocation.operations}%</strong> - Operations and administration</li>
            </ul>

            <p>We'll keep you updated on the impact of your donation through regular reports and stories from the communities you're helping.</p>

            <a href="${data.impactUrl}" class="button">Track Your Impact</a>
          </div>
          <div class="footer">
            <p>© 2025 Sankofa Ghana Ltd. All rights reserved.</p>
            <p>Donation Receipt: ${data.receiptNumber}</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send email function
const sendEmail = async ({ email, subject, template, data, html, text }) => {
  try {
    // COMMENTED OUT: Email service disabled for development
    logger.warn('Email service is disabled for development - email would have been sent to:', email);
    logger.info('Email content:', { subject, template, data });
    
    // Return a mock success response for development
    return {
      messageId: `dev-${Date.now()}`,
      accepted: [email],
      rejected: [],
      pending: [],
      response: 'Email service disabled for development'
    };
    
    /* ORIGINAL CODE - COMMENTED OUT
    const transporter = createTransporter();

    let emailContent;
    if (template && templates[template]) {
      emailContent = templates[template](data);
    } else {
      emailContent = { subject, html, text };
    }

    const mailOptions = {
      from: `"Sankofa-Coin" <${process.env.SMTP_USER}>`,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text || emailContent.html.replace(/<[^>]*>/g, '')
    };

    const result = await transporter.sendMail(mailOptions);
    
    logger.info('Email sent successfully', {
      to: email,
      subject: emailContent.subject,
      messageId: result.messageId
    });

    return result;
    */
  } catch (error) {
    logger.error('Email sending failed', {
      to: email,
      subject,
      error: error.message
    });
    throw error;
  }
};

// Send bulk emails
const sendBulkEmail = async (emails, template, data) => {
  const results = [];
  const errors = [];

  for (const email of emails) {
    try {
      const result = await sendEmail({ email, template, data });
      results.push({ email, success: true, messageId: result.messageId });
    } catch (error) {
      errors.push({ email, success: false, error: error.message });
    }
  }

  logger.info('Bulk email completed', {
    total: emails.length,
    successful: results.length,
    failed: errors.length
  });

  return { results, errors };
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    logger.info('Email configuration verified successfully');
    return true;
  } catch (error) {
    logger.error('Email configuration verification failed', error);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  verifyEmailConfig,
  templates,
  // Convenience functions
  sendVerificationEmail: async (email, name, code) => {
    return sendEmail({
      email,
      template: 'verification',
      data: { name, code }
    });
  },
  sendWelcomeEmail: async (email, name) => {
    return sendEmail({
      email,
      template: 'welcome',
      data: { name }
    });
  },
  sendCollectionConfirmationEmail: async (email, data) => {
    return sendEmail({
      email,
      template: 'collectionConfirmed',
      data
    });
  },
  sendPaymentNotificationEmail: async (email, name, paymentData) => {
    return sendEmail({
      email,
      template: 'paymentReceived',
      data: { name, ...paymentData }
    });
  },
  sendPasswordResetEmail: async (email, name, resetUrl) => {
    return sendEmail({
      email,
      template: 'passwordReset',
      data: { name, resetUrl }
    });
  },
  sendHubManagerNotification: async (email, notificationData) => {
    return sendEmail({
      email,
      subject: `Hub Notification: ${notificationData.message}`,
      html: `<p>${notificationData.message}</p>`,
      text: notificationData.message
    });
  },
  renderTemplate: (templateName, data) => {
    if (templates[templateName]) {
      return templates[templateName](data).html;
    }
    return '';
  },
  renderPlainText: (templateName, data) => {
    if (templates[templateName]) {
      const html = templates[templateName](data).html;
      return html.replace(/<[^>]*>/g, '');
    }
    return '';
  }
};
