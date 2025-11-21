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
  getHubAnalytics,
  getHubDashboard,
  getPendingCollections,
  searchCollector,
  registerCollector,
  registerCollectorFull,
  processTransaction
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

// Validation rules for new routes
const registerCollectorValidation = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('neighborhood')
    .trim()
    .notEmpty()
    .withMessage('Neighborhood is required'),
];

const registerCollectorFullValidation = [
  body('cardNumber')
    .trim()
    .notEmpty()
    .withMessage('Card number is required'),
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('neighborhood')
    .trim()
    .notEmpty()
    .withMessage('Neighborhood is required'),
  body('preferredLanguage')
    .isIn(['English', 'Twi', 'Ga', 'Ewe', 'Hausa'])
    .withMessage('Invalid language'),
  body('canRead')
    .isIn(['yes', 'no'])
    .withMessage('Invalid value for canRead'),
];

const processTransactionValidation = [
  body('collectorId')
    .notEmpty()
    .withMessage('Collector ID is required'),
  body('plasticType')
    .isIn(['PET', 'HDPE', 'LDPE', 'PP', 'PS', 'Other'])
    .withMessage('Invalid plastic type'),
  body('weight')
    .isFloat({ min: 0.1 })
    .withMessage('Weight must be at least 0.1 kg'),
  body('totalValue')
    .isFloat({ min: 0 })
    .withMessage('Total value must be a positive number'),
  body('instantCash')
    .isFloat({ min: 0 })
    .withMessage('Instant cash must be a positive number'),
  body('savingsToken')
    .isFloat({ min: 0 })
    .withMessage('Savings token must be a positive number'),
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

// New hub manager routes
router.get('/:id/dashboard', authorize('hub-manager', 'admin'), asyncHandler(getHubDashboard));
router.get('/:id/pending-collections', authorize('hub-manager', 'admin'), asyncHandler(getPendingCollections));
router.get('/:id/search-collector', authorize('hub-manager', 'admin'), asyncHandler(searchCollector));
router.post('/:id/register-collector', authorize('hub-manager', 'admin'), registerCollectorValidation, asyncHandler(registerCollector));
router.post('/:id/register-collector-full', authorize('hub-manager', 'admin'), registerCollectorFullValidation, asyncHandler(registerCollectorFull));
router.post('/:id/transactions', authorize('hub-manager', 'admin'), processTransactionValidation, asyncHandler(processTransaction));

// Admin routes
router.post('/', authorize('admin'), hubValidation, asyncHandler(createHub));
router.put('/:id', authorize('admin', 'hub-manager'), updateHubValidation, asyncHandler(updateHub));
router.patch('/:id/status', authorize('admin', 'hub-manager'), asyncHandler(updateHubStatus));
router.delete('/:id', authorize('admin'), asyncHandler(deleteHub));

module.exports = router;
