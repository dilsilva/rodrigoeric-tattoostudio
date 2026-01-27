// Vercel Serverless Function - Regular (not Edge) for better compatibility
// This version uses the standard Node.js runtime

export default async function handler(req, res) {
  // Set CORS headers FIRST - before anything else
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle CORS preflight - MUST be first
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse request body
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get environment variables
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_OWNER = process.env.GITHUB_OWNER;
    const GITHUB_REPO = process.env.GITHUB_REPO;

    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ 
        error: 'Server configuration error. Please configure GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO in Vercel environment variables.' 
      });
    }

    // Create issue
    const issueTitle = `New Tattoo Inquiry from ${name}`;
    const issueBody = `## Contact Information
**Name:** ${name}
**Email:** ${email}

## Tattoo Idea
${message}

---
*Submitted via website contact form*`;

    const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Tattoo-Studio-Contact-Form',
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: ['inquiry', 'contact-form'],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('GitHub API Error:', errorData);
      res.setHeader('Content-Type', 'application/json');
      return res.status(response.status).json({ 
        error: 'Failed to create GitHub issue',
        details: errorData,
      });
    }

    const issueData = await response.json();

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      success: true,
      issueNumber: issueData.number,
      issueUrl: issueData.html_url,
      message: 'Your inquiry has been submitted successfully!',
    });

  } catch (error) {
    console.error('Error creating GitHub issue:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
    });
  }
}
