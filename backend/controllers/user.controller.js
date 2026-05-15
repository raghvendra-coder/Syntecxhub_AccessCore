const User = require('../models/User.model');
const { sendSuccess, sendError, buildPagination } = require('../utils/response.utils');
const { asyncHandler } = require('../middleware/error.middleware');
const { createAuditLog, getClientIP } = require('../services/audit.service');

/**
 * @desc    Get all users with search, filter, pagination
 * @route   GET /api/users
 * @access  Admin, Manager
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    role = '',
    isBlocked = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  // Build query
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (role && ['user', 'manager', 'admin'].includes(role)) {
    query.role = role;
  }
  if (isBlocked === 'true') query.isBlocked = true;
  if (isBlocked === 'false') query.isBlocked = false;

  const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [users, total] = await Promise.all([
    User.find(query).sort(sortOptions).skip(skip).limit(limitNum),
    User.countDocuments(query),
  ]);

  return sendSuccess(res, 200, 'Users fetched successfully.', {
    users,
    pagination: buildPagination(pageNum, limitNum, total),
  });
});

/**
 * @desc    Get single user by ID
 * @route   GET /api/users/:id
 * @access  Admin, Manager
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return sendError(res, 404, 'User not found.');
  return sendSuccess(res, 200, 'User fetched successfully.', { user });
});

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Admin
 */
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, department } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) return sendError(res, 404, 'User not found.');

  const previousRole = user.role;
  if (name) user.name = name;
  if (email) user.email = email;
  if (department !== undefined) user.department = department;

  let action = 'USER_UPDATED';
  let details = { fieldsUpdated: Object.keys(req.body) };

  if (role && role !== previousRole) {
    user.role = role;
    action = 'ROLE_CHANGED';
    details = { previousRole, newRole: role };
  }

  await user.save();

  await createAuditLog({
    actor: req.user._id,
    actorName: req.user.name,
    actorEmail: req.user.email,
    action,
    target: user.email,
    targetId: user._id,
    details,
    ipAddress: getClientIP(req),
  });

  return sendSuccess(res, 200, 'User updated successfully.', { user });
});

/**
 * @desc    Block or unblock user
 * @route   PATCH /api/users/:id/block
 * @access  Admin
 */
const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return sendError(res, 404, 'User not found.');

  // Prevent self-block
  if (user._id.toString() === req.user._id.toString()) {
    return sendError(res, 400, 'You cannot block your own account.');
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  const action = user.isBlocked ? 'USER_BLOCKED' : 'USER_UNBLOCKED';

  await createAuditLog({
    actor: req.user._id,
    actorName: req.user.name,
    actorEmail: req.user.email,
    action,
    target: user.email,
    targetId: user._id,
    details: { isBlocked: user.isBlocked },
    ipAddress: getClientIP(req),
  });

  return sendSuccess(res, 200, `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully.`, {
    user,
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return sendError(res, 404, 'User not found.');

  if (user._id.toString() === req.user._id.toString()) {
    return sendError(res, 400, 'You cannot delete your own account.');
  }

  const deletedName = user.name;
  const deletedEmail = user.email;

  await User.findByIdAndDelete(req.params.id);

  await createAuditLog({
    actor: req.user._id,
    actorName: req.user.name,
    actorEmail: req.user.email,
    action: 'USER_DELETED',
    target: deletedEmail,
    targetId: req.params.id,
    details: { deletedUserName: deletedName, deletedUserEmail: deletedEmail },
    ipAddress: getClientIP(req),
  });

  return sendSuccess(res, 200, 'User deleted successfully.');
});

module.exports = { getAllUsers, getUserById, updateUser, toggleBlockUser, deleteUser };
