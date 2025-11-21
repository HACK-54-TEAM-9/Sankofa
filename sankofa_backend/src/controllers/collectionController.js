const Collection = require('../models/Collection');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// @desc    Create a new collection
// @route   POST /api/collections
// @access  Private
const createCollection = asyncHandler(async (req, res) => {
  const collectionData = {
    ...req.body,
    collector_id: req.user.id,
    created_by: req.user.id
  };

  const collection = await Collection.create(collectionData);
  
  logger.logCollectionEvent('created', req.user.id, req.body.hub_id, req.body.weight, collection.total_amount);

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
  const { page = 1, limit = 10, status, plastic_type } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  if (plastic_type) filter.plastic_type = plastic_type;
  
  const options = {
    limit: parseInt(limit),
    offset: (page - 1) * parseInt(limit),
    sort: 'created_at',
    order: 'desc'
  };

  const { collections, total } = await Collection.find(filter, options);

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
  const collection = await Collection.findById(req.params.id);

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
    { ...req.body, updated_by: req.user.id }
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
  const { status, verification_notes } = req.body;
  
  const collection = await Collection.verifyCollection(
    req.params.id,
    req.user.id,
    verification_notes
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
  
  const filter = { collector_id: req.params.userId };
  const options = {
    limit: parseInt(limit),
    offset: (page - 1) * parseInt(limit),
    sort: 'created_at',
    order: 'desc'
  };

  const { collections, total } = await Collection.find(filter, options);

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
  
  const filter = { hub_id: req.params.hubId };
  const options = {
    limit: parseInt(limit),
    offset: (page - 1) * parseInt(limit),
    sort: 'created_at',
    order: 'desc'
  };

  const { collections, total } = await Collection.find(filter, options);

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
  const { userId, hubId } = req.query;
  
  const filter = {};
  if (userId) filter.collector_id = userId;
  if (hubId) filter.hub_id = hubId;
  
  const stats = await Collection.getStats(filter);
  
  res.json({
    success: true,
    data: { stats }
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
  
  // Simple location filtering - in a real app this would use PostGIS
  const collections = await Collection.find({}, { limit: 100 });
  
  res.json({
    success: true,
    data: { collections: collections.collections }
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
