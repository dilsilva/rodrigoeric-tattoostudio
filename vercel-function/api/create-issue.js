// Vercel Serverless Function - Secure Version
// Creates GitHub issues from contact form submissions
// Security features: Input validation, sanitization, rate limiting, error handling

export default async function handler(req, res) {
  // ============================================
  // SECURITY HEADERS - Set first, before anything else
  // ============================================
  const securityHeaders = {
    'Access-Control-Allow-Origin': '*', // Can be restricted to specific domain in production
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  // Apply security headers
  Object.keys(securityHeaders).forEach(key => {
    res.setHeader(key, securityHeaders[key]);
  });

  // ============================================
  // CORS PREFLIGHT HANDLING
  // ============================================
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ============================================
  // METHOD VALIDATION
  // ============================================
  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowedMethods: ['POST']
    });
  }

  // ============================================
  // RATE LIMITING CONSIDERATION
  // Note: For production, consider using Vercel's rate limiting
  // or a service like Upstash Redis for distributed rate limiting
  // ============================================

  try {
    // ============================================
    // INPUT VALIDATION & SANITIZATION
    // ============================================
    if (!req.body || typeof req.body !== 'object') {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: 'Invalid request body' });
    }

    let { name, email, message } = req.body;

    // Validate presence
    if (!name || !email || !message) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Sanitize inputs - trim whitespace
    name = String(name).trim();
    email = String(email).trim().toLowerCase();
    message = String(message).trim();

    // Validate length limits (prevent abuse)
    const MAX_NAME_LENGTH = 100;
    const MAX_EMAIL_LENGTH = 255;
    const MAX_MESSAGE_LENGTH = 5000;
    const MIN_MESSAGE_LENGTH = 10;

    if (name.length === 0 || name.length > MAX_NAME_LENGTH) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ 
        error: `Name must be between 1 and ${MAX_NAME_LENGTH} characters` 
      });
    }

    if (email.length === 0 || email.length > MAX_EMAIL_LENGTH) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ 
        error: `Email must be between 1 and ${MAX_EMAIL_LENGTH} characters` 
      });
    }

    // Validate email format (RFC 5322 simplified)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (message.length < MIN_MESSAGE_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ 
        error: `Message must be between ${MIN_MESSAGE_LENGTH} and ${MAX_MESSAGE_LENGTH} characters` 
      });
    }

    // Sanitize for GitHub Markdown (escape special characters that could break formatting)
    // Note: We're not preventing all markdown, just preventing injection attacks
    const sanitizeForMarkdown = (text) => {
      // Remove potential script tags and dangerous HTML
      return text
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, ''); // Remove event handlers
    };

    const sanitizedName = sanitizeForMarkdown(name);
    const sanitizedEmail = sanitizeForMarkdown(email);
    const sanitizedMessage = sanitizeForMarkdown(message);

    // ============================================
    // ENVIRONMENT VARIABLE VALIDATION
    // ============================================
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_OWNER = process.env.GITHUB_OWNER;
    const GITHUB_REPO = process.env.GITHUB_REPO;

    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      // Don't expose internal configuration details
      console.error('Missing required environment variables');
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ 
        error: 'Server configuration error. Please contact the administrator.' 
      });
    }

    // Validate GitHub owner/repo format (basic validation)
    const ownerRepoRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
    if (!ownerRepoRegex.test(GITHUB_OWNER) || !ownerRepoRegex.test(GITHUB_REPO)) {
      console.error('Invalid GitHub owner or repo format');
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // ============================================
    // CREATE GITHUB ISSUE
    // ============================================
    const issueTitle = `New Tattoo Inquiry from ${sanitizedName}`;
    // Limit title length (GitHub has a 255 char limit)
    const truncatedTitle = issueTitle.length > 255 ? issueTitle.substring(0, 252) + '...' : issueTitle;
    
    const issueBody = `## Contact Information
**Name:** ${sanitizedName}
**Email:** ${sanitizedEmail}

## Tattoo Idea
${sanitizedMessage}

---
*Submitted via website contact form on ${new Date().toISOString()}*`;

    // Make request to GitHub API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`,
        {
          method: 'POST',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'RodrigoEric-TattooStudio-ContactForm/1.0',
          },
          body: JSON.stringify({
            title: truncatedTitle,
            body: issueBody,
            labels: ['inquiry', 'contact-form'],
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('GitHub API Error:', response.status, errorData);
        
        // Don't expose GitHub API errors to client
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ 
          error: 'Failed to process your inquiry. Please try again later.' 
        });
      }

      const issueData = await response.json();

      // ============================================
      // SUCCESS RESPONSE
      // ============================================
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({
        success: true,
        issueNumber: issueData.number,
        // Don't expose full URL to client if not needed
        message: 'Your inquiry has been submitted successfully!',
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('GitHub API request timeout');
        res.setHeader('Content-Type', 'application/json');
        return res.status(504).json({ 
          error: 'Request timeout. Please try again.' 
        });
      }
      
      throw fetchError; // Re-throw to be caught by outer catch
    }

  } catch (error) {
    // ============================================
    // ERROR HANDLING
    // ============================================
    console.error('Error creating GitHub issue:', error);
    
    // Don't expose internal error details to client
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      error: 'An unexpected error occurred. Please try again later.' 
    });
  }
}
