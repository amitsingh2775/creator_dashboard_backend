const User = require('../models/User');

exports.updateCredits = async (req, res) => {
  const { userId, credits } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.credits = credits;
  await user.save();
  res.json(user);
};

exports.getCredits = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ credits: user.credits });
};
