const User = require('../models/User.model');
const AuditLog = require('../models/AuditLog.model');
const CronJob = require('../models/CronJob.model');
const { sendSuccess } = require('../utils/response.utils');
const { asyncHandler } = require('../middleware/error.middleware');

/**
 * @desc    Get dashboard analytics
 * @route   GET /api/dashboard/analytics
 * @access  Admin, Manager
 */
const getAnalytics = asyncHandler(async (req, res) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    activeUsers,
    blockedUsers,
    adminUsers,
    managerUsers,
    regularUsers,
    newUsersThisMonth,
    totalLogs,
    recentActivity,
    userGrowth,
    cronJobs,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isBlocked: false }),
    User.countDocuments({ isBlocked: true }),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ role: 'manager' }),
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    AuditLog.countDocuments(),
    AuditLog.find()
      .populate('actor', 'name email role')
      .sort({ createdAt: -1 })
      .limit(10),
    // Daily new users for the last 7 days
    User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    CronJob.find().sort({ lastRun: -1 }),
  ]);

  // Login activity last 7 days
  const loginActivity = await AuditLog.aggregate([
    { $match: { action: 'USER_LOGIN', createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return sendSuccess(res, 200, 'Analytics fetched successfully.', {
    users: {
      total: totalUsers,
      active: activeUsers,
      blocked: blockedUsers,
      admins: adminUsers,
      managers: managerUsers,
      regular: regularUsers,
      newThisMonth: newUsersThisMonth,
    },
    logs: {
      total: totalLogs,
    },
    cronJobs: {
      total: cronJobs.length,
      active: cronJobs.filter((j) => j.isActive).length,
    },
    recentActivity,
    userGrowth,
    loginActivity,
  });
});

module.exports = { getAnalytics };
