const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  // Collection Details
  collector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Collector is required']
  },
  hub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hub',
    required: [true, 'Hub is required']
  },
  
  // Plastic Details
  plasticType: {
    type: String,
    enum: ['PET', 'HDPE', 'LDPE', 'PP', 'PS', 'Other'],
    required: [true, 'Plastic type is required']
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [0.1, 'Weight must be at least 0.1 kg']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  
  // Quality Assessment
  quality: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: 'good'
  },
  contamination: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  notes: String,
  
  // Location Information
  collectionLocation: {
    type: {
      type: String,
      enum: ['Point', 'Polygon'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Collection coordinates are required']
    },
    address: String,
    region: String,
    district: String
  },
  
  // Financial Details
  basePrice: {
    type: Number,
    required: [true, 'Base price is required']
  },
  qualityMultiplier: {
    type: Number,
    default: 1.0,
    min: 0.5,
    max: 1.5
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required']
  },
  cashAmount: {
    type: Number,
    required: [true, 'Cash amount is required']
  },
  healthTokenAmount: {
    type: Number,
    required: [true, 'Health token amount is required']
  },
  
  // Status and Processing
  status: {
    type: String,
    enum: ['pending', 'verified', 'processed', 'paid', 'rejected'],
    default: 'pending'
  },
  verificationDate: Date,
  processedDate: Date,
  paidDate: Date,
  
  // Verification Details
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationNotes: String,
  rejectionReason: String,
  
  // Payment Details
  paymentMethod: {
    type: String,
    enum: ['mobile_money', 'bank_transfer', 'cash', 'health_tokens'],
    default: 'mobile_money'
  },
  paymentReference: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  
  // Health Impact Tracking
  healthImpact: {
    diseasesPrevented: [String],
    riskReduction: {
      type: Number,
      min: 0,
      max: 100
    },
    communityBenefit: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // Environmental Impact
  environmentalImpact: {
    co2Reduced: Number, // in kg
    waterSaved: Number, // in liters
    energySaved: Number, // in kWh
  },
  
  // Images and Documentation
  images: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
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
collectionSchema.index({ collector: 1, createdAt: -1 });
collectionSchema.index({ hub: 1, createdAt: -1 });
collectionSchema.index({ status: 1 });
collectionSchema.index({ plasticType: 1 });
collectionSchema.index({ 'collectionLocation.coordinates': '2dsphere' });
collectionSchema.index({ createdAt: -1 });
collectionSchema.index({ paymentStatus: 1 });

// Virtual for collection date
collectionSchema.virtual('collectionDate').get(function() {
  return this.createdAt;
});

// Virtual for processing time
collectionSchema.virtual('processingTime').get(function() {
  if (this.processedDate && this.createdAt) {
    return Math.round((this.processedDate - this.createdAt) / (1000 * 60 * 60)); // hours
  }
  return null;
});

// Virtual for total value
collectionSchema.virtual('totalValue').get(function() {
  return this.cashAmount + this.healthTokenAmount;
});

// Pre-save middleware to calculate amounts
collectionSchema.pre('save', function(next) {
  if (this.isModified('weight') || this.isModified('basePrice') || this.isModified('qualityMultiplier')) {
    this.totalAmount = this.weight * this.basePrice * this.qualityMultiplier;
    this.cashAmount = Math.round(this.totalAmount * 0.7 * 100) / 100; // 70% cash
    this.healthTokenAmount = Math.round(this.totalAmount * 0.3 * 100) / 100; // 30% health tokens
  }
  next();
});

// Pre-save middleware to update status timestamps
collectionSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const now = new Date();
    
    switch (this.status) {
      case 'verified':
        this.verificationDate = now;
        break;
      case 'processed':
        this.processedDate = now;
        break;
      case 'paid':
        this.paidDate = now;
        break;
    }
  }
  next();
});

// Instance method to calculate environmental impact
collectionSchema.methods.calculateEnvironmentalImpact = function() {
  // Rough estimates based on plastic recycling data
  const co2PerKg = 2.5; // kg CO2 saved per kg of plastic recycled
  const waterPerKg = 50; // liters of water saved per kg of plastic recycled
  const energyPerKg = 5; // kWh saved per kg of plastic recycled
  
  this.environmentalImpact = {
    co2Reduced: Math.round(this.weight * co2PerKg * 100) / 100,
    waterSaved: Math.round(this.weight * waterPerKg * 100) / 100,
    energySaved: Math.round(this.weight * energyPerKg * 100) / 100
  };
  
  return this.environmentalImpact;
};

// Instance method to assess health impact
collectionSchema.methods.assessHealthImpact = function() {
  // Simple health impact assessment based on location and plastic type
  const healthImpact = {
    diseasesPrevented: [],
    riskReduction: 0,
    communityBenefit: 0
  };
  
  // Add diseases based on plastic type and location
  if (this.plasticType === 'PET' || this.plasticType === 'HDPE') {
    healthImpact.diseasesPrevented.push('Malaria', 'Dengue');
    healthImpact.riskReduction += 15;
  }
  
  if (this.quality === 'excellent' || this.quality === 'good') {
    healthImpact.communityBenefit += 20;
  }
  
  this.healthImpact = healthImpact;
  return healthImpact;
};

// Static method to get collections by date range
collectionSchema.statics.getCollectionsByDateRange = function(startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).populate('collector', 'name email').populate('hub', 'name location');
};

// Static method to get collections by location
collectionSchema.statics.getCollectionsByLocation = function(coordinates, radiusInKm = 10) {
  return this.find({
    'collectionLocation.coordinates': {
      $geoWithin: {
        $centerSphere: [coordinates, radiusInKm / 6378.1] // Convert km to radians
      }
    }
  });
};

// Static method to get collection statistics
collectionSchema.statics.getCollectionStats = function(filters = {}) {
  const pipeline = [
    { $match: filters },
    {
      $group: {
        _id: null,
        totalCollections: { $sum: 1 },
        totalWeight: { $sum: '$weight' },
        totalAmount: { $sum: '$totalAmount' },
        totalCashPaid: { $sum: '$cashAmount' },
        totalHealthTokens: { $sum: '$healthTokenAmount' },
        averageWeight: { $avg: '$weight' },
        averageAmount: { $avg: '$totalAmount' }
      }
    }
  ];
  
  return this.aggregate(pipeline);
};

// Static method to get top collectors
collectionSchema.statics.getTopCollectors = function(limit = 10, dateRange = null) {
  const matchStage = {};
  if (dateRange) {
    matchStage.createdAt = {
      $gte: dateRange.start,
      $lte: dateRange.end
    };
  }
  
  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: '$collector',
        totalCollections: { $sum: 1 },
        totalWeight: { $sum: '$weight' },
        totalEarnings: { $sum: '$cashAmount' },
        totalHealthTokens: { $sum: '$healthTokenAmount' }
      }
    },
    { $sort: { totalWeight: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'collector'
      }
    },
    { $unwind: '$collector' },
    {
      $project: {
        collector: {
          name: 1,
          email: 1,
          'collectorProfile.rank': 1,
          avatar: 1
        },
        totalCollections: 1,
        totalWeight: 1,
        totalEarnings: 1,
        totalHealthTokens: 1
      }
    }
  ];
  
  return this.aggregate(pipeline);
};

module.exports = mongoose.model('Collection', collectionSchema);
