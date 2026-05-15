const express = require('express');
const router = express.Router();
const { getAuditLogs, getAuditStats } = require('../controllers/audit.controller');
const { protect, requireRole } = require('../middleware/auth.middleware');

router.use(protect, requireRole('admin'));

router.get('/', getAuditLogs);
router.get('/stats', getAuditStats);

module.exports = router;
