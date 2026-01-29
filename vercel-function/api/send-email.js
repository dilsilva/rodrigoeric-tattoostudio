// Vercel Serverless Function - Contact form → email via Resend
// Sends form submissions to your inbox. No GitHub Issues required.
// Env: RESEND_API_KEY, CONTACT_EMAIL (recipient), FROM_EMAIL (e.g. "Studio <onboarding@resend.dev>")

const RESEND_API = 'https://api.resend.com/emails';

const securityHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

function setHeaders(res, headers) {
  Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
}

function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(body);
}

function sanitize(text) {
  return String(text)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

export default async function handler(req, res) {
  setHeaders(res, securityHeaders);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed', allowedMethods: ['POST'] });

  try {
    if (!req.body || typeof req.body !== 'object') return json(res, 400, { error: 'Invalid request body' });
    let { name, email, message } = req.body;
    if (!name || !email || !message) return json(res, 400, { error: 'Missing required fields' });

    name = String(name).trim();
    email = String(email).trim().toLowerCase();
    message = String(message).trim();

    const MAX_NAME = 100, MAX_EMAIL = 255, MAX_MSG = 5000, MIN_MSG = 10;
    if (!name.length || name.length > MAX_NAME) return json(res, 400, { error: `Name must be 1–${MAX_NAME} characters` });
    if (!email.length || email.length > MAX_EMAIL) return json(res, 400, { error: `Email must be 1–${MAX_EMAIL} characters` });
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) return json(res, 400, { error: 'Invalid email format' });
    if (message.length < MIN_MSG || message.length > MAX_MSG) return json(res, 400, { error: `Message must be ${MIN_MSG}–${MAX_MSG} characters` });

    const safeName = sanitize(name);
    const safeEmail = sanitize(email);
    const safeMessage = sanitize(message);

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || 'Rodrigo Eric Studio <onboarding@resend.dev>';

    if (!apiKey || !toEmail) {
      console.error('Missing RESEND_API_KEY or CONTACT_EMAIL');
      return json(res, 500, { error: 'Server configuration error. Please contact the administrator.' });
    }

    const subject = `Tattoo inquiry from ${safeName}`;
    const html = `
      <h2>Contact form – Rodrigo Eric Studio</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Message:</strong></p>
      <pre style="white-space: pre-wrap; font-family: inherit;">${safeMessage}</pre>
      <p><small>Sent from website contact form at ${new Date().toISOString()}</small></p>
    `.trim();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: safeEmail,
        subject,
        html,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      // Log full Resend response for debugging in Vercel → Logs
      console.error('Resend API error:', response.status, JSON.stringify(data));
      return json(res, 500, { error: 'Failed to send your message. Please try again later.' });
    }

    return json(res, 200, { success: true, message: 'Your inquiry has been sent. We\'ll get back to you soon!' });
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('Resend request timeout');
      return json(res, 504, { error: 'Request timeout. Please try again.' });
    }
    console.error('Send email error:', err);
    return json(res, 500, { error: 'An unexpected error occurred. Please try again later.' });
  }
}
