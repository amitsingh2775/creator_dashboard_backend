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
