const express = require('express');
const { body, query } = require('express-validator');
const {
  getHealthInsights,
  getHealthDataByLocation,
  getHealthData,
  getHealthDataById,
  createHealthData,
  updateHealthData,
  deleteHealthData,
  getHealthDataByRegion,
  getHighRiskAreas,
  getHealthTrends,
  getHealthStats,
  getDiseaseTrends,
  getEnvironmentalHealth,
  getPreventiveTips
} = require('../controllers/healthController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Root endpoint
router.get('/', optionalAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Health API endpoint',
    version: '1.0.0',
    endpoints: {
      insights: 'GET /api/health/insights',
      trends: 'GET /api/health/trends',
      predictive: 'GET /api/health/predictive'
    }
  });
});

// Validation rules
const healthDataValidation = [
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Valid coordinates are required'),
  body('source')
    .isIn(['collection_data', 'health_records', 'environmental_monitoring', 'ai_prediction', 'manual_entry'])
    .withMessage('Valid data source is required'),
  body('healthMetrics.riskAssessment.overallRisk')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Valid risk level is required')
];

// Public routes (with optional auth for enhanced features)
router.get('/insights', optionalAuth, asyncHandler(getHealthInsights));
router.get('/trends', optionalAuth, asyncHandler(getHealthTrends));
router.get('/impact-analysis', optionalAuth, (req, res) => {
  res.status(501).json({ success: false, message: 'Impact analysis not implemented yet' });
});
router.get('/high-risk-areas', optionalAuth, asyncHandler(getHighRiskAreas));
router.get('/disease-patterns', optionalAuth, asyncHandler(getDiseaseTrends));
router.get('/environmental', optionalAuth, asyncHandler(getEnvironmentalHealth));
router.get('/predictive', optionalAuth, (req, res) => {
  res.status(501).json({ success: false, message: 'Predictive insights not implemented yet' });
});

// Protected routes
router.use(protect);

// Health data CRUD operations
router.get('/', asyncHandler(getHealthData));
router.get('/region/:region', asyncHandler(getHealthDataByRegion));
router.get('/:id', asyncHandler(getHealthDataById));
router.post('/', authorize('admin', 'hub-manager'), healthDataValidation, asyncHandler(createHealthData));
router.put('/:id', authorize('admin', 'hub-manager'), asyncHandler(updateHealthData));
router.delete('/:id', authorize('admin'), asyncHandler(deleteHealthData));

module.exports = router;
