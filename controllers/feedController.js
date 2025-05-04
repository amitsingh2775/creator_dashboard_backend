const Feed = require('../models/Feed');
const User = require('../models/User');
const fetchRedditPosts = require('../utils/redditFetcher');
const fetchLinkedInPosts = require('../utils/linkedinFetcher');

exports.saveFeed = async (req, res) => {
  const { title, link, source } = req.body;
  const feed = await Feed.create({ userId: req.user.id, title, link, source });

  const user = await User.findById(req.user.id);
  user.savedFeeds.push(feed._id);
  user.credits += 5;
  await user.save();

  res.status(201).json(feed);
};

exports.reportFeed = async (req, res) => {
  const { feedId } = req.body;
  const feed = await Feed.findById(feedId);
  if (!feed) return res.status(404).json({ message: 'Feed not found' });
  feed.reported = true;
  await feed.save();
  res.json(feed);
};

exports.getSavedFeeds = async (req, res) => {
  const user = await User.findById(req.user.id);
  const feeds = await Feed.find({ _id: { $in: user.savedFeeds } });
  res.json(feeds);
};

exports.getAllFeeds = async (req, res) => {
  const feeds = await Feed.find();
  res.json(feeds);
};

exports.getAllFeedsForDisplay = async (req, res) => {
  try {
    const feeds = await Feed.find({ reported: false });
    res.json(feeds);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch feeds' });
  }
};

exports.aggregateRedditFeeds = async (req, res) => {
  try {
    const redditPosts = await fetchRedditPosts();
    const inserted = [];
    for (const post of redditPosts) {
      const exists = await Feed.findOne({ link: post.link });
      if (!exists) {
        const feed = await Feed.create(post);
        inserted.push(feed);
      }
    }
    res.json({ message: `${inserted.length} new Reddit posts added.`, feeds: inserted });
  } catch (err) {
    res.status(500).json({ message: 'Reddit feed aggregation failed' });
  }
};

exports.aggregateLinkedInFeeds = async (req, res) => {
  try {
    const linkedinPosts = await fetchLinkedInPosts();
    const inserted = [];
    for (const post of linkedinPosts) {
      const exists = await Feed.findOne({ link: post.link });
      if (!exists) {
        const feed = await Feed.create(post);
        inserted.push(feed);
      }
    }
    res.json({ message: `${inserted.length} new LinkedIn posts added.`, feeds: inserted });
  } catch (err) {
    res.status(500).json({ message: 'LinkedIn feed aggregation failed' });
  }
};