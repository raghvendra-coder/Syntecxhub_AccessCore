const User = require('../models/User.model');
const { generateToken } = require('../utils/jwt.utils');
const { sendSuccess, sendError } = require('../utils/response.utils');
const { asyncHandler } = require('../middleware/error.middleware');
const { createAuditLog, getClientIP } = require('../services/audit.service');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, department } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendError(res, 409, 'A user with this email already exists.');
  }

  // Check if first user (make admin)
  const userCount = await User.countDocuments();
  const role = userCount === 0 ? 'admin' : 'user';

  // Create user
  const user = await User.create({ name, email, password, department, role });

  // Audit log
  await createAuditLog({
    actor: user._id,
    actorName: user.name,
    actorEmail: user.email,
    action: 'USER_REGISTER',
    target: user.email,
    targetId: user._id,
    details: { role: user.role },
    ipAddress: getClientIP(req),
    userAgent: req.headers['user-agent'],
  });

  const token = generateToken(user._id);

  return sendSuccess(res, 201, 'Account created successfully.', {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password included
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return sendError(res, 401, 'Invalid email or password.');
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await createAuditLog({
      action: 'USER_LOGIN',
      target: email,
      details: { reason: 'Invalid password' },
      ipAddress: getClientIP(req),
      status: 'failure',
    });
    return sendError(res, 401, 'Invalid email or password.');
  }

  // Check if blocked
  if (user.isBlocked) {
    return sendError(res, 403, 'Your account has been blocked. Contact an administrator.');
  }

  // Update login stats
  user.lastLogin = new Date();
  user.loginCount += 1;
  await user.save();

  // Audit log
  await createAuditLog({
    actor: user._id,
    actorName: user.name,
    actorEmail: user.email,
    action: 'USER_LOGIN',
    target: user.email,
    targetId: user._id,
    details: { loginCount: user.loginCount },
    ipAddress: getClientIP(req),
    userAgent: req.headers['user-agent'],
  });

  const token = generateToken(user._id);

  return sendSuccess(res, 200, 'Logged in successfully.', {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      lastLogin: user.lastLogin,
      loginCount: user.loginCount,
      createdAt: user.createdAt,
    },
  });
});

/**
 * @desc    Get current authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return sendSuccess(res, 200, 'User fetched successfully.', { user });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  await createAuditLog({
    actor: req.user._id,
    actorName: req.user.name,
    actorEmail: req.user.email,
    action: 'USER_LOGOUT',
    target: req.user.email,
    targetId: req.user._id,
    ipAddress: getClientIP(req),
    userAgent: req.headers['user-agent'],
  });
  return sendSuccess(res, 200, 'Logged out successfully.');
});

module.exports = { register, login, getMe, logout };
