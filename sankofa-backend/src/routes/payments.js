const express = require('express');
const { body } = require('express-validator');
const {
  processPayment,
  getPaymentStatus,
  getPaymentHistory,
  refundPayment,
  getPaymentStats,
  processMobileMoneyPayment,
  processBankTransfer,
  processCardPayment,
  webhookHandler,
  getPaymentMethods,
  updatePaymentMethod
} = require('../controllers/paymentController');
const { protect, authorize, checkOwnership } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Validation rules
const paymentValidation = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('currency')
    .isIn(['GHS', 'USD', 'EUR', 'GBP'])
    .withMessage('Invalid currency'),
  body('method')
    .isIn(['mobile_money', 'bank_transfer', 'credit_card', 'paypal', 'crypto'])
    .withMessage('Invalid payment method'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

const mobileMoneyValidation = [
  body('phoneNumber')
    .matches(/^\+233\d{9}$/)
    .withMessage('Please provide a valid Ghana phone number'),
  body('network')
    .isIn(['MTN', 'Vodafone', 'AirtelTigo'])
    .withMessage('Invalid mobile money network')
];

const bankTransferValidation = [
  body('accountNumber')
    .isLength({ min: 10, max: 20 })
    .withMessage('Valid account number is required'),
  body('bankCode')
    .isLength({ min: 3, max: 10 })
    .withMessage('Valid bank code is required'),
  body('accountName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Account name is required')
];

// All routes are protected
router.use(protect);

// Payment routes
router.get('/methods', asyncHandler(getPaymentMethods));
router.get('/history', asyncHandler(getPaymentHistory));
router.get('/stats', authorize('admin'), asyncHandler(getPaymentStats));
router.get('/:paymentId/status', checkOwnership(), asyncHandler(getPaymentStatus));
router.post('/', paymentValidation, asyncHandler(processPayment));
router.post('/mobile-money', mobileMoneyValidation, asyncHandler(processMobileMoneyPayment));
router.post('/bank-transfer', bankTransferValidation, asyncHandler(processBankTransfer));
router.post('/card', paymentValidation, asyncHandler(processCardPayment));
router.post('/webhook', asyncHandler(webhookHandler)); // No auth for webhooks
router.put('/methods/:methodId', asyncHandler(updatePaymentMethod));
router.post('/:paymentId/refund', authorize('admin'), asyncHandler(refundPayment));

module.exports = router;
