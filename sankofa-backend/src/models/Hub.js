const { supabase, supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

// Hub model using Supabase
class Hub {
  constructor(data) {
    Object.assign(this, data);
  }

  // Create new hub
  static async create(hubData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('hubs')
        .insert([hubData])
        .select()
        .single();

      if (error) throw error;
      return new Hub(data);
    } catch (error) {
      logger.error('Error creating hub:', error);
      throw error;
    }
  }

  // Find hub by ID
  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('hubs')
        .select('*, manager:users!manager_id(id, name, email, phone)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? new Hub(data) : null;
    } catch (error) {
      logger.error('Error finding hub:', error);
      return null;
    }
  }

  // Find all hubs with filters
  static async find(filter = {}, options = {}) {
    try {
      let query = supabaseAdmin
        .from('hubs')
        .select('*, manager:users!manager_id(id, name, email, phone)', { count: 'exact' });

      // Apply filters
      if (filter.status) query = query.eq('status', filter.status);
      if (filter.manager_id) query = query.eq('manager_id', filter.manager_id);
      if (filter.code) query = query.eq('code', filter.code);

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
        hubs: data.map(item => new Hub(item)),
        total: count
      };
    } catch (error) {
      logger.error('Error finding hubs:', error);
      throw error;
    }
  }

  // Update hub
  static async findByIdAndUpdate(id, updateData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('hubs')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? new Hub(data) : null;
    } catch (error) {
      logger.error('Error updating hub:', error);
      throw error;
    }
  }

  // Delete hub
  static async findByIdAndDelete(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('hubs')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? new Hub(data) : null;
    } catch (error) {
      logger.error('Error deleting hub:', error);
      throw error;
    }
  }

  // Find one hub
  static async findOne(filter) {
    try {
      let query = supabaseAdmin
        .from('hubs')
        .select('*');

      Object.keys(filter).forEach(key => {
        query = query.eq(key, filter[key]);
      });

      const { data, error } = await query.single();

      if (error) throw error;
      return data ? new Hub(data) : null;
    } catch (error) {
      logger.error('Error finding hub:', error);
      return null;
    }
  }

  // Get hub statistics
  static async getStats() {
    try {
      const { data: hubs, error } = await supabaseAdmin
        .from('hubs')
        .select('*');

      if (error) throw error;

      const stats = {
        totalHubs: hubs.length,
        activeHubs: hubs.filter(h => h.status === 'active').length,
        inactiveHubs: hubs.filter(h => h.status === 'inactive').length,
        maintenanceHubs: hubs.filter(h => h.status === 'maintenance').length,
        byRegion: hubs.reduce((acc, hub) => {
          const region = hub.location?.address?.region || 'Unknown';
          acc[region] = (acc[region] || 0) + 1;
          return acc;
        }, {})
      };

      return stats;
    } catch (error) {
      logger.error('Error getting hub stats:', error);
      throw error;
    }
  }

  // Find hubs near location
  static async findNearby(longitude, latitude, radiusKm = 10) {
    try {
      // Note: This would require PostGIS for proper geospatial queries
      // For now, we'll fetch all hubs and filter in memory
      const { data: hubs, error } = await supabaseAdmin
        .from('hubs')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      // Simple distance calculation (Haversine formula)
      const filtered = hubs.filter(hub => {
        const coords = hub.location?.coordinates || [];
        if (coords.length !== 2) return false;
        
        const [hubLng, hubLat] = coords;
        const R = 6371; // Earth's radius in km
        const dLat = (hubLat - latitude) * Math.PI / 180;
        const dLon = (hubLng - longitude) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(latitude * Math.PI / 180) * Math.cos(hubLat * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return distance <= radiusKm;
      });

      return filtered.map(hub => new Hub(hub));
    } catch (error) {
      logger.error('Error finding nearby hubs:', error);
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
const hubSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Hub name is required'],
    trim: true,
    maxlength: [100, 'Hub name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Hub code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  
  // Location Information
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Hub coordinates are required']
    },
    address: {
      street: String,
      city: String,
      region: String,
      district: String,
      postalCode: String
    }
  },
  
  // Contact Information
  contact: {
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      match: [/^\+233\d{9}$/, 'Please enter a valid Ghana phone number']
    },
    email: {
      type: String,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    website: String
  },
  
  // Hub Manager
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Hub manager is required']
  },
  
  // Operating Information
  operatingHours: {
    monday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    tuesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    wednesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    thursday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    friday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    saturday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    sunday: { open: String, close: String, isOpen: { type: Boolean, default: false } }
  },
  
  // Capacity and Resources
  capacity: {
    dailyWeightLimit: {
      type: Number,
      default: 1000 // kg
    },
    storageCapacity: {
      type: Number,
      default: 5000 // kg
    },
    currentStock: {
      type: Number,
      default: 0
    }
  },
  
  // Equipment and Facilities
  equipment: {
    weighingScales: {
      type: Number,
      default: 1
    },
    sortingTables: {
      type: Number,
      default: 2
    },
    storageContainers: {
      type: Number,
      default: 10
    },
    hasCompactor: {
      type: Boolean,
      default: false
    },
    hasShredder: {
      type: Boolean,
      default: false
    }
  },
  
  // Services Offered
  services: {
    plasticCollection: {
      type: Boolean,
      default: true
    },
    weighing: {
      type: Boolean,
      default: true
    },
    sorting: {
      type: Boolean,
      default: true
    },
    payment: {
      type: Boolean,
      default: true
    },
    nhisEnrollment: {
      type: Boolean,
      default: true
    },
    healthEducation: {
      type: Boolean,
      default: false
    }
  },
  
  // Pricing Information
  pricing: {
    pet: { type: Number, default: 2.0 }, // GH₵ per kg
    hdpe: { type: Number, default: 1.8 },
    ldpe: { type: Number, default: 1.5 },
    pp: { type: Number, default: 1.6 },
    ps: { type: Number, default: 1.2 },
    other: { type: Number, default: 1.0 }
  },
  
  // Status and Performance
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'closed'],
    default: 'active'
  },
  
  // Performance Metrics
  performance: {
    totalCollections: {
      type: Number,
      default: 0
    },
    totalWeight: {
      type: Number,
      default: 0
    },
    totalPayments: {
      type: Number,
      default: 0
    },
    averageDailyWeight: {
      type: Number,
      default: 0
    },
    customerSatisfaction: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    lastCollectionDate: Date
  },
  
  // Staff Information
  staff: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['assistant', 'weigher', 'sorter', 'cashier']
    },
    startDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Quality Standards
  qualityStandards: {
    minimumWeight: {
      type: Number,
      default: 0.1 // kg
    },
    maximumContamination: {
      type: Number,
      default: 10 // percentage
    },
    requiredDocumentation: [String]
  },
  
  // Health and Safety
  healthSafety: {
    hasFirstAid: {
      type: Boolean,
      default: true
    },
    hasSafetyEquipment: {
      type: Boolean,
      default: true
    },
    lastSafetyInspection: Date,
    safetyRating: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    }
  },
  
  // Environmental Impact
  environmentalImpact: {
    totalCo2Reduced: {
      type: Number,
      default: 0
    },
    totalWaterSaved: {
      type: Number,
      default: 0
    },
    totalEnergySaved: {
      type: Number,
      default: 0
    }
  },
  
  // Images and Documentation
  images: [{
    url: String,
    caption: String,
    type: {
      type: String,
      enum: ['exterior', 'interior', 'equipment', 'staff', 'other']
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
// Note: code already has index from unique: true constraint
hubSchema.index({ 'location.coordinates': '2dsphere' });
hubSchema.index({ manager: 1 });
hubSchema.index({ status: 1 });
hubSchema.index({ 'location.address.region': 1 });
hubSchema.index({ 'location.address.city': 1 });

// Virtual for full address
hubSchema.virtual('fullAddress').get(function() {
  const addr = this.location.address;
  return `${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '');
});

// Virtual for operating status
hubSchema.virtual('isCurrentlyOpen').get(function() {
  const now = new Date();
  const day = now.toLocaleLowerCase().slice(0, 3);
  const currentTime = now.toTimeString().slice(0, 5);
  
  const todayHours = this.operatingHours[day];
  if (!todayHours || !todayHours.isOpen) return false;
  
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
});

// Virtual for capacity utilization
hubSchema.virtual('capacityUtilization').get(function() {
  return Math.round((this.capacity.currentStock / this.capacity.storageCapacity) * 100);
});

// Pre-save middleware to generate hub code
hubSchema.pre('save', function(next) {
  if (this.isNew && !this.code) {
    // Generate hub code based on region and sequential number
    const regionCode = this.location.address.region?.slice(0, 2).toUpperCase() || 'AC';
    const timestamp = Date.now().toString().slice(-4);
    this.code = `${regionCode}${timestamp}`;
  }
  next();
});

// Pre-save middleware to update performance metrics
hubSchema.pre('save', function(next) {
  if (this.isModified('performance.totalWeight') && this.performance.totalCollections > 0) {
    this.performance.averageDailyWeight = Math.round(this.performance.totalWeight / this.performance.totalCollections * 100) / 100;
  }
  next();
});

// Instance method to check if hub is open
hubSchema.methods.isOpen = function(date = new Date()) {
  const day = date.toLocaleLowerCase().slice(0, 3);
  const currentTime = date.toTimeString().slice(0, 5);
  
  const todayHours = this.operatingHours[day];
  if (!todayHours || !todayHours.isOpen) return false;
  
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
};

// Instance method to get next opening time
hubSchema.methods.getNextOpeningTime = function() {
  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(now.getDate() + i);
    const day = days[checkDate.getDay()];
    const hours = this.operatingHours[day];
    
    if (hours && hours.isOpen) {
      const [openHour, openMinute] = hours.open.split(':').map(Number);
      const openTime = new Date(checkDate);
      openTime.setHours(openHour, openMinute, 0, 0);
      
      if (i === 0 && openTime > now) {
        return openTime;
      } else if (i > 0) {
        return openTime;
      }
    }
  }
  
  return null;
};

// Instance method to calculate environmental impact
hubSchema.methods.calculateEnvironmentalImpact = function() {
  // Calculate based on total weight processed
  const co2PerKg = 2.5;
  const waterPerKg = 50;
  const energyPerKg = 5;
  
  this.environmentalImpact = {
    totalCo2Reduced: Math.round(this.performance.totalWeight * co2PerKg * 100) / 100,
    totalWaterSaved: Math.round(this.performance.totalWeight * waterPerKg * 100) / 100,
    totalEnergySaved: Math.round(this.performance.totalWeight * energyPerKg * 100) / 100
  };
  
  return this.environmentalImpact;
};

// Static method to find nearby hubs
hubSchema.statics.findNearbyHubs = function(coordinates, radiusInKm = 10) {
  return this.find({
    'location.coordinates': {
      $geoWithin: {
        $centerSphere: [coordinates, radiusInKm / 6378.1] // Convert km to radians
      }
    },
    status: 'active'
  });
};

// Static method to get hub statistics
hubSchema.statics.getHubStats = function() {
  const pipeline = [
    {
      $group: {
        _id: null,
        totalHubs: { $sum: 1 },
        activeHubs: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        totalCollections: { $sum: '$performance.totalCollections' },
        totalWeight: { $sum: '$performance.totalWeight' },
        totalPayments: { $sum: '$performance.totalPayments' },
        averageSatisfaction: { $avg: '$performance.customerSatisfaction' }
      }
    }
  ];
  
  return this.aggregate(pipeline);
};

// Static method to get top performing hubs
hubSchema.statics.getTopPerformingHubs = function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ 'performance.totalWeight': -1 })
    .limit(limit)
    .populate('manager', 'name email')
    .select('name code location performance manager');
};
*/

module.exports = Hub;

