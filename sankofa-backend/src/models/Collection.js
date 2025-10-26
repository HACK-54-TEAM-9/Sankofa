const { supabase, supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

// Collection model using Supabase
class Collection {
  constructor(data) {
    Object.assign(this, data);
  }

  // Create new collection
  static async create(collectionData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('collections')
        .insert([collectionData])
        .select()
        .single();

      if (error) throw error;
      return new Collection(data);
    } catch (error) {
      logger.error('Error creating collection:', error);
      throw error;
    }
  }

  // Find collection by ID
  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('collections')
        .select('*, collector:users!collector_id(id, name, email), hub:hubs(id, name, location)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? new Collection(data) : null;
    } catch (error) {
      logger.error('Error finding collection:', error);
      return null;
    }
  }

  // Find all collections with filters
  static async find(filter = {}, options = {}) {
    try {
      let query = supabaseAdmin
        .from('collections')
        .select('*, collector:users!collector_id(id, name, email), hub:hubs(id, name, location)', { count: 'exact' });

      // Apply filters
      if (filter.collector_id) query = query.eq('collector_id', filter.collector_id);
      if (filter.hub_id) query = query.eq('hub_id', filter.hub_id);
      if (filter.status) query = query.eq('status', filter.status);
      if (filter.plastic_type) query = query.eq('plastic_type', filter.plastic_type);

      // Apply sorting
      const sortField = options.sort || 'created_at';
      const sortOrder = options.order || 'desc';
      query = query.order(sortField, { ascending: sortOrder === 'asc' });

      // Apply pagination
      if (options.limit) query = query.limit(options.limit);
      if (options.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1);

      const { data, error, count } = await query;

      if (error) throw error;
      return { 
        collections: data.map(item => new Collection(item)),
        total: count
      };
    } catch (error) {
      logger.error('Error finding collections:', error);
      throw error;
    }
  }

  // Update collection
  static async findByIdAndUpdate(id, updateData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('collections')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? new Collection(data) : null;
    } catch (error) {
      logger.error('Error updating collection:', error);
      throw error;
    }
  }

  // Delete collection
  static async findByIdAndDelete(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('collections')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? new Collection(data) : null;
    } catch (error) {
      logger.error('Error deleting collection:', error);
      throw error;
    }
  }

  // Verify collection
  static async verifyCollection(id, verifiedBy, notes) {
    try {
      const { data, error} = await supabaseAdmin
        .from('collections')
        .update({
          status: 'verified',
          verified_by: verifiedBy,
          verification_notes: notes,
          verification_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? new Collection(data) : null;
    } catch (error) {
      logger.error('Error verifying collection:', error);
      throw error;
    }
  }

  // Get collection statistics
  static async getStats(filter = {}) {
    try {
      let query = supabaseAdmin
        .from('collections')
        .select('*');

      if (filter.collector_id) query = query.eq('collector_id', filter.collector_id);
      if (filter.hub_id) query = query.eq('hub_id', filter.hub_id);
      if (filter.status) query = query.eq('status', filter.status);

      const { data, error } = await query;

      if (error) throw error;

      const stats = {
        totalCollections: data.length,
        totalWeight: data.reduce((sum, col) => sum + parseFloat(col.weight || 0), 0),
        totalAmount: data.reduce((sum, col) => sum + parseFloat(col.total_amount || 0), 0),
        cashAmount: data.reduce((sum, col) => sum + parseFloat(col.cash_amount || 0), 0),
        healthTokenAmount: data.reduce((sum, col) => sum + parseFloat(col.health_token_amount || 0), 0),
        byStatus: data.reduce((acc, col) => {
          acc[col.status] = (acc[col.status] || 0) + 1;
          return acc;
        }, {}),
        byPlasticType: data.reduce((acc, col) => {
          acc[col.plastic_type] = (acc[col.plastic_type] || 0) + 1;
          return acc;
        }, {})
      };

      return stats;
    } catch (error) {
      logger.error('Error getting collection stats:', error);
      throw error;
    }
  }

  // Get top collectors
  static async getTopCollectors(limit = 10) {
    try {
      const { data, error } = await supabaseAdmin
        .from('collections')
        .select('collector_id, users!collector_id(id, name, email), weight, total_amount')
        .eq('status', 'verified');

      if (error) throw error;

      // Aggregate by collector
      const collectorMap = {};
      data.forEach(col => {
        const collectorId = col.collector_id;
        if (!collectorMap[collectorId]) {
          collectorMap[collectorId] = {
            collector: col.users,
            totalWeight: 0,
            totalAmount: 0,
            count: 0
          };
        }
        collectorMap[collectorId].totalWeight += parseFloat(col.weight || 0);
        collectorMap[collectorId].totalAmount += parseFloat(col.total_amount || 0);
        collectorMap[collectorId].count += 1;
      });

      return Object.values(collectorMap)
        .sort((a, b) => b.totalWeight - a.totalWeight)
        .slice(0, limit);
    } catch (error) {
      logger.error('Error getting top collectors:', error);
      throw error;
    }
  }

  // Instance method to convert to JSON
  toJSON() {
    return { ...this };
  }
}

// Old Mongoose schema kept for reference (commented out)
/*
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
*/

module.exports = Collection;

