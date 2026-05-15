const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/dashboard.controller');
const { protect, requireRole } = require('../middleware/auth.middleware');

router.get('/analytics', protect, requireRole('admin', 'manager'), getAnalytics);

module.exports = router;
