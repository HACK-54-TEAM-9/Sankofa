const express = require('express');
const { body } = require('express-validator');
const {
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
} = require('../controllers/hubController');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Root endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hubs API endpoint',
    version: '1.0.0',
    endpoints: {
      list: 'GET /api/hubs',
      nearby: 'GET /api/hubs/nearby',
      stats: 'GET /api/hubs/stats'
    }
  });
});

// Validation rules
const hubValidation = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Hub name must be between 2 and 100 characters'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Valid coordinates are required'),
  body('contact.phone')
    .matches(/^\+233\d{9}$/)
    .withMessage('Please provide a valid Ghana phone number'),
  body('manager')
    .isMongoId()
    .withMessage('Valid manager ID is required')
];

const updateHubValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Hub name must be between 2 and 100 characters'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'maintenance', 'closed'])
    .withMessage('Invalid status value')
];

// All routes are protected
router.use(protect);

// Hub management routes
router.get('/', asyncHandler(getHubs));
router.get('/nearby', asyncHandler(getNearbyHubs));
router.get('/stats', authorize('admin'), asyncHandler(getHubStats));
router.get('/top-performing', asyncHandler(getTopPerformingHubs));
router.get('/:id', asyncHandler(getHubById));
router.get('/:id/collectors', authorize('hub-manager', 'admin'), asyncHandler(getHubCollectors));
router.get('/:id/collections', authorize('hub-manager', 'admin'), asyncHandler(getHubCollections));
router.get('/:id/analytics', authorize('hub-manager', 'admin'), asyncHandler(getHubAnalytics));
router.post('/', authorize('admin'), hubValidation, asyncHandler(createHub));
router.put('/:id', authorize('admin', 'hub-manager'), updateHubValidation, asyncHandler(updateHub));
router.patch('/:id/status', authorize('admin', 'hub-manager'), asyncHandler(updateHubStatus));
router.delete('/:id', authorize('admin'), asyncHandler(deleteHub));

module.exports = router;
