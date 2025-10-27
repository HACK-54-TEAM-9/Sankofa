const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user authentication
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} role - User role
 * @param {string} expiresIn - Token expiration time (e.g., '7d', '30d')
 * @returns {string} JWT token
 */
const generateToken = (userId, email, role, expiresIn = '7d') => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    {
      id: userId,
      email: email,
      role: role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: expiresIn
    }
  );
};

module.exports = generateToken;
