const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for the given user ID
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Verify a JWT token and return the decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
};

module.exports = { generateToken, verifyToken };
