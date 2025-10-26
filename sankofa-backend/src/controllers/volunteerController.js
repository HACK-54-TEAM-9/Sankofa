const Volunteer = require('../models/Volunteer');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// @desc    Get volunteers
// @route   GET /api/volunteers
// @access  Private (Admin, Hub Manager)
const getVolunteers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  
  const volunteers = await Volunteer.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Volunteer.countDocuments(filter);

  res.json({
    success: true,
    data: {
      volunteers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get volunteer by ID
// @route   GET /api/volunteers/:id
// @access  Private
const getVolunteerById = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);

  if (!volunteer) {
    throw new AppError('Volunteer not found', 404);
  }

  res.json({
    success: true,
    data: { volunteer }
  });
});

// @desc    Create volunteer application
// @route   POST /api/volunteers/apply
// @access  Private
const createVolunteerApplication = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.create(req.body);
  
  logger.info('Volunteer application created', { volunteerId: volunteer._id });

  res.status(201).json({
    success: true,
    message: 'Volunteer application submitted successfully',
    data: { volunteer }
  });
});

// @desc    Update volunteer application
// @route   PUT /api/volunteers/:id
// @access  Private
const updateVolunteerApplication = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!volunteer) {
    throw new AppError('Volunteer not found', 404);
  }

  res.json({
    success: true,
    message: 'Volunteer application updated successfully',
    data: { volunteer }
  });
});

// @desc    Delete volunteer application
// @route   DELETE /api/volunteers/:id
// @access  Private (Admin)
const deleteVolunteerApplication = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findByIdAndDelete(req.params.id);

  if (!volunteer) {
    throw new AppError('Volunteer not found', 404);
  }

  res.json({
    success: true,
    message: 'Volunteer application deleted successfully'
  });
});

// @desc    Approve volunteer
// @route   PATCH /api/volunteers/:id/approve
// @access  Private (Admin, Hub Manager)
const approveVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'approved',
      approvedBy: req.user.id,
      approvedAt: new Date()
    },
    { new: true }
  );

  if (!volunteer) {
    throw new AppError('Volunteer not found', 404);
  }

  res.json({
    success: true,
    message: 'Volunteer approved successfully',
    data: { volunteer }
  });
});

// @desc    Reject volunteer
// @route   PATCH /api/volunteers/:id/reject
// @access  Private (Admin, Hub Manager)
const rejectVolunteer = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  
  const volunteer = await Volunteer.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'rejected',
      rejectionReason: reason,
      rejectedBy: req.user.id,
      rejectedAt: new Date()
    },
    { new: true }
  );

  if (!volunteer) {
    throw new AppError('Volunteer not found', 404);
  }

  res.json({
    success: true,
    message: 'Volunteer rejected successfully',
    data: { volunteer }
  });
});

// @desc    Get volunteer opportunities
// @route   GET /api/volunteers/opportunities
// @access  Private
const getVolunteerOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await Volunteer.getVolunteerOpportunities();
  
  res.json({
    success: true,
    data: { opportunities }
  });
});

// @desc    Get volunteer statistics
// @route   GET /api/volunteers/stats
// @access  Private (Admin)
const getVolunteerStats = asyncHandler(async (req, res) => {
  const stats = await Volunteer.getVolunteerStats();
  
  res.json({
    success: true,
    data: { stats }
  });
});

// @desc    Get volunteer applications
// @route   GET /api/volunteers/applications
// @access  Private (Admin, Hub Manager)
const getVolunteerApplications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  
  const applications = await Volunteer.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Volunteer.countDocuments(filter);

  res.json({
    success: true,
    data: {
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Update volunteer status
// @route   PATCH /api/volunteers/:id/status
// @access  Private (Admin, Hub Manager)
const updateVolunteerStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const volunteer = await Volunteer.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!volunteer) {
    throw new AppError('Volunteer not found', 404);
  }

  res.json({
    success: true,
    message: 'Volunteer status updated successfully',
    data: { volunteer }
  });
});

// @desc    Assign volunteer to opportunity
// @route   PATCH /api/volunteers/:id/assign
// @access  Private (Admin, Hub Manager)
const assignVolunteerToOpportunity = asyncHandler(async (req, res) => {
  const { opportunityId } = req.body;
  
  const volunteer = await Volunteer.findByIdAndUpdate(
    req.params.id,
    { 
      assignedOpportunity: opportunityId,
      status: 'active'
    },
    { new: true }
  );

  if (!volunteer) {
    throw new AppError('Volunteer not found', 404);
  }

  res.json({
    success: true,
    message: 'Volunteer assigned to opportunity successfully',
    data: { volunteer }
  });
});

module.exports = {
  getVolunteers,
  getVolunteerById,
  createVolunteerApplication,
  updateVolunteerApplication,
  deleteVolunteerApplication,
  approveVolunteer,
  rejectVolunteer,
  getVolunteerOpportunities,
  getVolunteerStats,
  getVolunteerApplications,
  updateVolunteerStatus,
  assignVolunteerToOpportunity
};
