const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const auth = require('../middleware/authMiddleware');

router.get('/analytics', auth, adminController.getAnalytics);
router.post('/add-credits/:userId', auth, adminController.addCredits);
router.post('/change-role/:userId', auth, adminController.changeRole);

module.exports = router;