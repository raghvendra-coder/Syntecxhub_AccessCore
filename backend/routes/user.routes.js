const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  toggleBlockUser,
  deleteUser,
} = require('../controllers/user.controller');
const { protect, requireRole } = require('../middleware/auth.middleware');
const { validate, updateUserRules } = require('../middleware/validation.middleware');

router.use(protect);

router.get('/', requireRole('admin', 'manager'), getAllUsers);
router.get('/:id', requireRole('admin', 'manager'), getUserById);
router.put('/:id', requireRole('admin'), updateUserRules, validate, updateUser);
router.patch('/:id/block', requireRole('admin'), toggleBlockUser);
router.delete('/:id', requireRole('admin'), deleteUser);

module.exports = router;
