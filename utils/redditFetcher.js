const axios = require('axios');

async function fetchRedditPosts() {
  try {
    console.log('Fetching Reddit posts...');
    const response = await axios.get('https://www.reddit.com/r/technology/new.json?limit=10');

    const posts = response.data.data.children.map(post => ({
      title: post.data.title,
      link: post.data.url,
      source: 'Reddit',
      preview: post.data.thumbnail && post.data.thumbnail !== 'self' ? post.data.thumbnail : '',
    }));

    console.log('Fetched Reddit posts:', posts);
    return posts;
  } catch (err) {
    console.error('Error fetching Reddit posts:', err.message);
    return [];
  }
}

module.exports = fetchRedditPosts;