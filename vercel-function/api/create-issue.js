// Simple Vercel Function with CORS - Use this to test
// This version uses wildcard CORS to ensure it works

export default async function handler(req, res) {
    // Set CORS headers FIRST - before anything else
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');

    // Handle CORS preflight - MUST be first
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Parse the request body
        const { name, email, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Get GitHub configuration from environment variables
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_OWNER = process.env.GITHUB_OWNER;
        const GITHUB_REPO = process.env.GITHUB_REPO;

        // Validate environment variables
        if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
            return res.status(500).json({ 
                error: 'Server configuration error. Please configure GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO in Vercel environment variables.' 
            });
        }

        // Create the issue title and body
        const issueTitle = `New Tattoo Inquiry from ${name}`;
        const issueBody = `## Contact Information
**Name:** ${name}
**Email:** ${email}

## Tattoo Idea
${message}

---
*Submitted via website contact form*`;

        // Create the GitHub issue
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'User-Agent': 'Tattoo-Studio-Contact-Form'
            },
            body: JSON.stringify({
                title: issueTitle,
                body: issueBody,
                labels: ['inquiry', 'contact-form']
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('GitHub API Error:', errorData);
            return res.status(response.status).json({ 
                error: 'Failed to create GitHub issue',
                details: errorData
            });
        }

        const issueData = await response.json();

        return res.status(200).json({
            success: true,
            issueNumber: issueData.number,
            issueUrl: issueData.html_url,
            message: 'Your inquiry has been submitted successfully!'
        });

    } catch (error) {
        console.error('Error creating GitHub issue:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message
        });
    }
}
