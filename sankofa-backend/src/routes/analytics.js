const express = require('express');
const { query } = require('express-validator');
const {
  getDashboardStats,
  getCollectionAnalytics,
  getHealthAnalytics,
  getUserAnalytics,
  getHubAnalytics,
  getDonationAnalytics,
  getAIAnalytics,
  getEnvironmentalImpact,
  getPredictiveInsights,
  getPerformanceMetrics,
  getTrendAnalysis,
  getGeographicAnalytics,
  exportAnalyticsData
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Validation rules
const dateRangeValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  query('region')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Region must be between 2 and 50 characters')
];

// All routes are protected
router.use(protect);

// Analytics routes
router.get('/dashboard', asyncHandler(getDashboardStats));
router.get('/collections', dateRangeValidation, asyncHandler(getCollectionAnalytics));
router.get('/health', dateRangeValidation, asyncHandler(getHealthAnalytics));
router.get('/users', dateRangeValidation, asyncHandler(getUserAnalytics));
router.get('/hubs', dateRangeValidation, asyncHandler(getHubAnalytics));
router.get('/donations', dateRangeValidation, asyncHandler(getDonationAnalytics));
router.get('/ai', dateRangeValidation, asyncHandler(getAIAnalytics));
router.get('/environmental-impact', dateRangeValidation, asyncHandler(getEnvironmentalImpact));
router.get('/predictive-insights', asyncHandler(getPredictiveInsights));
router.get('/performance', dateRangeValidation, asyncHandler(getPerformanceMetrics));
router.get('/trends', dateRangeValidation, asyncHandler(getTrendAnalysis));
router.get('/geographic', dateRangeValidation, asyncHandler(getGeographicAnalytics));
router.get('/export', authorize('admin'), dateRangeValidation, asyncHandler(exportAnalyticsData));

module.exports = router;
