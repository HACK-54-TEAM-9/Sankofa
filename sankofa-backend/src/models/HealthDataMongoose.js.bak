const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  // Location Information
  location: {
    type: {
      type: String,
      enum: ['Point', 'Polygon'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Location coordinates are required']
    },
    address: {
      region: String,
      district: String,
      city: String,
      neighborhood: String
    }
  },
  
  // Data Source
  source: {
    type: String,
    enum: ['collection_data', 'health_records', 'environmental_monitoring', 'ai_prediction', 'manual_entry'],
    required: [true, 'Data source is required']
  },
  
  // Health Metrics
  healthMetrics: {
    // Disease Data
    diseases: [{
      name: {
        type: String,
        required: true
      },
      cases: {
        type: Number,
        required: true,
        min: 0
      },
      trend: {
        type: String,
        enum: ['increasing', 'decreasing', 'stable'],
        default: 'stable'
      },
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'low'
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Environmental Health Indicators
    environmentalHealth: {
      airQuality: {
        type: String,
        enum: ['excellent', 'good', 'moderate', 'poor', 'hazardous'],
        default: 'moderate'
      },
      waterQuality: {
        type: String,
        enum: ['excellent', 'good', 'moderate', 'poor', 'hazardous'],
        default: 'moderate'
      },
      plasticPollutionLevel: {
        type: String,
        enum: ['low', 'moderate', 'high', 'critical'],
        default: 'moderate'
      },
      vectorBreedingSites: {
        type: Number,
        default: 0
      }
    },
    
    // Risk Assessment
    riskAssessment: {
      overallRisk: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
      },
      riskScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true
      },
      riskFactors: [String],
      mitigationPriority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
      }
    }
  },
  
  // Collection Impact Analysis
  collectionImpact: {
    totalPlasticCollected: {
      type: Number,
      default: 0
    },
    collectionFrequency: {
      type: Number,
      default: 0
    },
    diseaseReductionRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    communityEngagementRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    lastCollectionDate: Date
  },
  
  // Predictive Analytics
  predictions: {
    diseaseOutbreakRisk: {
      type: Number,
      min: 0,
      max: 100
    },
    seasonalTrends: [{
      season: String,
      riskLevel: String,
      predictedCases: Number
    }],
    interventionEffectiveness: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // AI Analysis
  aiAnalysis: {
    modelVersion: String,
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    lastAnalyzed: Date,
    insights: [String],
    recommendations: [String]
  },
  
  // Data Quality
  dataQuality: {
    completeness: {
      type: Number,
      min: 0,
      max: 100
    },
    accuracy: {
      type: Number,
      min: 0,
      max: 100
    },
    timeliness: {
      type: Number,
      min: 0,
      max: 100
    },
    lastValidated: Date
  },
  
  // Metadata
  metadata: {
    dataProvider: String,
    collectionMethod: String,
    samplingSize: Number,
    confidenceInterval: Number,
    notes: String
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'archived', 'pending_validation', 'flagged'],
    default: 'active'
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
healthDataSchema.index({ 'location.coordinates': '2dsphere' });
healthDataSchema.index({ 'location.address.region': 1 });
healthDataSchema.index({ 'location.address.district': 1 });
healthDataSchema.index({ 'healthMetrics.riskAssessment.overallRisk': 1 });
healthDataSchema.index({ source: 1 });
healthDataSchema.index({ status: 1 });
healthDataSchema.index({ createdAt: -1 });
healthDataSchema.index({ 'healthMetrics.diseases.name': 1 });

// Virtual for risk level color
healthDataSchema.virtual('riskColor').get(function() {
  const risk = this.healthMetrics.riskAssessment.overallRisk;
  const colors = {
    low: 'green',
    medium: 'yellow',
    high: 'orange',
    critical: 'red'
  };
  return colors[risk] || 'gray';
});

// Virtual for data age
healthDataSchema.virtual('dataAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Pre-save middleware to calculate risk score
healthDataSchema.pre('save', function(next) {
  if (this.isModified('healthMetrics')) {
    let riskScore = 0;
    
    // Calculate risk based on disease cases and trends
    this.healthMetrics.diseases.forEach(disease => {
      let diseaseRisk = 0;
      
      // Base risk from cases
      if (disease.cases > 100) diseaseRisk += 30;
      else if (disease.cases > 50) diseaseRisk += 20;
      else if (disease.cases > 20) diseaseRisk += 10;
      
      // Trend multiplier
      if (disease.trend === 'increasing') diseaseRisk *= 1.5;
      else if (disease.trend === 'decreasing') diseaseRisk *= 0.7;
      
      // Severity multiplier
      const severityMultipliers = { low: 1, medium: 1.2, high: 1.5, critical: 2 };
      diseaseRisk *= severityMultipliers[disease.severity] || 1;
      
      riskScore += diseaseRisk;
    });
    
    // Environmental factors
    const envHealth = this.healthMetrics.environmentalHealth;
    if (envHealth.airQuality === 'poor' || envHealth.airQuality === 'hazardous') riskScore += 20;
    if (envHealth.waterQuality === 'poor' || envHealth.waterQuality === 'hazardous') riskScore += 20;
    if (envHealth.plasticPollutionLevel === 'high' || envHealth.plasticPollutionLevel === 'critical') riskScore += 15;
    if (envHealth.vectorBreedingSites > 5) riskScore += 10;
    
    // Collection impact (negative correlation)
    const collectionImpact = this.collectionImpact;
    if (collectionImpact.diseaseReductionRate > 50) riskScore -= 20;
    if (collectionImpact.communityEngagementRate > 70) riskScore -= 15;
    
    // Normalize to 0-100
    riskScore = Math.max(0, Math.min(100, riskScore));
    this.healthMetrics.riskAssessment.riskScore = Math.round(riskScore);
    
    // Set overall risk level
    if (riskScore >= 80) this.healthMetrics.riskAssessment.overallRisk = 'critical';
    else if (riskScore >= 60) this.healthMetrics.riskAssessment.overallRisk = 'high';
    else if (riskScore >= 40) this.healthMetrics.riskAssessment.overallRisk = 'medium';
    else this.healthMetrics.riskAssessment.overallRisk = 'low';
  }
  next();
});

// Instance method to update disease data
healthDataSchema.methods.updateDiseaseData = function(diseaseName, cases, trend, severity) {
  const existingDisease = this.healthMetrics.diseases.find(d => d.name === diseaseName);
  
  if (existingDisease) {
    existingDisease.cases = cases;
    existingDisease.trend = trend;
    existingDisease.severity = severity;
    existingDisease.lastUpdated = new Date();
  } else {
    this.healthMetrics.diseases.push({
      name: diseaseName,
      cases,
      trend,
      severity,
      lastUpdated: new Date()
    });
  }
  
  return this.save();
};

// Instance method to generate insights
healthDataSchema.methods.generateInsights = function() {
  const insights = [];
  const risk = this.healthMetrics.riskAssessment;
  const diseases = this.healthMetrics.diseases;
  const env = this.healthMetrics.environmentalHealth;
  
  // Risk-based insights
  if (risk.overallRisk === 'critical' || risk.overallRisk === 'high') {
    insights.push(`High health risk detected in ${this.location.address.region || 'this area'}. Immediate intervention recommended.`);
  }
  
  // Disease insights
  const increasingDiseases = diseases.filter(d => d.trend === 'increasing');
  if (increasingDiseases.length > 0) {
    insights.push(`Increasing trend detected for: ${increasingDiseases.map(d => d.name).join(', ')}`);
  }
  
  // Environmental insights
  if (env.plasticPollutionLevel === 'high' || env.plasticPollutionLevel === 'critical') {
    insights.push('High plastic pollution levels detected. Increased collection efforts recommended.');
  }
  
  // Collection impact insights
  if (this.collectionImpact.diseaseReductionRate > 30) {
    insights.push(`Plastic collection efforts are showing positive health impact (${this.collectionImpact.diseaseReductionRate}% reduction).`);
  }
  
  this.aiAnalysis.insights = insights;
  return insights;
};

// Static method to get health data by region
healthDataSchema.statics.getHealthDataByRegion = function(region) {
  return this.find({
    'location.address.region': region,
    status: 'active'
  }).sort({ createdAt: -1 });
};

// Static method to get high-risk areas
healthDataSchema.statics.getHighRiskAreas = function(limit = 10) {
  return this.find({
    'healthMetrics.riskAssessment.overallRisk': { $in: ['high', 'critical'] },
    status: 'active'
  })
  .sort({ 'healthMetrics.riskAssessment.riskScore': -1 })
  .limit(limit);
};

// Static method to get health trends
healthDataSchema.statics.getHealthTrends = function(region, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        'location.address.region': region,
        createdAt: { $gte: startDate },
        status: 'active'
      }
    },
    {
      $unwind: '$healthMetrics.diseases'
    },
    {
      $group: {
        _id: {
          disease: '$healthMetrics.diseases.name',
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
        },
        cases: { $sum: '$healthMetrics.diseases.cases' },
        trend: { $first: '$healthMetrics.diseases.trend' }
      }
    },
    {
      $sort: { '_id.date': 1, '_id.disease': 1 }
    }
  ]);
};

// Static method to get collection impact analysis
healthDataSchema.statics.getCollectionImpactAnalysis = function(region) {
  return this.aggregate([
    {
      $match: {
        'location.address.region': region,
        status: 'active'
      }
    },
    {
      $group: {
        _id: null,
        averageDiseaseReduction: { $avg: '$collectionImpact.diseaseReductionRate' },
        averageEngagement: { $avg: '$collectionImpact.communityEngagementRate' },
        totalPlasticCollected: { $sum: '$collectionImpact.totalPlasticCollected' },
        averageRiskScore: { $avg: '$healthMetrics.riskAssessment.riskScore' }
      }
    }
  ]);
};

module.exports = mongoose.model('HealthData', healthDataSchema);
