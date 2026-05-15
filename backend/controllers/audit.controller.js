const AuditLog = require('../models/AuditLog.model');
const { sendSuccess, buildPagination } = require('../utils/response.utils');
const { asyncHandler } = require('../middleware/error.middleware');

/**
 * @desc    Get audit logs with advanced filtering
 * @route   GET /api/audit
 * @access  Admin
 */
const getAuditLogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    action = '',
    actorId = '',
    status = '',
    startDate = '',
    endDate = '',
    sortOrder = 'desc',
  } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const query = {};
  if (action) query.action = action;
  if (actorId) query.actor = actorId;
  if (status && ['success', 'failure'].includes(status)) query.status = status;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .populate('actor', 'name email role')
      .sort({ createdAt: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limitNum),
    AuditLog.countDocuments(query),
  ]);

  return sendSuccess(res, 200, 'Audit logs fetched successfully.', {
    logs,
    pagination: buildPagination(pageNum, limitNum, total),
  });
});

/**
 * @desc    Get audit log stats (action counts)
 * @route   GET /api/audit/stats
 * @access  Admin
 */
const getAuditStats = asyncHandler(async (req, res) => {
  const stats = await AuditLog.aggregate([
    { $group: { _id: '$action', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const totalLogs = await AuditLog.countDocuments();
  const failureLogs = await AuditLog.countDocuments({ status: 'failure' });

  return sendSuccess(res, 200, 'Audit stats fetched.', {
    actionBreakdown: stats,
    totalLogs,
    failureLogs,
    successLogs: totalLogs - failureLogs,
  });
});

module.exports = { getAuditLogs, getAuditStats };
