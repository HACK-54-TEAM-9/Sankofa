const { handleUSSDSession } = require('../services/smsService');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// @desc    Handle USSD callback
// @route   POST /api/ussd/callback
// @access  Public (called by USSD gateway)
const handleUSSDCallback = asyncHandler(async (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  if (!sessionId || !phoneNumber) {
    throw new AppError('Session ID and phone number are required', 400);
  }

  logger.info('USSD request received', {
    sessionId,
    serviceCode,
    phoneNumber,
    input: text
  });

  // Parse user input (last selection in the text string)
  const inputs = text ? text.split('*') : [];
  const lastInput = inputs.length > 0 ? inputs[inputs.length - 1] : '';

  // Handle USSD session
  const response = await handleUSSDSession(sessionId, phoneNumber, lastInput);

  // Format response based on session status
  const ussdResponse = response.continueSession
    ? `CON ${response.text}`
    : `END ${response.text}`;

  logger.info('USSD response sent', {
    sessionId,
    continueSession: response.continueSession
  });

  // Return USSD-formatted response
  res.set('Content-Type', 'text/plain');
  res.send(ussdResponse);
});

// @desc    Get USSD service status
// @route   GET /api/ussd/status
// @access  Private (Admin)
const getUSSDStatus = asyncHandler(async (req, res) => {
  const { supabaseAdmin } = require('../config/supabase');

  // Get active USSD sessions
  const { data: sessions, error } = await supabaseAdmin
    .from('ussd_sessions')
    .select('*')
    .gte('updated_at', new Date(Date.now() - 3600000).toISOString()); // Last hour

  if (error) {
    logger.error('Error fetching USSD sessions:', error);
  }

  res.json({
    success: true,
    data: {
      service: 'active',
      activeSessions: sessions?.length || 0,
      sessions: sessions || []
    }
  });
});

// @desc    Test USSD flow (for development/testing)
// @route   POST /api/ussd/test
// @access  Private (Admin)
const testUSSDFlow = asyncHandler(async (req, res) => {
  const { phoneNumber, input } = req.body;

  if (!phoneNumber) {
    throw new AppError('Phone number is required', 400);
  }

  const sessionId = `test_${Date.now()}`;
  
  const response = await handleUSSDSession(sessionId, phoneNumber, input || '');

  res.json({
    success: true,
    data: {
      sessionId,
      response: response.text,
      endSession: response.endSession,
      formattedResponse: response.endSession
        ? `END ${response.text}`
        : `CON ${response.text}`
    }
  });
});

module.exports = {
  handleUSSDCallback,
  getUSSDStatus,
  testUSSDFlow
};
