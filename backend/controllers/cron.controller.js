const CronJob = require('../models/CronJob.model');
const { sendSuccess, sendError } = require('../utils/response.utils');
const { asyncHandler } = require('../middleware/error.middleware');
const { runJobByName } = require('../cron/cronManager');

/**
 * @desc    Get all cron jobs
 * @route   GET /api/cron
 * @access  Admin
 */
const getCronJobs = asyncHandler(async (req, res) => {
  const jobs = await CronJob.find().sort({ name: 1 });
  return sendSuccess(res, 200, 'Cron jobs fetched.', { jobs });
});

/**
 * @desc    Get single cron job
 * @route   GET /api/cron/:name
 * @access  Admin
 */
const getCronJobByName = asyncHandler(async (req, res) => {
  const job = await CronJob.findOne({ name: req.params.name });
  if (!job) return sendError(res, 404, 'Cron job not found.');
  return sendSuccess(res, 200, 'Cron job fetched.', { job });
});

/**
 * @desc    Manually trigger a cron job
 * @route   POST /api/cron/:name/trigger
 * @access  Admin
 */
const triggerCronJob = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const job = await CronJob.findOne({ name });
  if (!job) return sendError(res, 404, 'Cron job not found.');

  // Run the job
  const result = await runJobByName(name, req.user);
  if (!result.success) {
    return sendError(res, 500, result.message);
  }

  const updatedJob = await CronJob.findOne({ name });
  return sendSuccess(res, 200, `Cron job "${name}" triggered successfully.`, { job: updatedJob });
});

/**
 * @desc    Toggle cron job active state
 * @route   PATCH /api/cron/:name/toggle
 * @access  Admin
 */
const toggleCronJob = asyncHandler(async (req, res) => {
  const job = await CronJob.findOne({ name: req.params.name });
  if (!job) return sendError(res, 404, 'Cron job not found.');

  job.isActive = !job.isActive;
  await job.save();

  return sendSuccess(res, 200, `Cron job ${job.isActive ? 'activated' : 'deactivated'}.`, { job });
});

module.exports = { getCronJobs, getCronJobByName, triggerCronJob, toggleCronJob };
