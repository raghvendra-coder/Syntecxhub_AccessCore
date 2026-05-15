const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    actorName: {
      type: String,
      default: 'System',
    },
    actorEmail: {
      type: String,
      default: 'system@accesscore.io',
    },
    action: {
      type: String,
      required: true,
      enum: [
        'USER_LOGIN',
        'USER_LOGOUT',
        'USER_REGISTER',
        'USER_UPDATED',
        'USER_DELETED',
        'USER_BLOCKED',
        'USER_UNBLOCKED',
        'ROLE_CHANGED',
        'PASSWORD_CHANGED',
        'CRON_EXECUTED',
        'CRON_FAILED',
        'CRON_TRIGGERED',
        'REPORT_GENERATED',
        'LOGS_CLEANED',
        'USERS_CLEANED',
      ],
    },
    target: {
      type: String,
      default: null,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success',
    },
  },
  {
    timestamps: true,
  }
);

// ─── Index for fast querying ─────────────────────────────────────────────────
auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
