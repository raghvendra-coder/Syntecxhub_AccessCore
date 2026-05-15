const express = require('express');
const router = express.Router();
const { getCronJobs, getCronJobByName, triggerCronJob, toggleCronJob } = require('../controllers/cron.controller');
const { protect, requireRole } = require('../middleware/auth.middleware');

router.use(protect, requireRole('admin'));

router.get('/', getCronJobs);
router.get('/:name', getCronJobByName);
router.post('/:name/trigger', triggerCronJob);
router.patch('/:name/toggle', toggleCronJob);

module.exports = router;
