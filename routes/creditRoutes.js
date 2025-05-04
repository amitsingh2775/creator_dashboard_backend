const express = require('express');
const router = express.Router();
const { updateCredits, getCredits } = require('../controllers/creditController');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/roleMiddleware');

router.get('/', protect, getCredits);
router.put('/update', protect, adminOnly, updateCredits);

module.exports = router;