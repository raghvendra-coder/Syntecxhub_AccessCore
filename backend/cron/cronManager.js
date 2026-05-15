const cron = require('node-cron');
const User = require('../models/User.model');
const AuditLog = require('../models/AuditLog.model');
const CronJob = require('../models/CronJob.model');
const { createAuditLog } = require('../services/audit.service');

// ─── Job Definitions ─────────────────────────────────────────────────────────
const JOB_DEFINITIONS = [
  {
    name: 'cleanup-inactive-users',
    description: 'Removes users who have never logged in and are older than 90 days',
    schedule: '0 2 * * 0', // Every Sunday at 2 AM
  },
  {
    name: 'cleanup-old-logs',
    description: 'Removes audit logs older than 90 days to keep the database lean',
    schedule: '0 3 * * *', // Every day at 3 AM
  },
  {
    name: 'generate-weekly-report',
    description: 'Generates weekly system health and usage summary report',
    schedule: '0 9 * * 1', // Every Monday at 9 AM
  },
  {
    name: 'scheduled-summary',
    description: 'Creates daily activity summary logs for the platform',
    schedule: '0 0 * * *', // Every day at midnight
  },
];

// ─── In-memory job registry ──────────────────────────────────────────────────
const registeredJobs = {};

// ─── Seed cron job records in DB ─────────────────────────────────────────────
const seedCronJobs = async () => {
  for (const def of JOB_DEFINITIONS) {
    await CronJob.findOneAndUpdate(
      { name: def.name },
      { $setOnInsert: { ...def } },
      { upsert: true, new: true }
    );
  }
};

// ─── Job Implementations ─────────────────────────────────────────────────────
const jobHandlers = {
  'cleanup-inactive-users': async () => {
    const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const result = await User.deleteMany({
      lastLogin: null,
      createdAt: { $lt: cutoff },
      role: 'user',
    });
    await createAuditLog({
      action: 'USERS_CLEANED',
      details: { deletedCount: result.deletedCount, cutoffDate: cutoff },
    });
    return `Cleaned ${result.deletedCount} inactive users`;
  },

  'cleanup-old-logs': async () => {
    const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const result = await AuditLog.deleteMany({ createdAt: { $lt: cutoff } });
    await createAuditLog({
      action: 'LOGS_CLEANED',
      details: { deletedCount: result.deletedCount, cutoffDate: cutoff },
    });
    return `Cleaned ${result.deletedCount} old audit logs`;
  },

  'generate-weekly-report': async () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [newUsers, loginEvents, blockedActions] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      AuditLog.countDocuments({ action: 'USER_LOGIN', createdAt: { $gte: sevenDaysAgo } }),
      AuditLog.countDocuments({
        action: { $in: ['USER_BLOCKED', 'USER_UNBLOCKED'] },
        createdAt: { $gte: sevenDaysAgo },
      }),
    ]);
    await createAuditLog({
      action: 'REPORT_GENERATED',
      details: { period: '7days', newUsers, loginEvents, blockedActions },
    });
    return `Weekly report: ${newUsers} new users, ${loginEvents} logins, ${blockedActions} block actions`;
  },

  'scheduled-summary': async () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [logins, registrations] = await Promise.all([
      AuditLog.countDocuments({ action: 'USER_LOGIN', createdAt: { $gte: oneDayAgo } }),
      AuditLog.countDocuments({ action: 'USER_REGISTER', createdAt: { $gte: oneDayAgo } }),
    ]);
    await createAuditLog({
      action: 'REPORT_GENERATED',
      details: { period: '24h', logins, registrations, generatedAt: new Date() },
    });
    return `Daily summary: ${logins} logins, ${registrations} registrations`;
  },
};

// ─── Execute a job by name ────────────────────────────────────────────────────
const executeJob = async (name, triggeredBy = null) => {
  const job = await CronJob.findOne({ name });
  if (!job || !job.isActive) return { success: false, message: 'Job inactive or not found' };

  const startTime = new Date();
  job.lastStatus = 'running';
  await job.save();

  try {
    const handler = jobHandlers[name];
    if (!handler) throw new Error(`No handler found for job: ${name}`);

    const message = await handler();
    const endTime = new Date();
    const duration = endTime - startTime;

    job.lastRun = endTime;
    job.lastStatus = 'success';
    job.lastMessage = message;
    job.runCount += 1;
    job.successCount += 1;
    job.executions.push({ startTime, endTime, status: 'success', message, duration });
    if (job.executions.length > 50) job.executions.shift(); // keep last 50
    await job.save();

    await createAuditLog({
      actor: triggeredBy?._id || null,
      actorName: triggeredBy?.name || 'System',
      actorEmail: triggeredBy?.email || 'system@accesscore.io',
      action: 'CRON_EXECUTED',
      target: name,
      details: { message, duration, triggeredManually: !!triggeredBy },
    });

    console.log(`✅ [CRON] ${name}: ${message}`);
    return { success: true, message };
  } catch (error) {
    const endTime = new Date();
    job.lastRun = endTime;
    job.lastStatus = 'failure';
    job.lastMessage = error.message;
    job.runCount += 1;
    job.failureCount += 1;
    job.executions.push({
      startTime,
      endTime,
      status: 'failure',
      message: error.message,
      duration: endTime - startTime,
    });
    if (job.executions.length > 50) job.executions.shift();
    await job.save();

    await createAuditLog({
      action: 'CRON_FAILED',
      target: name,
      details: { error: error.message },
      status: 'failure',
    });

    console.error(`❌ [CRON] ${name} failed: ${error.message}`);
    return { success: false, message: error.message };
  }
};

// ─── Manual trigger ──────────────────────────────────────────────────────────
const runJobByName = async (name, triggeredBy = null) => {
  await createAuditLog({
    actor: triggeredBy?._id || null,
    actorName: triggeredBy?.name || 'System',
    actorEmail: triggeredBy?.email || 'system@accesscore.io',
    action: 'CRON_TRIGGERED',
    target: name,
    details: { triggeredManually: true },
  });
  return executeJob(name, triggeredBy);
};

// ─── Initialize all cron jobs ─────────────────────────────────────────────────
const initCronJobs = async () => {
  await seedCronJobs();

  for (const def of JOB_DEFINITIONS) {
    if (cron.validate(def.schedule)) {
      registeredJobs[def.name] = cron.schedule(def.schedule, () => {
        executeJob(def.name);
      });
      console.log(`  📅 Registered cron: ${def.name} (${def.schedule})`);
    } else {
      console.warn(`  ⚠️ Invalid cron schedule for: ${def.name}`);
    }
  }
};

module.exports = { initCronJobs, runJobByName };
