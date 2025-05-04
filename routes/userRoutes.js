const express = require('express');
const router = express.Router();
const { getProfile, completeProfile, getAllUsers } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/roleMiddleware');

router.get('/profile', protect, getProfile);
router.patch('/profile', protect, completeProfile);
router.get('/', protect, adminOnly, getAllUsers);

module.exports = router;