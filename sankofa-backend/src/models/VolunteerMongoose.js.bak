const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    match: [/^\+233\d{9}$/, 'Please add a valid Ghana phone number']
  },
  opportunityId: {
    type: mongoose.Schema.ObjectId,
    ref: 'VolunteerOpportunity',
    required: [true, 'Please select a volunteer opportunity']
  },
  skills: [String],
  availability: {
    days: [String],
    hours: {
      start: String,
      end: String
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'inactive'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectionReason: String,
  rejectedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  rejectedAt: Date,
  assignedOpportunity: {
    type: mongoose.Schema.ObjectId,
    ref: 'VolunteerOpportunity'
  },
  hoursVolunteered: {
    type: Number,
    default: 0
  },
  impact: {
    collectionsAssisted: {
      type: Number,
      default: 0
    },
    communitiesReached: {
      type: Number,
      default: 0
    },
    healthEducationSessions: {
      type: Number,
      default: 0
    }
  },
  feedback: [{
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Static method to get volunteer opportunities
VolunteerSchema.statics.getVolunteerOpportunities = function() {
  return [
    {
      id: 'opp_1',
      title: 'Community Outreach',
      description: 'Help educate communities about plastic pollution and health risks',
      location: 'Accra',
      duration: '3 months',
      requirements: ['Communication skills', 'Community engagement'],
      benefits: ['Training', 'Certificate', 'Networking']
    },
    {
      id: 'opp_2',
      title: 'Collection Support',
      description: 'Assist with plastic collection activities and hub operations',
      location: 'Kumasi',
      duration: '6 months',
      requirements: ['Physical fitness', 'Teamwork'],
      benefits: ['Training', 'Certificate', 'Transport allowance']
    }
  ];
};

// Static method to get volunteer statistics
VolunteerSchema.statics.getVolunteerStats = function() {
  return {
    totalVolunteers: 75,
    activeVolunteers: 60,
    pendingApplications: 15,
    totalHoursVolunteered: 2500,
    averageRating: 4.2
  };
};

module.exports = mongoose.model('Volunteer', VolunteerSchema);
