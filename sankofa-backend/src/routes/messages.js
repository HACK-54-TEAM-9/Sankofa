const express = require('express');
const { body } = require('express-validator');
const {
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
  getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const validate = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Validation rules
const sendMessageValidation = [
  body('recipientId')
    .notEmpty()
    .withMessage('Recipient ID is required'),
  body('subject')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject must be between 1 and 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message content must be between 1 and 5000 characters'),
];

// Routes
router.get('/', asyncHandler(getMessages));
router.get('/unread-count', asyncHandler(getUnreadCount));
router.post('/', sendMessageValidation, validate, asyncHandler(sendMessage));
router.put('/:id/read', asyncHandler(markAsRead));
router.delete('/:id', asyncHandler(deleteMessage));

module.exports = router;
