const { validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

/**
 * Middleware to check validation results from express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    throw new AppError(errorMessages, 400);
  }
  
  next();
};

module.exports = validate;
