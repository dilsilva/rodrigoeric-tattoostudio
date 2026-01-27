// Vercel Serverless Function - With specific origin CORS (more secure)
// Use this version if you want to restrict CORS to only your GitHub Pages domain

// Allowed origins - add your domains here
const ALLOWED_ORIGINS = [
    'https://dilsilva.github.io',
    'https://dilsilva.github.io/rodrigoeric-tattoostudio', // If you have a subpath
    'http://localhost:8000', // For local testing
];

// Helper function to extract origin from referer
function extractOrigin(referer) {
    if (!referer) return null;
    try {
        const url = new URL(referer);
        return url.origin;
    } catch {
        return null;
    }
}

// Helper function to set CORS headers with origin checking
function setCORSHeaders(res, origin) {
    // Normalize origin - extract from referer if needed
    let normalizedOrigin = origin;
    if (origin && !origin.startsWith('http')) {
        normalizedOrigin = extractOrigin(origin);
    }
    
    // Check if origin is allowed
    if (normalizedOrigin && ALLOWED_ORIGINS.includes(normalizedOrigin)) {
        res.setHeader('Access-Control-Allow-Origin', normalizedOrigin);
    } else {
        // Use wildcard for CORS - works for all origins
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
}

export default async function handler(req, res) {
    // Get the origin from the request - prefer origin header, fallback to referer
    const origin = req.headers.origin || extractOrigin(req.headers.referer);
    
    // Set CORS headers FIRST - before any other logic
    setCORSHeaders(res, origin);

    // Handle CORS preflight - MUST be first, before any other checks
    if (req.method === 'OPTIONS') {
        // Return 200 with CORS headers already set
        return res.status(200).json({ message: 'OK' });
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
