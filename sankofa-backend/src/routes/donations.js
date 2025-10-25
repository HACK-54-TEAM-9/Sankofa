const express = require('express');
const { body, query } = require('express-validator');
const {
  createDonation,
  getDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
  processDonation,
  getDonationStats,
  getTopDonors,
  getRecurringDonations,
  cancelRecurringDonation,
  getDonorHistory,
  generateImpactReport
} = require('../controllers/donationController');
const { protect, authorize, checkOwnership } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Validation rules
const donationValidation = [
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Donation amount must be at least 1 GH₵'),
  body('type')
    .isIn(['one-time', 'monthly', 'quarterly', 'yearly'])
    .withMessage('Invalid donation type'),
  body('payment.method')
    .isIn(['mobile_money', 'bank_transfer', 'credit_card', 'paypal', 'crypto'])
    .withMessage('Invalid payment method')
];

const paymentValidation = [
  body('paymentData')
    .isObject()
    .withMessage('Payment data is required'),
  body('paymentData.transactionId')
    .notEmpty()
    .withMessage('Transaction ID is required')
];

// All routes are protected
router.use(protect);

// Donation routes
router.get('/', authorize('admin'), asyncHandler(getDonations));
router.get('/stats', asyncHandler(getDonationStats));
router.get('/top-donors', asyncHandler(getTopDonors));
router.get('/recurring', authorize('admin'), asyncHandler(getRecurringDonations));
router.get('/history', asyncHandler(getDonorHistory));
router.get('/:id', checkOwnership(), asyncHandler(getDonationById));
router.get('/:id/impact-report', checkOwnership(), asyncHandler(generateImpactReport));
router.post('/', donationValidation, asyncHandler(createDonation));
router.post('/:id/process', paymentValidation, asyncHandler(processDonation));
router.put('/:id', checkOwnership(), asyncHandler(updateDonation));
router.patch('/:id/cancel-recurring', checkOwnership(), asyncHandler(cancelRecurringDonation));
router.delete('/:id', authorize('admin'), asyncHandler(deleteDonation));

module.exports = router;
