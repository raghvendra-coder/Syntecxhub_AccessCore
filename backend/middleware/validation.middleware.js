const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/response.utils');

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return sendError(res, 400, messages[0], errors.array());
  }
  next();
};

// ─── Auth Validation Rules ───────────────────────────────────────────────────
const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// ─── User Validation Rules ───────────────────────────────────────────────────
const updateUserRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['user', 'manager', 'admin']).withMessage('Invalid role'),
];

module.exports = { validate, registerRules, loginRules, updateUserRules };
