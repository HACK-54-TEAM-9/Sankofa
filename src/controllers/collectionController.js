const Collection = require('../models/Collection');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// @desc    Create a new collection
// @route   POST /api/collections
// @access  Private
const createCollection = asyncHandler(async (req, res) => {
  const collectionData = {
    ...req.body,
    collector: req.user.id,
    createdBy: req.user.id
  };

  const collection = await Collection.create(collectionData);
  
  logger.logCollectionEvent('created', req.user.id, req.body.hub, req.body.weight, collection.totalAmount);

  res.status(201).json({
    success: true,
    message: 'Collection created successfully',
    data: { collection }
  });
});

// @desc    Get collections
// @route   GET /api/collections
// @access  Private
const getCollections = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, plasticType } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  if (plasticType) filter.plasticType = plasticType;
  
  const collections = await Collection.find(filter)
    .populate('collector', 'name email')
    .populate('hub', 'name location')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Collection.countDocuments(filter);

  res.json({
    success: true,
    data: {
      collections,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get collection by ID
// @route   GET /api/collections/:id
// @access  Private
const getCollectionById = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id)
    .populate('collector', 'name email')
    .populate('hub', 'name location');

  if (!collection) {
    throw new AppError('Collection not found', 404);
  }

  res.json({
    success: true,
    data: { collection }
  });
});

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Private
const updateCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user.id },
    { new: true, runValidators: true }
  );

  if (!collection) {
    throw new AppError('Collection not found', 404);
  }

  res.json({
    success: true,
    message: 'Collection updated successfully',
    data: { collection }
  });
});

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private
const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findByIdAndDelete(req.params.id);

  if (!collection) {
    throw new AppError('Collection not found', 404);
  }

  res.json({
    success: true,
    message: 'Collection deleted successfully'
  });
});

// @desc    Verify collection
// @route   PATCH /api/collections/:id/verify
// @access  Private (Hub Manager, Admin)
const verifyCollection = asyncHandler(async (req, res) => {
  const { status, verificationNotes } = req.body;
  
  const collection = await Collection.findByIdAndUpdate(
    req.params.id,
    {
      status,
      verificationNotes,
      verifiedBy: req.user.id,
      verificationDate: new Date()
    },
    { new: true }
  );

  if (!collection) {
    throw new AppError('Collection not found', 404);
  }

  res.json({
    success: true,
    message: 'Collection verification updated',
    data: { collection }
  });
});

// @desc    Get collections by user
// @route   GET /api/collections/user/:userId
// @access  Private
const getCollectionsByUser = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const collections = await Collection.find({ collector: req.params.userId })
    .populate('hub', 'name location')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Collection.countDocuments({ collector: req.params.userId });

  res.json({
    success: true,
    data: {
      collections,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get collections by hub
// @route   GET /api/collections/hub/:hubId
// @access  Private (Hub Manager, Admin)
const getCollectionsByHub = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const collections = await Collection.find({ hub: req.params.hubId })
    .populate('collector', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Collection.countDocuments({ hub: req.params.hubId });

  res.json({
    success: true,
    data: {
      collections,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get collection statistics
// @route   GET /api/collections/stats
// @access  Private (Admin, Hub Manager)
const getCollectionStats = asyncHandler(async (req, res) => {
  const stats = await Collection.getCollectionStats();
  
  res.json({
    success: true,
    data: { stats: stats[0] || {} }
  });
});

// @desc    Get top collectors
// @route   GET /api/collections/top-collectors
// @access  Private
const getTopCollectors = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const topCollectors = await Collection.getTopCollectors(parseInt(limit));
  
  res.json({
    success: true,
    data: { topCollectors }
  });
});

// @desc    Get collections by location
// @route   GET /api/collections/location
// @access  Private
const getCollectionsByLocation = asyncHandler(async (req, res) => {
  const { coordinates, radius = 10 } = req.query;
  
  if (!coordinates) {
    throw new AppError('Coordinates are required', 400);
  }
  
  const [longitude, latitude] = coordinates.split(',').map(Number);
  const collections = await Collection.getCollectionsByLocation([longitude, latitude], parseFloat(radius));
  
  res.json({
    success: true,
    data: { collections }
  });
});

module.exports = {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  verifyCollection,
  getCollectionsByUser,
  getCollectionsByHub,
  getCollectionStats,
  getTopCollectors,
  getCollectionsByLocation
};
