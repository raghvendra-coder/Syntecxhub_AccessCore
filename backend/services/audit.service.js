const AuditLog = require('../models/AuditLog.model');

/**
 * Create an audit log entry
 */
const createAuditLog = async ({
  actor = null,
  actorName = 'System',
  actorEmail = 'system@accesscore.io',
  action,
  target = null,
  targetId = null,
  details = {},
  ipAddress = null,
  userAgent = null,
  status = 'success',
}) => {
  try {
    const log = await AuditLog.create({
      actor,
      actorName,
      actorEmail,
      action,
      target,
      targetId,
      details,
      ipAddress,
      userAgent,
      status,
    });
    return log;
  } catch (error) {
    // Non-blocking - log errors shouldn't crash the app
    console.error('❌ Failed to create audit log:', error.message);
    return null;
  }
};

/**
 * Extract client IP from request
 */
const getClientIP = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.ip ||
    'unknown'
  );
};

module.exports = { createAuditLog, getClientIP };
