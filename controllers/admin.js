const Feed = require('../models/Feed');
const User = require('../models/User');

exports.getAnalytics = async (req, res) => {
  try {
    // Ensure only admins can access
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    // Count total posts
    const totalPosts = await Feed.countDocuments();

    // Count reported posts
    const reportedPosts = await Feed.countDocuments({ reported: true });

    // Count saved posts (distinct feeds in users' savedFeeds)
    const savedFeedsResult = await User.aggregate([
      { $unwind: '$savedFeeds' },
      { $group: { _id: null, uniqueFeeds: { $addToSet: '$savedFeeds' } } },
      { $project: { count: { $size: '$uniqueFeeds' } } },
    ]);
    const savedPosts = savedFeedsResult.length > 0 ? savedFeedsResult[0].count : 0;

    // Count active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo },
    });

    res.json({
      totalPosts,
      reportedPosts,
      savedPosts,
      activeUsers,
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
};

// Additional admin endpoints used by AdminPanel.jsx
exports.addCredits = async (req, res) => {
  const { credits } = req.body;
  const userId = req.params.userId;

  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    if (!credits || credits <= 0) {
      return res.status(400).json({ message: 'Invalid credits amount' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.credits += credits;
    await user.save();

    res.json({ message: `Added ${credits} credits to user`, user });
  } catch (err) {
    console.error('Error adding credits:', err);
    res.status(500).json({ message: 'Failed to add credits' });
  }
};

exports.changeRole = async (req, res) => {
  const { role } = req.body;
  const userId = req.params.userId;

  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ message: `User role changed to ${role}`, user });
  } catch (err) {
    console.error('Error changing role:', err);
    res.status(500).json({ message: 'Failed to change role' });
  }
};