const axios = require('axios');
require('dotenv').config();

async function fetchLinkedInPosts(companyUrl = 'https://www.linkedin.com/company/amazon') {
  try {
    console.log(`Fetching LinkedIn posts for ${companyUrl} via Proxycurl API...`);
    const PROXYCURL_API_KEY = process.env.PROXYCURL_API_KEY;
    if (!PROXYCURL_API_KEY) {
      throw new Error('PROXYCURL_API_KEY not set in .env');
    }

    const apiUrl = 'https://nubela.co/proxycurl/api/v2/linkedin/company/post';
    const response = await axios.get(apiUrl, {
      params: {
        api_key: PROXYCURL_API_KEY,
        linkedin_company_profile_url: companyUrl,
        paging_count: 10, // Increased to fetch more posts
      },
    });

    console.log('Proxycurl API response:', JSON.stringify(response.data, null, 2));

    if (!response.data.posts || !Array.isArray(response.data.posts)) {
      console.warn(`No posts found for ${companyUrl}. Response:`, response.data);
      return [];
    }

    const posts = response.data.posts.map(post => ({
      title: post.content?.text || post.title || 'Untitled LinkedIn Post',
      link: post.permalink || `https://www.linkedin.com/posts/${post.post_id || ''}`,
      source: 'LinkedIn',
      preview: post.content?.media?.thumbnail || post.media?.url || '',
    }));

    console.log('Fetched LinkedIn posts:', posts);
    return posts;
  } catch (err) {
    if (err.response) {
      console.error('Proxycurl API error:', {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data,
      });
      if (err.response.status === 401) {
        console.error('Authentication failed: Invalid or expired API key');
      } else if (err.response.status === 429) {
        console.error('Rate limit exceeded: Try again later');
      }
    } else if (err.request) {
      console.error('Network error: No response from Proxycurl API', err.message);
    } else {
      console.error('Error fetching LinkedIn posts:', err.message);
    }
    return [];
  }
}

module.exports = fetchLinkedInPosts;