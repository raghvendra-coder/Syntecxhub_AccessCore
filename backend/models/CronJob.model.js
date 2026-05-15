const mongoose = require('mongoose');

const cronJobSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    schedule: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastRun: {
      type: Date,
      default: null,
    },
    lastStatus: {
      type: String,
      enum: ['success', 'failure', 'running', 'pending'],
      default: 'pending',
    },
    lastMessage: {
      type: String,
      default: null,
    },
    runCount: {
      type: Number,
      default: 0,
    },
    successCount: {
      type: Number,
      default: 0,
    },
    failureCount: {
      type: Number,
      default: 0,
    },
    nextRun: {
      type: Date,
      default: null,
    },
    executions: [
      {
        startTime: Date,
        endTime: Date,
        status: { type: String, enum: ['success', 'failure'] },
        message: String,
        duration: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CronJob', cronJobSchema);
