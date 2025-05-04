const express = require('express');
const router = express.Router();
const {
  saveFeed,
  reportFeed,
  getSavedFeeds,
  getAllFeeds,
  getAllFeedsForDisplay,
  aggregateRedditFeeds,
  aggregateLinkedInFeeds
} = require('../controllers/feedController');

const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/roleMiddleware');

router.post('/save', protect, saveFeed);
router.post('/report', protect, reportFeed);
router.get('/saved', protect, getSavedFeeds);
router.get('/', protect, adminOnly, getAllFeeds);
router.get('/all', protect, getAllFeedsForDisplay);
router.get('/aggregate/reddit', aggregateRedditFeeds);
router.get('/aggregate/linkedin', aggregateLinkedInFeeds);

module.exports = router;