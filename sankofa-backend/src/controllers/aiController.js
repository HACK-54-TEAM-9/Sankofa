const AIInteraction = require('../models/AIInteraction');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const { matchQuestion } = require('../utils/chatbotResponses');
const { OpenAI } = require('openai');

// Initialize OpenAI client
console.log('🔑 OpenAI API Key available:', !!process.env.OPENAI_API_KEY);
console.log('🔑 API Key starts with:', process.env.OPENAI_API_KEY?.substring(0, 10));
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;
console.log('✅ OpenAI client initialized:', !!openai);

// @desc    Public chat with AI assistant (no auth required)
// @route   POST /api/ai/chat-public
// @access  Public
const chatPublic = asyncHandler(async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    throw new AppError('Message is required', 400);
  }

  // Use comprehensive chatbot response system
  const aiResponse = matchQuestion(message);

  res.json({
    success: true,
    data: {
      response: aiResponse
    }
  });
});

// @desc    General AI Assistant (Ollama/OpenAI-powered for any question)
// @route   POST /api/ai/assistant
// @access  Public
const aiAssistant = asyncHandler(async (req, res) => {
  const { message, conversationHistory } = req.body;
  
  if (!message) {
    throw new AppError('Message is required', 400);
  }

  console.log('🤖 aiAssistant called - message:', message.substring(0, 50));

  try {
    // Try Ollama first (free, local AI)
    try {
      console.log('🦙 Attempting to use Ollama...');
      const axios = require('axios');
      
      // Build conversation context for Ollama
      let prompt = `You are Sankofa AI, an intelligent assistant integrated into the Sankofa application. 

About Sankofa:
- Sankofa transforms plastic pollution into healthcare access in Ghana
- Collectors gather plastic waste and earn money + health tokens
- We use AI to predict disease outbreaks based on plastic pollution data
- 50,000+ collectors, 100+ hubs across Ghana
- Payment rates: PET ~GHS 2.5/kg, HDPE ~GHS 2/kg, LDPE ~GHS 1.5/kg
- Health tokens can be used for medical care at partner clinics

Your Role:
- Answer ANY question the user asks (general knowledge, tech, health, environment, etc.)
- When relevant, relate answers back to Sankofa's mission and services
- Be helpful, friendly, and conversational
- Provide accurate, concise, and actionable information
- If asked about Sankofa specifically, provide detailed information

Tone: Friendly, helpful, intelligent, and encouraging

`;

      // Add conversation history if provided
      if (conversationHistory && Array.isArray(conversationHistory)) {
        prompt += '\nConversation history:\n';
        conversationHistory.forEach(msg => {
          prompt += `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}\n`;
        });
      }

      // Add current message
      prompt += `\nUser: ${message}\nAssistant:`;

      const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama3.2',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 500
        }
      }, { timeout: 30000 });

      const aiResponse = ollamaResponse.data.response;

      console.log('✅ Ollama response received');
      return res.json({
        success: true,
        data: {
          response: aiResponse,
          source: 'ollama',
          model: 'llama3.2'
        }
      });

    } catch (ollamaError) {
      console.log('⚠️ Ollama not available, trying OpenAI...', ollamaError.message);
      
      // Fallback to OpenAI if available
      if (openai) {
        console.log('🚀 Calling OpenAI API with message:', message.substring(0, 50));
        
        // Build conversation context
        const messages = [
          {
            role: 'system',
            content: `You are Sankofa AI, an intelligent assistant integrated into the Sankofa application. 

About Sankofa:
- Sankofa transforms plastic pollution into healthcare access in Ghana
- Collectors gather plastic waste and earn money + health tokens
- We use AI to predict disease outbreaks based on plastic pollution data
- 50,000+ collectors, 100+ hubs across Ghana
- Payment rates: PET ~GHS 2.5/kg, HDPE ~GHS 2/kg, LDPE ~GHS 1.5/kg
- Health tokens can be used for medical care at partner clinics

Your Role:
- Answer ANY question the user asks (general knowledge, tech, health, environment, etc.)
- When relevant, relate answers back to Sankofa's mission and services
- Be helpful, friendly, and conversational
- Provide accurate, concise, and actionable information
- If asked about Sankofa specifically, provide detailed information

Tone: Friendly, helpful, intelligent, and encouraging`
          }
        ];

        // Add conversation history if provided
        if (conversationHistory && Array.isArray(conversationHistory)) {
          conversationHistory.forEach(msg => {
            messages.push({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            });
          });
        }

        // Add current message
        messages.push({
          role: 'user',
          content: message
        });

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        });

        const aiResponse = completion.choices[0].message.content;

        return res.json({
          success: true,
          data: {
            response: aiResponse,
            source: 'openai',
            model: 'gpt-3.5-turbo'
          }
        });
      }
    }

  } catch (error) {
    console.log('❌ AI ERROR:', error.message);
    console.log('Error details:', error);
    logger.error('AI error:', error);
  }
  
  // Final fallback if both Ollama and OpenAI fail
  res.json({
    success: true,
    data: {
      response: "I'm currently in offline mode. Please install Ollama or configure OpenAI to enable full AI capabilities. In the meantime, you can ask me specific questions about Sankofa using the chatbot!",
      source: 'error-fallback'
    }
  });
});

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

// Helper function to generate AI response using OpenAI with context
const generateAIResponse = async (message, context, user) => {
  // If OpenAI is configured, use it for intelligent responses
  if (openai) {
    try {
      const { supabase } = require('../config/supabase');
      
      // Gather user context from database
      let userContext = '';
      
      if (user && user.id) {
        // Get user's recent collections
        const { data: collections } = await supabase
          .from('collections')
          .select('weight, plastic_type, cash_amount, created_at')
          .eq('collector_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (collections && collections.length > 0) {
          const totalWeight = collections.reduce((sum, c) => sum + parseFloat(c.weight || 0), 0);
          const totalEarnings = collections.reduce((sum, c) => sum + parseFloat(c.cash_amount || 0), 0);
          userContext += `\nUser Collection Stats: ${collections.length} recent collections, ${totalWeight.toFixed(2)}kg total, GHS ${totalEarnings.toFixed(2)} earned.`;
        }
        
        // Get user's health data if available
        const { data: healthData } = await supabase
          .from('health_data')
          .select('risk_level, diseases')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (healthData) {
          userContext += `\nUser Health: Risk level ${healthData.risk_level || 'unknown'}.`;
        }
      }
      
      // Build context-aware system message
      const systemMessage = `You are Sankofa AI, an intelligent assistant for the Sankofa platform in Ghana.

About Sankofa:
- Transforms plastic pollution into healthcare access
- Collectors earn money + health tokens for gathering plastic waste
- AI predicts disease outbreaks based on plastic pollution patterns
- 50,000+ collectors, 100+ hubs across Ghana
- Payment rates: PET ~GHS 2.5/kg, HDPE ~GHS 2/kg, LDPE ~GHS 1.5/kg
- Health tokens usable at partner clinics

${userContext}

Your Role:
- Provide personalized advice based on user's collection history and health data
- Answer questions about plastic collection, health risks, earning potential
- Give actionable recommendations for collection efficiency
- Explain health-environment connections
- Be encouraging, data-driven, and helpful

Context Type: ${context?.type || 'general'}
Tone: Friendly, intelligent, encouraging, and actionable`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 400
      });

      return completion.choices[0].message.content;
      
    } catch (error) {
      logger.error('OpenAI API error:', error);
      // Fallback to pattern matching
    }
  }
  
  // Fallback: Pattern-based responses
  const responses = {
    greeting: "Hello! I'm Sankofa AI, your health and environmental assistant. How can I help you today?",
    health: "Based on your location and health data, I recommend staying hydrated and avoiding areas with high plastic pollution. Consider wearing protective gear when collecting plastic.",
    collection: "Great job on your plastic collection efforts! Remember to sort plastics by type for better rewards. PET bottles typically yield the highest returns.",
    weather: "Current weather conditions are favorable for plastic collection. I recommend focusing on coastal areas where plastic tends to accumulate after storms.",
    default: "I understand you're asking about " + message + ". Let me provide you with some helpful information based on your profile and location."
  };

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

// Helper function to process voice input using OpenAI Whisper
const processVoiceInput = async (audioData, language) => {
  if (!openai) {
    logger.warn('OpenAI not configured, cannot process voice input');
    throw new AppError('Voice transcription service not available. Please configure OpenAI API key.', 503);
  }
  
  try {
    const fs = require('fs');
    const path = require('path');
    const crypto = require('crypto');
    
    // Create temporary file for audio data
    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const tempFileName = `voice_${crypto.randomBytes(16).toString('hex')}.webm`;
    const tempFilePath = path.join(tempDir, tempFileName);
    
    // Write audio data to temp file
    const audioBuffer = Buffer.from(audioData, 'base64');
    fs.writeFileSync(tempFilePath, audioBuffer);
    
    // Use OpenAI Whisper API for transcription
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: 'whisper-1',
      language: language === 'tw' ? 'tw' : language === 'ak' ? 'ak' : 'en' // Support Twi, Akan, English
    });
    
    // Clean up temp file
    fs.unlinkSync(tempFilePath);
    
    logger.info('Voice transcription successful', { language, textLength: transcription.text.length });
    
    return transcription.text;
    
  } catch (error) {
    logger.error('Voice transcription error:', error);
    throw new AppError('Failed to transcribe voice input: ' + error.message, 500);
  }
};

// Helper function to generate health recommendations using real data
const generateHealthRecommendations = async (location, userProfile, user) => {
  try {
    const { supabase } = require('../config/supabase');
    
    // Get health data for user's location
    let query = supabase
      .from('health_data')
      .select('risk_level, diseases, environmental_factors')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (location) {
      query = query.eq('location', location);
    }
    
    const { data: healthData } = await query;
    
    // Analyze health risks
    const riskLevels = healthData?.map(h => h.risk_level) || [];
    const avgRisk = riskLevels.length > 0 
      ? riskLevels.reduce((a, b) => a + b, 0) / riskLevels.length 
      : 50;
    
    const riskLevel = avgRisk > 70 ? 'High' : avgRisk > 40 ? 'Medium' : 'Low';
    
    // Get common diseases in area
    const diseases = healthData?.flatMap(h => h.diseases || []) || [];
    const diseaseFreq = diseases.reduce((acc, d) => {
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});
    const topDiseases = Object.entries(diseaseFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([disease]) => disease);
    
    // Build recommendations using OpenAI if available
    let recommendations = [];
    
    if (openai && topDiseases.length > 0) {
      try {
        const prompt = `As a health advisor for Sankofa platform, provide 4 brief, actionable health recommendations for a plastic collector in Ghana.
        
Risk Level: ${riskLevel}
Common diseases in area: ${topDiseases.join(', ')}
Location: ${location || 'General'}

Format: Return ONLY an array of 4 short recommendations (one sentence each), no numbering.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 200
        });
        
        const response = completion.choices[0].message.content;
        recommendations = response.split('\n').filter(r => r.trim()).slice(0, 4);
        
      } catch (error) {
        logger.error('OpenAI recommendation error:', error);
      }
    }
    
    // Fallback recommendations
    if (recommendations.length === 0) {
      recommendations = [
        "Stay hydrated, especially in hot weather",
        "Wear protective gloves and masks when collecting plastic",
        riskLevel === 'High' ? "Avoid areas with high pollution levels" : "Monitor air quality in your collection areas",
        "Take regular breaks and wash hands frequently"
      ];
    }
    
    return {
      recommendations,
      riskLevel,
      topDiseases: topDiseases.slice(0, 3),
      lastUpdated: new Date(),
      location: location || 'General'
    };
    
  } catch (error) {
    logger.error('Health recommendations error:', error);
    
    return {
      recommendations: [
        "Stay hydrated and wear protective gear",
        "Wash hands frequently after handling plastic",
        "Take breaks during collection activities",
        "Monitor your health regularly"
      ],
      riskLevel: "Medium",
      lastUpdated: new Date()
    };
  }
};

// Helper function to generate collection advice using real data
const generateCollectionAdvice = async (location, weather, userLevel, user) => {
  try {
    const { supabase } = require('../config/supabase');
    
    // Get user's collection history if authenticated
    let userStats = null;
    if (user && user.id) {
      const { data: collections } = await supabase
        .from('collections')
        .select('weight, plastic_type, cash_amount, location')
        .eq('collector_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (collections && collections.length > 0) {
        const totalWeight = collections.reduce((sum, c) => sum + parseFloat(c.weight || 0), 0);
        const totalEarnings = collections.reduce((sum, c) => sum + parseFloat(c.cash_amount || 0), 0);
        const avgPerKg = totalWeight > 0 ? totalEarnings / totalWeight : 0;
        
        // Find most profitable plastic type
        const plasticTypes = collections.reduce((acc, c) => {
          if (!acc[c.plastic_type]) acc[c.plastic_type] = { weight: 0, earnings: 0 };
          acc[c.plastic_type].weight += parseFloat(c.weight || 0);
          acc[c.plastic_type].earnings += parseFloat(c.cash_amount || 0);
          return acc;
        }, {});
        
        const bestPlastic = Object.entries(plasticTypes)
          .map(([type, stats]) => ({ 
            type, 
            rate: stats.weight > 0 ? stats.earnings / stats.weight : 0 
          }))
          .sort((a, b) => b.rate - a.rate)[0];
        
        userStats = {
          totalCollections: collections.length,
          avgPerKg: avgPerKg.toFixed(2),
          bestPlastic: bestPlastic?.type || 'PET'
        };
      }
    }
    
    // Get high-performing locations
    const { data: topHubs } = await supabase
      .from('hubs')
      .select('name, location, capacity')
      .eq('status', 'active')
      .order('capacity', { ascending: false })
      .limit(3);
    
    const bestLocations = topHubs?.map(h => h.location || h.name) || 
      ["Beach areas", "Market places", "Riverside"];
    
    // Generate advice using OpenAI if available
    let advice = [];
    
    if (openai && userStats) {
      try {
        const prompt = `As a collection advisor for Sankofa, provide 4 brief, actionable tips for a plastic collector in Ghana.

User Level: ${userLevel || 'Intermediate'}
User Stats: ${userStats.totalCollections} collections, GHS ${userStats.avgPerKg}/kg average, best plastic: ${userStats.bestPlastic}
Weather: ${weather || 'Sunny'}
Location: ${location || 'General'}

Format: Return ONLY an array of 4 short tips (one sentence each), no numbering.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 200
        });
        
        const response = completion.choices[0].message.content;
        advice = response.split('\n').filter(r => r.trim()).slice(0, 4);
        
      } catch (error) {
        logger.error('OpenAI advice error:', error);
      }
    }
    
    // Fallback advice
    if (advice.length === 0) {
      advice = [
        "Focus on PET bottles - they typically yield GHS 2.5/kg",
        weather === 'rainy' ? "After rain, check drainage areas for accumulated plastic" : "Early morning collections often yield better results",
        userStats ? `Continue with ${userStats.bestPlastic} - it's your most profitable type` : "Sort plastics by type for better pricing",
        "Bring sturdy bags and gloves for efficient collection"
      ];
    }
    
    return {
      advice,
      bestLocations,
      optimalTime: weather === 'rainy' ? "After rain stops" : "Early morning or late afternoon",
      userStats: userStats || { message: "Login to see personalized stats" }
    };
    
  } catch (error) {
    logger.error('Collection advice error:', error);
    
    return {
      advice: [
        "Focus on PET bottles for higher rewards (GHS 2.5/kg)",
        "Check weather conditions before heading out",
        "Bring proper sorting containers",
        "Stay safe and hydrated during collection"
      ],
      bestLocations: ["Beach areas", "Market places", "Riverside"],
      optimalTime: "Early morning or late afternoon"
    };
  }
};

// Helper function to generate AI insights using real data and predictions
const generateAIInsights = async (type, location, user) => {
  try {
    const { supabase } = require('../config/supabase');
    
    const insights = [];
    const predictions = [];
    
    // Get user's collection data
    if (user && user.id) {
      const { data: recentCollections } = await supabase
        .from('collections')
        .select('weight, cash_amount, created_at')
        .eq('collector_id', user.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });
      
      const { data: previousCollections } = await supabase
        .from('collections')
        .select('weight, cash_amount')
        .eq('collector_id', user.id)
        .gte('created_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString())
        .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
      
      if (recentCollections && recentCollections.length > 0) {
        const recentTotal = recentCollections.reduce((sum, c) => sum + parseFloat(c.weight || 0), 0);
        const recentEarnings = recentCollections.reduce((sum, c) => sum + parseFloat(c.cash_amount || 0), 0);
        const previousTotal = previousCollections?.reduce((sum, c) => sum + parseFloat(c.weight || 0), 0) || 0;
        
        const efficiency = previousTotal > 0 
          ? ((recentTotal - previousTotal) / previousTotal * 100).toFixed(1)
          : 0;
        
        if (efficiency > 0) {
          insights.push(`Your collection efficiency has improved by ${efficiency}% this month`);
        } else if (efficiency < -10) {
          insights.push(`Collection volume is down ${Math.abs(efficiency)}% - consider exploring new areas`);
        } else {
          insights.push(`Maintaining steady collection rate of ${(recentTotal / 30).toFixed(2)}kg/day`);
        }
        
        insights.push(`Total earnings this month: GHS ${recentEarnings.toFixed(2)}`);
        
        // Calculate CO2 impact
        const co2Saved = recentTotal * 0.2; // 1kg plastic = ~0.2kg CO2 saved
        insights.push(`Environmental impact: ${co2Saved.toFixed(2)}kg CO2 emissions prevented`);
      }
    }
    
    // Get health risk insights
    const { data: healthData } = await supabase
      .from('health_data')
      .select('risk_level, diseases')
      .eq('location', location || 'general')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (healthData && healthData.length > 0) {
      const avgRisk = healthData.reduce((sum, h) => sum + (h.risk_level || 50), 0) / healthData.length;
      const riskLevel = avgRisk > 70 ? 'high' : avgRisk > 40 ? 'medium' : 'low';
      insights.push(`Health risk in your area is currently ${riskLevel}`);
      
      // Predict future risk trend
      if (healthData.length > 5) {
        const recentAvg = healthData.slice(0, 5).reduce((sum, h) => sum + (h.risk_level || 50), 0) / 5;
        const olderAvg = healthData.slice(5).reduce((sum, h) => sum + (h.risk_level || 50), 0) / (healthData.length - 5);
        
        if (recentAvg > olderAvg + 10) {
          predictions.push("Health risk may increase in coming weeks - take extra precautions");
        } else if (recentAvg < olderAvg - 10) {
          predictions.push("Health risk trending downward - good news for your area");
        }
      }
    }
    
    // Get collection trends
    const { data: allCollections } = await supabase
      .from('collections')
      .select('weight, created_at')
      .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });
    
    if (allCollections && allCollections.length > 20) {
      const firstWeek = allCollections.slice(0, Math.floor(allCollections.length / 2));
      const secondWeek = allCollections.slice(Math.floor(allCollections.length / 2));
      
      const firstWeekTotal = firstWeek.reduce((sum, c) => sum + parseFloat(c.weight || 0), 0);
      const secondWeekTotal = secondWeek.reduce((sum, c) => sum + parseFloat(c.weight || 0), 0);
      
      if (secondWeekTotal > firstWeekTotal * 1.1) {
        predictions.push("Collection opportunities are increasing - good time to collect more");
      } else if (secondWeekTotal < firstWeekTotal * 0.9) {
        predictions.push("Collection volume declining - consider new locations");
      } else {
        predictions.push("Stable collection opportunities expected to continue");
      }
    }
    
    // Add default insights if none generated
    if (insights.length === 0) {
      insights.push("Start collecting to see personalized insights");
      insights.push("Your environmental impact will be tracked here");
    }
    
    if (predictions.length === 0) {
      predictions.push("More data needed for accurate predictions");
    }
    
    return {
      insights,
      predictions,
      type: type || 'general',
      location: location || 'general',
      generatedAt: new Date()
    };
    
  } catch (error) {
    logger.error('AI insights error:', error);
    
    return {
      insights: [
        "Your environmental impact is significant",
        "Continue collecting to see detailed insights"
      ],
      predictions: [
        "Collection opportunities expected to remain stable"
      ]
    };
  }
};

module.exports = {
  chatPublic,
  aiAssistant,
  chatWithAI,
  voiceInteraction,
  getHealthRecommendations,
  getCollectionAdvice,
  getAIHistory,
  getAIInsights,
  provideFeedback
};
