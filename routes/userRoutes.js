const express = require('express');
const router = express.Router();
const { getProfile, completeProfile, getAllUsers,awardLoginBonus } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/roleMiddleware');

router.get('/profile', protect, getProfile);
router.patch('/profile', protect, completeProfile);
router.get('/', protect, adminOnly, getAllUsers);
router.get('/login-bonus', protect, awardLoginBonus);

module.exports = router;