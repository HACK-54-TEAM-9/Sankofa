const Hub = require('../models/Hub');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// @desc    Get all hubs
// @route   GET /api/hubs
// @access  Private
const getHubs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  
  const options = {
    limit: parseInt(limit),
    offset: (page - 1) * parseInt(limit),
    sort: 'created_at',
    order: 'desc'
  };

  const { hubs, total } = await Hub.find(filter, options);

  res.json({
    success: true,
    data: {
      hubs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get hub by ID
// @route   GET /api/hubs/:id
// @access  Private
const getHubById = asyncHandler(async (req, res) => {
  const hub = await Hub.findById(req.params.id);

  if (!hub) {
    throw new AppError('Hub not found', 404);
  }

  res.json({
    success: true,
    data: { hub }
  });
});

// @desc    Create hub
// @route   POST /api/hubs
// @access  Private (Admin)
const createHub = asyncHandler(async (req, res) => {
  const hub = await Hub.create(req.body);
  
  logger.info('Hub created', { hubId: hub.id, name: hub.name });

  res.status(201).json({
    success: true,
    message: 'Hub created successfully',
    data: { hub }
  });
});

// @desc    Update hub
// @route   PUT /api/hubs/:id
// @access  Private (Admin, Hub Manager)
const updateHub = asyncHandler(async (req, res) => {
  const hub = await Hub.findByIdAndUpdate(
    req.params.id,
    req.body
  );

  if (!hub) {
    throw new AppError('Hub not found', 404);
  }

  res.json({
    success: true,
    message: 'Hub updated successfully',
    data: { hub }
  });
});

// @desc    Delete hub
// @route   DELETE /api/hubs/:id
// @access  Private (Admin)
const deleteHub = asyncHandler(async (req, res) => {
  const hub = await Hub.findByIdAndDelete(req.params.id);

  if (!hub) {
    throw new AppError('Hub not found', 404);
  }

  res.json({
    success: true,
    message: 'Hub deleted successfully'
  });
});

// @desc    Get nearby hubs
// @route   GET /api/hubs/nearby
// @access  Private
const getNearbyHubs = asyncHandler(async (req, res) => {
  const { coordinates, radius = 10 } = req.query;
  
  if (!coordinates) {
    throw new AppError('Coordinates are required', 400);
  }
  
  const [longitude, latitude] = coordinates.split(',').map(Number);
  const hubs = await Hub.getNearbyHubs([longitude, latitude], parseFloat(radius));
  
  res.json({
    success: true,
    data: { hubs }
  });
});

// @desc    Get hub statistics
// @route   GET /api/hubs/stats
// @access  Private (Admin)
const getHubStats = asyncHandler(async (req, res) => {
  const stats = await Hub.getHubStats();
  
  res.json({
    success: true,
    data: { stats }
  });
});

// @desc    Get top performing hubs
// @route   GET /api/hubs/top-performing
// @access  Private
const getTopPerformingHubs = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const topHubs = await Hub.getTopPerformingHubs(parseInt(limit));
  
  res.json({
    success: true,
    data: { topHubs }
  });
});

// @desc    Update hub status
// @route   PATCH /api/hubs/:id/status
// @access  Private (Admin, Hub Manager)
const updateHubStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const hub = await Hub.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!hub) {
    throw new AppError('Hub not found', 404);
  }

  res.json({
    success: true,
    message: 'Hub status updated successfully',
    data: { hub }
  });
});

// @desc    Get hub collectors
// @route   GET /api/hubs/:id/collectors
// @access  Private (Hub Manager, Admin)
const getHubCollectors = asyncHandler(async (req, res) => {
  const collectors = await Hub.getHubCollectors(req.params.id);
  
  res.json({
    success: true,
    data: { collectors }
  });
});

// @desc    Get hub collections
// @route   GET /api/hubs/:id/collections
// @access  Private (Hub Manager, Admin)
const getHubCollections = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const collections = await Hub.getHubCollections(req.params.id, parseInt(page), parseInt(limit));
  
  res.json({
    success: true,
    data: { collections }
  });
});

// @desc    Get hub analytics
// @route   GET /api/hubs/:id/analytics
// @access  Private (Hub Manager, Admin)
const getHubAnalytics = asyncHandler(async (req, res) => {
  const analytics = await Hub.getHubAnalytics(req.params.id);
  
  res.json({
    success: true,
    data: { analytics }
  });
});

module.exports = {
  getHubs,
  getHubById,
  createHub,
  updateHub,
  deleteHub,
  getNearbyHubs,
  getHubStats,
  getTopPerformingHubs,
  updateHubStatus,
  getHubCollectors,
  getHubCollections,
  getHubAnalytics
};
