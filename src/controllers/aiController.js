const AIInteraction = require('../models/AIInteraction');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
// @access  Private
const chatWithAI = asyncHandler(async (req, res) => {
  const { message, context } = req.body;
  
  if (!message) {
    throw new AppError('Message is required', 400);
  }

  // Simulate AI response (replace with actual AI integration)
  const aiResponse = await generateAIResponse(message, context, req.user);
  
  // Save interaction
  const interaction = await AIInteraction.create({
    user: req.user.id,
    query: message,
    response: aiResponse,
    context: context || {}
  });

  logger.info('AI interaction logged', { userId: req.user.id, queryLength: message.length });

  res.json({
    success: true,
    data: {
      response: aiResponse,
      interactionId: interaction._id
    }
  });
});

// @desc    Voice interaction with AI
// @route   POST /api/ai/voice
// @access  Private
const voiceInteraction = asyncHandler(async (req, res) => {
  const { audioData, language = 'en' } = req.body;
  
  if (!audioData) {
    throw new AppError('Audio data is required', 400);
  }

  // Simulate voice processing (replace with actual voice processing)
  const transcribedText = await processVoiceInput(audioData, language);
  const aiResponse = await generateAIResponse(transcribedText, { type: 'voice' }, req.user);
  
  // Save interaction
  const interaction = await AIInteraction.create({
    user: req.user.id,
    query: transcribedText,
    response: aiResponse,
    context: { type: 'voice', language }
  });

  res.json({
    success: true,
    data: {
      transcribedText,
      response: aiResponse,
      interactionId: interaction._id
    }
  });
});

// @desc    Get health recommendations
// @route   GET /api/ai/health-recommendations
// @access  Private
const getHealthRecommendations = asyncHandler(async (req, res) => {
  const { location, userProfile } = req.query;
  
  const recommendations = await generateHealthRecommendations(location, userProfile, req.user);
  
  res.json({
    success: true,
    data: { recommendations }
  });
});

// @desc    Get collection advice
// @route   GET /api/ai/collection-advice
// @access  Private
const getCollectionAdvice = asyncHandler(async (req, res) => {
  const { location, weather, userLevel } = req.query;
  
  const advice = await generateCollectionAdvice(location, weather, userLevel, req.user);
  
  res.json({
    success: true,
    data: { advice }
  });
});

// @desc    Get AI interaction history
// @route   GET /api/ai/history
// @access  Private
const getAIHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  const interactions = await AIInteraction.find({ user: req.user.id })
    .sort({ timestamp: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await AIInteraction.countDocuments({ user: req.user.id });

  res.json({
    success: true,
    data: {
      interactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get AI insights
// @route   GET /api/ai/insights
// @access  Private
const getAIInsights = asyncHandler(async (req, res) => {
  const { type, location } = req.query;
  
  const insights = await generateAIInsights(type, location, req.user);
  
  res.json({
    success: true,
    data: { insights }
  });
});

// @desc    Provide feedback on AI response
// @route   POST /api/ai/feedback
// @access  Private
const provideFeedback = asyncHandler(async (req, res) => {
  const { interactionId, rating, feedback } = req.body;
  
  const interaction = await AIInteraction.findByIdAndUpdate(
    interactionId,
    { 
      feedback: { rating, comment: feedback },
      feedbackDate: new Date()
    },
    { new: true }
  );

  if (!interaction) {
    throw new AppError('AI interaction not found', 404);
  }

  res.json({
    success: true,
    message: 'Feedback submitted successfully'
  });
});

// Helper function to generate AI response
const generateAIResponse = async (message, context, user) => {
  // This is a mock implementation
  // In production, integrate with OpenAI GPT-4 or similar AI service
  
  const responses = {
    greeting: "Hello! I'm Sankofa AI, your health and environmental assistant. How can I help you today?",
    health: "Based on your location and health data, I recommend staying hydrated and avoiding areas with high plastic pollution. Consider wearing protective gear when collecting plastic.",
    collection: "Great job on your plastic collection efforts! Remember to sort plastics by type for better rewards. PET bottles typically yield the highest returns.",
    weather: "Current weather conditions are favorable for plastic collection. I recommend focusing on coastal areas where plastic tends to accumulate after storms.",
    default: "I understand you're asking about " + message + ". Let me provide you with some helpful information based on your profile and location."
  };

  // Simple keyword matching for demo purposes
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return responses.greeting;
  } else if (lowerMessage.includes('health') || lowerMessage.includes('disease')) {
    return responses.health;
  } else if (lowerMessage.includes('collect') || lowerMessage.includes('plastic')) {
    return responses.collection;
  } else if (lowerMessage.includes('weather') || lowerMessage.includes('rain')) {
    return responses.weather;
  } else {
    return responses.default;
  }
};

// Helper function to process voice input
const processVoiceInput = async (audioData, language) => {
  // Mock voice processing
  // In production, integrate with speech-to-text service
  return "This is a mock transcription of your voice input";
};

// Helper function to generate health recommendations
const generateHealthRecommendations = async (location, userProfile, user) => {
  return {
    recommendations: [
      "Stay hydrated, especially in hot weather",
      "Wear protective gear when collecting plastic",
      "Avoid areas with high pollution levels",
      "Take regular breaks during collection activities"
    ],
    riskLevel: "Medium",
    lastUpdated: new Date()
  };
};

// Helper function to generate collection advice
const generateCollectionAdvice = async (location, weather, userLevel, user) => {
  return {
    advice: [
      "Focus on PET bottles for higher rewards",
      "Check weather conditions before heading out",
      "Bring proper sorting containers",
      "Stay safe and hydrated"
    ],
    bestLocations: ["Beach areas", "Market places", "Riverside"],
    optimalTime: "Early morning or late afternoon"
  };
};

// Helper function to generate AI insights
const generateAIInsights = async (type, location, user) => {
  return {
    insights: [
      "Your collection efficiency has improved by 15% this month",
      "Health risk in your area is currently low",
      "Consider expanding to new collection areas",
      "Your environmental impact is significant"
    ],
    predictions: [
      "Expected increase in plastic accumulation due to weather patterns",
      "Health risk may increase in coming weeks",
      "Collection opportunities will be abundant next week"
    ]
  };
};

module.exports = {
  chatWithAI,
  voiceInteraction,
  getHealthRecommendations,
  getCollectionAdvice,
  getAIHistory,
  getAIInsights,
  provideFeedback
};
