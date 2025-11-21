const express = require('express');
const {
  handleUSSDCallback,
  getUSSDStatus,
  testUSSDFlow
} = require('../controllers/ussdController');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Public route - USSD gateway callback
router.post('/callback', asyncHandler(handleUSSDCallback));

// Protected routes
router.get('/status', protect, authorize('admin'), asyncHandler(getUSSDStatus));
router.post('/test', protect, authorize('admin'), asyncHandler(testUSSDFlow));

module.exports = router;
