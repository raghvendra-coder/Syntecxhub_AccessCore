const { verifyToken } = require('../utils/jwt.utils');
const User = require('../models/User.model');
const { sendError } = require('../utils/response.utils');

/**
 * Protect route - verify JWT and attach user to request
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 401, 'Access denied. No token provided.');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Fetch user from DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(res, 401, 'Token is invalid. User no longer exists.');
    }

    if (user.isBlocked) {
      return sendError(res, 403, 'Your account has been blocked. Contact an administrator.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 401, 'Invalid token.');
    }
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token has expired. Please login again.');
    }
    return sendError(res, 500, 'Authentication error.');
  }
};

/**
 * Role-based access control middleware factory
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required.');
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      );
    }

    next();
  };
};

module.exports = { protect, requireRole };
