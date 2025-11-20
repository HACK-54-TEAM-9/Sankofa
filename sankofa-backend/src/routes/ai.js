const express = require('express');
const { body } = require('express-validator');
const {
  chatPublic,
  aiAssistant,
  chatWithAI,
  getAIInsights,
  getVoiceResponse,
  getHealthRecommendations,
  getCollectionAdvice,
  getLocationBasedInsights,
  getAIInteractionHistory,
  getPopularQueries,
  getAIPerformanceMetrics,
  provideFeedback
} = require('../controllers/aiController');
const { protect, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Validation rules
const chatValidation = [
  body('message')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('type')
    .optional()
    .isIn(['chat', 'voice', 'query', 'insight_request', 'health_analysis'])
    .withMessage('Invalid interaction type')
];

const feedbackValidation = [
  body('helpful')
    .isBoolean()
    .withMessage('Helpful must be a boolean value'),
  body('accuracy')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Accuracy must be between 1 and 5'),
  body('relevance')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Relevance must be between 1 and 5')
];

// Public routes (with optional auth for enhanced features)
router.post('/chat-public', chatValidation, asyncHandler(chatPublic));
router.post('/assistant', chatValidation, asyncHandler(aiAssistant));
router.get('/insights', optionalAuth, asyncHandler(getAIInsights));
router.get('/popular-queries', asyncHandler(getPopularQueries));
router.get('/performance', asyncHandler(getAIPerformanceMetrics));

// Root endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI API endpoint',
    version: '1.0.0',
    endpoints: {
      chat: 'POST /api/ai/chat',
      insights: 'GET /api/ai/insights',
      voice: 'POST /api/ai/voice',
      history: 'GET /api/ai/history'
    }
  });
});

// Protected routes
router.use(protect);

// AI interaction routes
router.post('/chat', chatValidation, asyncHandler(chatWithAI));
router.post('/voice', chatValidation, asyncHandler(getVoiceResponse));
router.get('/health-recommendations', asyncHandler(getHealthRecommendations));
router.get('/collection-advice', asyncHandler(getCollectionAdvice));
router.get('/location-insights', asyncHandler(getLocationBasedInsights));
router.get('/history', asyncHandler(getAIInteractionHistory));
router.post('/feedback/:interactionId', feedbackValidation, asyncHandler(provideFeedback));

module.exports = router;
