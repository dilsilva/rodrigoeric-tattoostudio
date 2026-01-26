// Serverless function to create GitHub Issues
// This keeps the token secure on the server-side
// Works with Netlify, Vercel, or any serverless platform

exports.handler = async (event, context) => {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse the request body
        const { name, email, message } = JSON.parse(event.body);

        // Validate required fields
        if (!name || !email || !message) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Get GitHub configuration from environment variables
        // These are set in your hosting platform's settings
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_OWNER = process.env.GITHUB_OWNER;
        const GITHUB_REPO = process.env.GITHUB_REPO;

        if (!GITHUB_TOKEN) {
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ error: 'GitHub token not configured' })
            };
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
            return {
                statusCode: response.status,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ 
                    error: 'Failed to create GitHub issue',
                    details: errorData
                })
            };
        }

        const issueData = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                success: true,
                issueNumber: issueData.number,
                issueUrl: issueData.html_url,
                message: 'Your inquiry has been submitted successfully!'
            })
        };

    } catch (error) {
        console.error('Error creating GitHub issue:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};
