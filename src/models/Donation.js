const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  // Donor Information
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Donor is required']
  },
  
  // Donation Details
  amount: {
    type: Number,
    required: [true, 'Donation amount is required'],
    min: [1, 'Donation amount must be at least 1 GH₵']
  },
  currency: {
    type: String,
    default: 'GHS',
    enum: ['GHS', 'USD', 'EUR', 'GBP']
  },
  
  // Donation Type
  type: {
    type: String,
    enum: ['one-time', 'monthly', 'quarterly', 'yearly'],
    required: [true, 'Donation type is required']
  },
  
  // Payment Information
  payment: {
    method: {
      type: String,
      enum: ['mobile_money', 'bank_transfer', 'credit_card', 'paypal', 'crypto'],
      required: [true, 'Payment method is required']
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paymentReference: String,
    gatewayResponse: mongoose.Schema.Types.Mixed,
    processedAt: Date,
    failedAt: Date,
    failureReason: String
  },
  
  // Donation Tier and Impact
  tier: {
    name: {
      type: String,
      enum: ['Community Supporter', 'Health Champion', 'Impact Partner', 'Change Maker', 'Custom'],
      default: 'Custom'
    },
    amount: Number,
    impact: [String]
  },
  
  // Allocation Preferences
  allocation: {
    plasticCollection: {
      type: Number,
      min: 0,
      max: 100,
      default: 40
    },
    healthcareAccess: {
      type: Number,
      min: 0,
      max: 100,
      default: 35
    },
    healthIntelligence: {
      type: Number,
      min: 0,
      max: 100,
      default: 15
    },
    operations: {
      type: Number,
      min: 0,
      max: 100,
      default: 10
    }
  },
  
  // Impact Tracking
  impact: {
    collectorsSupported: {
      type: Number,
      default: 0
    },
    plasticCollected: {
      type: Number,
      default: 0
    },
    nhisEnrollments: {
      type: Number,
      default: 0
    },
    healthScreens: {
      type: Number,
      default: 0
    },
    communitiesReached: {
      type: Number,
      default: 0
    }
  },
  
  // Recurring Donation Settings
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly']
    },
    nextPaymentDate: Date,
    endDate: Date,
    totalPayments: {
      type: Number,
      default: 0
    },
    cancelledAt: Date,
    cancellationReason: String
  },
  
  // Donor Preferences
  preferences: {
    anonymous: {
      type: Boolean,
      default: false
    },
    receiveUpdates: {
      type: Boolean,
      default: true
    },
    impactReports: {
      type: Boolean,
      default: true
    },
    taxReceipt: {
      type: Boolean,
      default: true
    }
  },
  
  // Communication
  communication: {
    thankYouSent: {
      type: Boolean,
      default: false
    },
    impactReportSent: {
      type: Boolean,
      default: false
    },
    lastUpdateSent: Date,
    notes: String
  },
  
  // Tax and Receipt Information
  tax: {
    receiptNumber: String,
    receiptSent: {
      type: Boolean,
      default: false
    },
    receiptSentAt: Date,
    taxDeductible: {
      type: Boolean,
      default: true
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled', 'failed'],
    default: 'pending'
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
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ 'payment.status': 1 });
donationSchema.index({ type: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ 'recurring.isRecurring': 1 });
donationSchema.index({ 'recurring.nextPaymentDate': 1 });
donationSchema.index({ createdAt: -1 });

// Virtual for total impact value
donationSchema.virtual('totalImpactValue').get(function() {
  return this.impact.collectorsSupported + 
         this.impact.plasticCollected + 
         this.impact.nhisEnrollments + 
         this.impact.healthScreens + 
         this.impact.communitiesReached;
});

// Virtual for donation age
donationSchema.virtual('donationAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Pre-save middleware to set tier based on amount
donationSchema.pre('save', function(next) {
  if (this.isModified('amount')) {
    if (this.amount >= 500) {
      this.tier.name = 'Change Maker';
      this.tier.amount = 500;
      this.tier.impact = [
        'Supports 3 community cleanup events',
        'Funds comprehensive health screening for 100 people',
        'Provides equipment for 2 collection hubs'
      ];
    } else if (this.amount >= 250) {
      this.tier.name = 'Impact Partner';
      this.tier.amount = 250;
      this.tier.impact = [
        'Establishes a new collection hub',
        'Funds a month of AI health data analysis',
        'Provides NHIS coverage for 15 people'
      ];
    } else if (this.amount >= 100) {
      this.tier.name = 'Health Champion';
      this.tier.amount = 100;
      this.tier.impact = [
        'Equips a collection hub with weighing scales',
        'Funds malaria prevention supplies for 50 families',
        'Provides health insurance for 5 collectors'
      ];
    } else if (this.amount >= 50) {
      this.tier.name = 'Community Supporter';
      this.tier.amount = 50;
      this.tier.impact = [
        'Provides plastic collection bags for 10 collectors',
        'Funds 1 community health education session',
        'Supports NHIS enrollment for 2 individuals'
      ];
    } else {
      this.tier.name = 'Custom';
      this.tier.amount = this.amount;
      this.tier.impact = ['Custom donation impact'];
    }
  }
  next();
});

// Pre-save middleware to calculate impact
donationSchema.pre('save', function(next) {
  if (this.isModified('amount') && this.payment.status === 'completed') {
    // Calculate impact based on donation amount and allocation
    const allocation = this.allocation;
    const amount = this.amount;
    
    // Plastic collection impact
    if (allocation.plasticCollection > 0) {
      this.impact.collectorsSupported = Math.floor((amount * allocation.plasticCollection / 100) / 50); // 50 GH₵ per collector
      this.impact.plasticCollected = Math.floor((amount * allocation.plasticCollection / 100) / 2); // 2 GH₵ per kg
    }
    
    // Healthcare access impact
    if (allocation.healthcareAccess > 0) {
      this.impact.nhisEnrollments = Math.floor((amount * allocation.healthcareAccess / 100) / 30); // 30 GH₵ per enrollment
      this.impact.healthScreens = Math.floor((amount * allocation.healthcareAccess / 100) / 15); // 15 GH₵ per screen
    }
    
    // Community reach
    this.impact.communitiesReached = Math.floor(amount / 100); // 1 community per 100 GH₵
  }
  next();
});

// Instance method to process payment
donationSchema.methods.processPayment = async function(paymentData) {
  this.payment.status = 'processing';
  this.payment.transactionId = paymentData.transactionId;
  this.payment.paymentReference = paymentData.reference;
  this.payment.gatewayResponse = paymentData.response;
  
  await this.save();
  
  // Simulate payment processing
  setTimeout(async () => {
    this.payment.status = 'completed';
    this.payment.processedAt = new Date();
    this.status = 'active';
    
    // Set up recurring payment if applicable
    if (this.recurring.isRecurring) {
      this.recurring.nextPaymentDate = this.calculateNextPaymentDate();
    }
    
    await this.save();
  }, 2000);
  
  return this;
};

// Instance method to calculate next payment date
donationSchema.methods.calculateNextPaymentDate = function() {
  const nextDate = new Date();
  
  switch (this.recurring.frequency) {
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }
  
  return nextDate;
};

// Instance method to cancel recurring donation
donationSchema.methods.cancelRecurring = function(reason) {
  this.recurring.isRecurring = false;
  this.recurring.cancelledAt = new Date();
  this.recurring.cancellationReason = reason;
  this.status = 'cancelled';
  
  return this.save();
};

// Instance method to generate impact report
donationSchema.methods.generateImpactReport = function() {
  const report = {
    donationId: this._id,
    amount: this.amount,
    tier: this.tier.name,
    impact: this.impact,
    allocation: this.allocation,
    createdAt: this.createdAt,
    reportGeneratedAt: new Date()
  };
  
  return report;
};

// Static method to get donation statistics
donationSchema.statics.getDonationStats = function(filters = {}) {
  const pipeline = [
    { $match: { ...filters, 'payment.status': 'completed' } },
    {
      $group: {
        _id: null,
        totalDonations: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        averageAmount: { $avg: '$amount' },
        totalRecurring: {
          $sum: { $cond: ['$recurring.isRecurring', 1, 0] }
        },
        totalImpact: {
          $sum: {
            $add: [
              '$impact.collectorsSupported',
              '$impact.plasticCollected',
              '$impact.nhisEnrollments',
              '$impact.healthScreens',
              '$impact.communitiesReached'
            ]
          }
        }
      }
    }
  ];
  
  return this.aggregate(pipeline);
};

// Static method to get top donors
donationSchema.statics.getTopDonors = function(limit = 10) {
  return this.aggregate([
    { $match: { 'payment.status': 'completed' } },
    {
      $group: {
        _id: '$donor',
        totalDonated: { $sum: '$amount' },
        donationCount: { $sum: 1 },
        lastDonation: { $max: '$createdAt' }
      }
    },
    { $sort: { totalDonated: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'donor'
      }
    },
    { $unwind: '$donor' },
    {
      $project: {
        donor: {
          name: 1,
          email: 1,
          'donorProfile.organization': 1
        },
        totalDonated: 1,
        donationCount: 1,
        lastDonation: 1
      }
    }
  ]);
};

// Static method to get recurring donations due
donationSchema.statics.getRecurringDonationsDue = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.find({
    'recurring.isRecurring': true,
    'recurring.nextPaymentDate': { $lte: today },
    status: 'active'
  }).populate('donor', 'name email phone');
};

module.exports = mongoose.model('Donation', donationSchema);
