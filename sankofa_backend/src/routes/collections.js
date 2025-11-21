const express = require('express');
const { body, query } = require('express-validator');
const {
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
} = require('../controllers/collectionController');
const { protect, authorize, checkOwnership } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Root endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Collections API endpoint',
    version: '1.0.0',
    endpoints: {
      list: 'GET /api/collections',
      create: 'POST /api/collections',
      stats: 'GET /api/collections/stats'
    }
  });
});

// Validation rules
const collectionValidation = [
  body('hub')
    .isMongoId()
    .withMessage('Valid hub ID is required'),
  body('plasticType')
    .isIn(['PET', 'HDPE', 'LDPE', 'PP', 'PS', 'Other'])
    .withMessage('Valid plastic type is required'),
  body('weight')
    .isFloat({ min: 0.1 })
    .withMessage('Weight must be at least 0.1 kg'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('collectionLocation.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Valid coordinates are required')
];

const updateCollectionValidation = [
  body('status')
    .optional()
    .isIn(['pending', 'verified', 'processed', 'paid', 'rejected'])
    .withMessage('Invalid status'),
  body('quality')
    .optional()
    .isIn(['excellent', 'good', 'fair', 'poor'])
    .withMessage('Invalid quality rating'),
  body('verificationNotes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Verification notes cannot exceed 500 characters')
];

// All routes are protected
router.use(protect);

// Collection routes
router.post('/', collectionValidation, asyncHandler(createCollection));
router.get('/', asyncHandler(getCollections));
router.get('/stats', authorize('admin', 'hub-manager'), asyncHandler(getCollectionStats));
router.get('/top-collectors', asyncHandler(getTopCollectors));
router.get('/location', asyncHandler(getCollectionsByLocation));
router.get('/user/:userId', checkOwnership(), asyncHandler(getCollectionsByUser));
router.get('/hub/:hubId', authorize('hub-manager', 'admin'), asyncHandler(getCollectionsByHub));
router.get('/:id', asyncHandler(getCollectionById));
router.put('/:id', updateCollectionValidation, asyncHandler(updateCollection));
router.delete('/:id', checkOwnership(), asyncHandler(deleteCollection));
router.patch('/:id/verify', authorize('hub-manager', 'admin'), asyncHandler(verifyCollection));

module.exports = router;
