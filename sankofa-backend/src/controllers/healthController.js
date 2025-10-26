const HealthData = require('../models/HealthData');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// @desc    Get health insights
// @route   GET /api/health/insights
// @access  Public
const getHealthInsights = asyncHandler(async (req, res) => {
  const { location, region } = req.query;
  
  const filter = {};
  const options = { limit: 50, sort: 'created_at', order: 'desc' };
  
  const healthData = await HealthData.find(filter, options);

  res.json({
    success: true,
    data: { healthData }
  });
});

// @desc    Get health data by location
// @route   GET /api/health/location/:location
// @access  Public
const getHealthDataByLocation = asyncHandler(async (req, res) => {
  // Simple filter - in production you'd use PostGIS for geospatial queries
  const healthData = await HealthData.find({}, { limit: 10 });

  res.json({
    success: true,
    data: { healthData }
  });
});

// @desc    Get all health data (protected list)
// @route   GET /api/health/all
// @access  Private
const getHealthData = asyncHandler(async (req, res) => {
  const { limit = 100, sortBy = 'created_at' } = req.query;

  const healthData = await HealthData.find({}, { 
    limit: parseInt(limit, 10),
    sort: sortBy,
    order: 'desc'
  });

  res.json({
    success: true,
    data: { healthData }
  });
});

// @desc    Get health data by id
// @route   GET /api/health/:id
// @access  Private
const getHealthDataById = asyncHandler(async (req, res) => {
  const healthData = await HealthData.findById(req.params.id);

  if (!healthData) {
    throw new AppError('Health data not found', 404);
  }

  res.json({
    success: true,
    data: { healthData }
  });
});

// @desc    Create health data
// @route   POST /api/health
// @access  Private (Admin, Hub Manager)
const createHealthData = asyncHandler(async (req, res) => {
  const healthData = await HealthData.create(req.body);
  
  logger.info('Health data created', { location: healthData.location });

  res.status(201).json({
    success: true,
    message: 'Health data created successfully',
    data: { healthData }
  });
});

// @desc    Update health data
// @route   PUT /api/health/:id
// @access  Private (Admin, Hub Manager)
const updateHealthData = asyncHandler(async (req, res) => {
  const healthData = await HealthData.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated_at: new Date().toISOString() }
  );

  if (!healthData) {
    throw new AppError('Health data not found', 404);
  }

  res.json({
    success: true,
    message: 'Health data updated successfully',
    data: { healthData }
  });
});

// @desc    Delete health data
// @route   DELETE /api/health/:id
// @access  Private (Admin)
const deleteHealthData = asyncHandler(async (req, res) => {
  const healthData = await HealthData.findByIdAndDelete(req.params.id);

  if (!healthData) {
    throw new AppError('Health data not found', 404);
  }

  res.json({
    success: true,
    message: 'Health data deleted successfully'
  });
});

// @desc    Get health trends
// @route   GET /api/health/trends
// @access  Public
const getHealthTrends = asyncHandler(async (req, res) => {
  const { region, timeRange = '30d' } = req.query;
  
  const trends = await HealthData.getHealthTrends(region, timeRange);
  
  res.json({
    success: true,
    data: { trends }
  });
});

// @desc    Get high-risk areas
// @route   GET /api/health/high-risk-areas
// @access  Public
const getHighRiskAreas = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;
  
  const highRiskAreas = await HealthData.getHighRiskAreas(parseInt(limit));

  res.json({
    success: true,
    data: { highRiskAreas }
  });
});

// @desc    Get health data by region
// @route   GET /api/health/region/:region
// @access  Public
const getHealthDataByRegion = asyncHandler(async (req, res) => {
  // Simple region filter
  const healthData = await HealthData.find({}, { limit: 50 });

  res.json({
    success: true,
    data: { healthData }
  });
});

// @desc    Get health statistics
// @route   GET /api/health/stats
// @access  Public
const getHealthStats = asyncHandler(async (req, res) => {
  const stats = await HealthData.getHealthStats();
  
  res.json({
    success: true,
    data: { stats }
  });
});

// @desc    Get disease trends
// @route   GET /api/health/disease-trends
// @access  Public
const getDiseaseTrends = asyncHandler(async (req, res) => {
  const { disease, region } = req.query;
  
  const trends = await HealthData.getDiseaseTrends(disease, region);
  
  res.json({
    success: true,
    data: { trends }
  });
});

// @desc    Get environmental health indicators
// @route   GET /api/health/environmental
// @access  Public
const getEnvironmentalHealth = asyncHandler(async (req, res) => {
  const { location } = req.query;
  
  const indicators = await HealthData.getEnvironmentalIndicators(location);
  
  res.json({
    success: true,
    data: { indicators }
  });
});

// @desc    Get preventive tips
// @route   GET /api/health/preventive-tips
// @access  Public
const getPreventiveTips = asyncHandler(async (req, res) => {
  const { location, category } = req.query;
  
  const tips = await HealthData.getPreventiveTips(location, category);
  
  res.json({
    success: true,
    data: { tips }
  });
});

module.exports = {
  getHealthInsights,
  getHealthDataByLocation,
  getHealthData,
  getHealthDataById,
  createHealthData,
  updateHealthData,
  deleteHealthData,
  getHealthTrends,
  getHighRiskAreas,
  getHealthDataByRegion,
  getHealthStats,
  getDiseaseTrends,
  getEnvironmentalHealth,
  getPreventiveTips
};
