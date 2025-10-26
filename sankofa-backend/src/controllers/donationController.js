const Donation = require('../models/Donation');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// @desc    Create donation
// @route   POST /api/donations
// @access  Private
const createDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.create(req.body);
  
  logger.info('Donation created', { donationId: donation.id, amount: donation.amount });

  res.status(201).json({
    success: true,
    message: 'Donation created successfully',
    data: { donation }
  });
});

// @desc    Get donations
// @route   GET /api/donations
// @access  Private (Admin)
const getDonations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const options = {
    limit: parseInt(limit),
    offset: (page - 1) * parseInt(limit),
    sort: 'created_at',
    order: 'desc'
  };

  const { donations, total } = await Donation.find({}, options);

  res.json({
    success: true,
    data: {
      donations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get donation by ID
// @route   GET /api/donations/:id
// @access  Private
const getDonationById = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);

  if (!donation) {
    throw new AppError('Donation not found', 404);
  }

  res.json({
    success: true,
    data: { donation }
  });
});

// @desc    Update donation
// @route   PUT /api/donations/:id
// @access  Private
const updateDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findByIdAndUpdate(
    req.params.id,
    req.body
  );

  if (!donation) {
    throw new AppError('Donation not found', 404);
  }

  res.json({
    success: true,
    message: 'Donation updated successfully',
    data: { donation }
  });
});

// @desc    Delete donation
// @route   DELETE /api/donations/:id
// @access  Private (Admin)
const deleteDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findByIdAndDelete(req.params.id);

  if (!donation) {
    throw new AppError('Donation not found', 404);
  }

  res.json({
    success: true,
    message: 'Donation deleted successfully'
  });
});

// @desc    Process donation payment
// @route   POST /api/donations/:id/process
// @access  Private
const processDonation = asyncHandler(async (req, res) => {
  const { paymentData } = req.body;
  
  const donation = await Donation.findByIdAndUpdate(
    req.params.id,
    { 
      payment: {
        ...paymentData,
        status: 'completed',
        processedAt: new Date().toISOString()
      }
    }
  );

  if (!donation) {
    throw new AppError('Donation not found', 404);
  }

  res.json({
    success: true,
    message: 'Donation processed successfully',
    data: { donation }
  });
});

// @desc    Get donation statistics
// @route   GET /api/donations/stats
// @access  Private
const getDonationStats = asyncHandler(async (req, res) => {
  const stats = await Donation.getStats();
  
  res.json({
    success: true,
    data: { stats }
  });
});

// @desc    Get top donors
// @route   GET /api/donations/top-donors
// @access  Private
const getTopDonors = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  // Placeholder - would need aggregation
  const topDonors = [];
  
  res.json({
    success: true,
    data: { topDonors }
  });
});

// @desc    Get recurring donations
// @route   GET /api/donations/recurring
// @access  Private (Admin)
const getRecurringDonations = asyncHandler(async (req, res) => {
  const { donations } = await Donation.find({}, { limit: 100 });
  const recurringDonations = donations.filter(d => d.type !== 'one-time');
  
  res.json({
    success: true,
    data: { recurringDonations }
  });
});

// @desc    Cancel recurring donation
// @route   PATCH /api/donations/:id/cancel-recurring
// @access  Private
const cancelRecurringDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findByIdAndUpdate(
    req.params.id,
    { status: 'cancelled' }
  );

  if (!donation) {
    throw new AppError('Donation not found', 404);
  }

  res.json({
    success: true,
    message: 'Recurring donation cancelled successfully',
    data: { donation }
  });
});

// @desc    Get donor history
// @route   GET /api/donations/history
// @access  Private
const getDonorHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const filter = { donor_id: req.user.id };
  const options = {
    limit: parseInt(limit),
    offset: (page - 1) * parseInt(limit),
    sort: 'created_at',
    order: 'desc'
  };

  const { donations, total } = await Donation.find(filter, options);

  res.json({
    success: true,
    data: {
      donations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Generate impact report
// @route   GET /api/donations/:id/impact-report
// @access  Private
const generateImpactReport = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  
  if (!donation) {
    throw new AppError('Donation not found', 404);
  }

  const impactReport = await Donation.generateImpactReport(donation);
  
  res.json({
    success: true,
    data: { impactReport }
  });
});

module.exports = {
  createDonation,
  getDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
  processDonation,
  getDonationStats,
  getTopDonors,
  getRecurringDonations,
  cancelRecurringDonation,
  getDonorHistory,
  generateImpactReport
};
