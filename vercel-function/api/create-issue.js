// Vercel Serverless Function - With specific origin CORS (more secure)
// Use this version if you want to restrict CORS to only your GitHub Pages domain

// Allowed origins - add your domains here
const ALLOWED_ORIGINS = [
    'https://dilsilva.github.io',
    'https://dilsilva.github.io/rodrigoeric-tattoostudio', // If you have a subpath
    'http://localhost:8000', // For local testing
];

// Helper function to set CORS headers with origin checking
function setCORSHeaders(res, origin) {
    // Check if origin is allowed
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        // Fallback to wildcard if origin not in list (or no origin header)
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}

export default async function handler(req, res) {
    // Get the origin from the request
    const origin = req.headers.origin || req.headers.referer;
    
    // Set CORS headers for all responses
    setCORSHeaders(res, origin);

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        res.setHeader('Content-Type', 'application/json');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Parse the request body
        const { name, email, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Get GitHub configuration from environment variables
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_OWNER = process.env.GITHUB_OWNER;
        const GITHUB_REPO = process.env.GITHUB_REPO;

        // Validate environment variables
        if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
            res.setHeader('Content-Type', 'application/json');
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
            res.setHeader('Content-Type', 'application/json');
            return res.status(response.status).json({ 
                error: 'Failed to create GitHub issue',
                details: errorData
            });
        }

        const issueData = await response.json();

        // Set content type for success response
        res.setHeader('Content-Type', 'application/json');

        return res.status(200).json({
            success: true,
            issueNumber: issueData.number,
            issueUrl: issueData.html_url,
            message: 'Your inquiry has been submitted successfully!'
        });

    } catch (error) {
        console.error('Error creating GitHub issue:', error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message
        });
    }
}
