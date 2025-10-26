const express = require('express');
const { body } = require('express-validator');
const {
  getVolunteers,
  getVolunteerById,
  createVolunteerApplication,
  updateVolunteerApplication,
  deleteVolunteerApplication,
  approveVolunteer,
  rejectVolunteer,
  getVolunteerOpportunities,
  getVolunteerStats,
  getVolunteerApplications,
  updateVolunteerStatus,
  assignVolunteerToOpportunity
} = require('../controllers/volunteerController');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Root endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Volunteers API endpoint',
    version: '1.0.0',
    endpoints: {
      opportunities: 'GET /api/volunteers/opportunities',
      stats: 'GET /api/volunteers/stats',
      applications: 'GET /api/volunteers/applications'
    }
  });
});

// Validation rules
const volunteerApplicationValidation = [
  body('opportunityId')
    .isMongoId()
    .withMessage('Valid opportunity ID is required'),
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .matches(/^\+233\d{9}$/)
    .withMessage('Please provide a valid Ghana phone number')
];

const volunteerUpdateValidation = [
  body('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected', 'active', 'inactive'])
    .withMessage('Invalid status value'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('availability')
    .optional()
    .isObject()
    .withMessage('Availability must be an object')
];

// All routes are protected
router.use(protect);

// Volunteer management routes
router.get('/', authorize('admin', 'hub-manager'), asyncHandler(getVolunteers));
router.get('/opportunities', asyncHandler(getVolunteerOpportunities));
router.get('/applications', authorize('admin', 'hub-manager'), asyncHandler(getVolunteerApplications));
router.get('/stats', authorize('admin'), asyncHandler(getVolunteerStats));
router.get('/:id', asyncHandler(getVolunteerById));
router.post('/apply', volunteerApplicationValidation, asyncHandler(createVolunteerApplication));
router.put('/:id', volunteerUpdateValidation, asyncHandler(updateVolunteerApplication));
router.patch('/:id/approve', authorize('admin', 'hub-manager'), asyncHandler(approveVolunteer));
router.patch('/:id/reject', authorize('admin', 'hub-manager'), asyncHandler(rejectVolunteer));
router.patch('/:id/status', authorize('admin', 'hub-manager'), asyncHandler(updateVolunteerStatus));
router.patch('/:id/assign', authorize('admin', 'hub-manager'), asyncHandler(assignVolunteerToOpportunity));
router.delete('/:id', authorize('admin'), asyncHandler(deleteVolunteerApplication));

module.exports = router;
