const mongoose = require('mongoose');

const aiInteractionSchema = new mongoose.Schema({
  // User Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  
  // Session Information
  sessionId: {
    type: String,
    required: [true, 'Session ID is required']
  },
  
  // Interaction Type
  type: {
    type: String,
    enum: ['chat', 'voice', 'query', 'insight_request', 'health_analysis'],
    required: [true, 'Interaction type is required']
  },
  
  // Input Data
  input: {
    text: String,
    audioUrl: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    },
    context: {
      previousInteractions: [String],
      userPreferences: mongoose.Schema.Types.Mixed,
      currentPage: String
    }
  },
  
  // AI Processing
  processing: {
    model: {
      type: String,
      default: 'gpt-4'
    },
    modelVersion: String,
    processingTime: Number, // milliseconds
    tokensUsed: {
      input: Number,
      output: Number,
      total: Number
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // Response Data
  response: {
    text: String,
    audioUrl: String,
    insights: [{
      type: {
        type: String,
        enum: ['health_risk', 'collection_tip', 'location_insight', 'general_info', 'action_recommendation']
      },
      content: String,
      confidence: Number,
      source: String
    }],
    recommendations: [{
      action: String,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent']
      },
      reasoning: String
    }],
    data: {
      healthMetrics: mongoose.Schema.Types.Mixed,
      collectionOpportunities: [mongoose.Schema.Types.Mixed],
      locationData: mongoose.Schema.Types.Mixed
    }
  },
  
  // Health Intelligence
  healthIntelligence: {
    riskAssessment: {
      overallRisk: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      riskScore: Number,
      riskFactors: [String],
      mitigationStrategies: [String]
    },
    diseaseInsights: [{
      disease: String,
      riskLevel: String,
      trend: String,
      preventionTips: [String]
    }],
    environmentalFactors: {
      airQuality: String,
      waterQuality: String,
      plasticPollution: String,
      vectorBreeding: String
    }
  },
  
  // Collection Intelligence
  collectionIntelligence: {
    nearbyHubs: [{
      hubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hub'
      },
      distance: Number,
      operatingHours: String,
      currentCapacity: Number
    }],
    optimalTimes: [String],
    recommendedPlasticTypes: [String],
    expectedEarnings: {
      min: Number,
      max: Number,
      average: Number
    }
  },
  
  // User Feedback
  feedback: {
    helpful: {
      type: Boolean,
      default: null
    },
    accuracy: {
      type: Number,
      min: 1,
      max: 5
    },
    relevance: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    reportedIssues: [String]
  },
  
  // Follow-up Actions
  followUp: {
    scheduled: {
      type: Boolean,
      default: false
    },
    scheduledDate: Date,
    actionType: String,
    completed: {
      type: Boolean,
      default: false
    },
    completionDate: Date
  },
  
  // Privacy and Security
  privacy: {
    dataRetention: {
      type: Number,
      default: 90 // days
    },
    anonymized: {
      type: Boolean,
      default: false
    },
    sharedWithPartners: {
      type: Boolean,
      default: false
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed', 'archived'],
    default: 'processing'
  },
  
  // Error Handling
  error: {
    code: String,
    message: String,
    details: mongoose.Schema.Types.Mixed
  },
  
  // Audit Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
aiInteractionSchema.index({ user: 1, createdAt: -1 });
aiInteractionSchema.index({ sessionId: 1 });
aiInteractionSchema.index({ type: 1 });
aiInteractionSchema.index({ status: 1 });
aiInteractionSchema.index({ 'input.location.coordinates': '2dsphere' });
aiInteractionSchema.index({ createdAt: -1 });
aiInteractionSchema.index({ 'followUp.scheduledDate': 1 });

// Virtual for interaction duration
aiInteractionSchema.virtual('interactionDuration').get(function() {
  if (this.processing.processingTime) {
    return this.processing.processingTime;
  }
  return null;
});

// Virtual for user satisfaction
aiInteractionSchema.virtual('userSatisfaction').get(function() {
  if (this.feedback.accuracy && this.feedback.relevance) {
    return (this.feedback.accuracy + this.feedback.relevance) / 2;
  }
  return null;
});

// Pre-save middleware to calculate tokens
aiInteractionSchema.pre('save', function(next) {
  if (this.isModified('input.text') || this.isModified('response.text')) {
    // Rough token estimation (1 token ≈ 4 characters)
    const inputTokens = this.input.text ? Math.ceil(this.input.text.length / 4) : 0;
    const outputTokens = this.response.text ? Math.ceil(this.response.text.length / 4) : 0;
    
    this.processing.tokensUsed = {
      input: inputTokens,
      output: outputTokens,
      total: inputTokens + outputTokens
    };
  }
  next();
});

// Pre-save middleware to set data retention
aiInteractionSchema.pre('save', function(next) {
  if (this.isNew) {
    // Set automatic deletion date
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() + this.privacy.dataRetention);
    this.privacy.dataRetention = retentionDate;
  }
  next();
});

// Instance method to generate health insights
aiInteractionSchema.methods.generateHealthInsights = function() {
  const insights = [];
  
  if (this.healthIntelligence.riskAssessment) {
    const risk = this.healthIntelligence.riskAssessment;
    insights.push({
      type: 'health_risk',
      content: `Health risk assessment: ${risk.overallRisk} risk level with score ${risk.riskScore}/100`,
      confidence: 85,
      source: 'AI Health Model'
    });
  }
  
  if (this.healthIntelligence.diseaseInsights.length > 0) {
    this.healthIntelligence.diseaseInsights.forEach(disease => {
      insights.push({
        type: 'health_risk',
        content: `${disease.disease}: ${disease.riskLevel} risk, ${disease.trend} trend`,
        confidence: 80,
        source: 'Health Data Analysis'
      });
    });
  }
  
  this.response.insights = insights;
  return insights;
};

// Instance method to generate collection recommendations
aiInteractionSchema.methods.generateCollectionRecommendations = function() {
  const recommendations = [];
  
  if (this.collectionIntelligence.nearbyHubs.length > 0) {
    recommendations.push({
      action: 'Visit nearby collection hub',
      priority: 'medium',
      reasoning: `${this.collectionIntelligence.nearbyHubs.length} hubs available within your area`
    });
  }
  
  if (this.collectionIntelligence.optimalTimes.length > 0) {
    recommendations.push({
      action: 'Collect during optimal times',
      priority: 'low',
      reasoning: `Best collection times: ${this.collectionIntelligence.optimalTimes.join(', ')}`
    });
  }
  
  if (this.collectionIntelligence.expectedEarnings) {
    recommendations.push({
      action: 'Start collecting plastic',
      priority: 'high',
      reasoning: `Expected earnings: GH₵${this.collectionIntelligence.expectedEarnings.min}-${this.collectionIntelligence.expectedEarnings.max} per collection`
    });
  }
  
  this.response.recommendations = recommendations;
  return recommendations;
};

// Instance method to calculate confidence score
aiInteractionSchema.methods.calculateConfidence = function() {
  let confidence = 50; // Base confidence
  
  // Increase confidence based on data quality
  if (this.input.location && this.input.location.coordinates) {
    confidence += 20;
  }
  
  if (this.input.context && this.input.context.previousInteractions.length > 0) {
    confidence += 15;
  }
  
  if (this.response.insights && this.response.insights.length > 0) {
    confidence += 15;
  }
  
  // Decrease confidence for errors
  if (this.error) {
    confidence -= 30;
  }
  
  this.processing.confidence = Math.max(0, Math.min(100, confidence));
  return this.processing.confidence;
};

// Static method to get user interaction history
aiInteractionSchema.statics.getUserHistory = function(userId, limit = 50) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('type input.text response.text createdAt feedback');
};

// Static method to get popular queries
aiInteractionSchema.statics.getPopularQueries = function(limit = 20) {
  return this.aggregate([
    { $match: { type: 'query', status: 'completed' } },
    { $group: { _id: '$input.text', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
};

// Static method to get AI performance metrics
aiInteractionSchema.statics.getAIPerformanceMetrics = function(dateRange = null) {
  const matchStage = { status: 'completed' };
  if (dateRange) {
    matchStage.createdAt = {
      $gte: dateRange.start,
      $lte: dateRange.end
    };
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalInteractions: { $sum: 1 },
        averageProcessingTime: { $avg: '$processing.processingTime' },
        averageConfidence: { $avg: '$processing.confidence' },
        averageTokensUsed: { $avg: '$processing.tokensUsed.total' },
        averageSatisfaction: { $avg: '$feedback.accuracy' },
        totalUsers: { $addToSet: '$user' }
      }
    },
    {
      $project: {
        totalInteractions: 1,
        averageProcessingTime: 1,
        averageConfidence: 1,
        averageTokensUsed: 1,
        averageSatisfaction: 1,
        uniqueUsers: { $size: '$totalUsers' }
      }
    }
  ]);
};

// Static method to get interactions by location
aiInteractionSchema.statics.getInteractionsByLocation = function(coordinates, radiusInKm = 10) {
  return this.find({
    'input.location.coordinates': {
      $geoWithin: {
        $centerSphere: [coordinates, radiusInKm / 6378.1]
      }
    },
    status: 'completed'
  }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('AIInteraction', aiInteractionSchema);
