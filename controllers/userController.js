const User = require('../models/User');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

exports.completeProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  Object.assign(user, req.body);
  user.credits += 20;
  await user.save();
  res.json(user);
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.awardLoginBonus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (!user.lastLoginBonus || user.lastLoginBonus < twentyFourHoursAgo) {
      user.credits += 5;
      user.lastLoginBonus = now;
      await user.save();
      return res.json({ awarded: true, credits: user.credits, message: '5 credits awarded for daily login!' });
    }

    res.json({ awarded: false, credits: user.credits, message: 'No bonus available yet.' });
  } catch (err) {
    console.error('Error awarding login bonus:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
