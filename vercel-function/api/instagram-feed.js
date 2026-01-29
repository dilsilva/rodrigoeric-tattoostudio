// Vercel Serverless Function – Instagram feed for portfolio
// Requires Instagram Business or Creator account linked to a Facebook Page.
// Env: INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_USER_ID (your IG Business/Creator user ID from Graph API)

const FIELDS = 'id,media_url,thumbnail_url,caption,permalink,media_type';
const LIMIT = 24;
const API_VERSION = 'v21.0';

const securityHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  'X-Content-Type-Options': 'nosniff',
};

function setHeaders(res, headers) {
  Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
}

export default async function handler(req, res) {
  setHeaders(res, securityHeaders);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!token || !userId) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      ok: false,
      feed: [],
      message: 'Instagram feed not configured. Set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID in Vercel.',
    });
  }

  try {
    const url = `https://graph.facebook.com/${API_VERSION}/${userId}/media?fields=${FIELDS}&limit=${LIMIT}&access_token=${encodeURIComponent(token)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.error('Instagram API error:', response.status, errText);
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({
        ok: false,
        feed: [],
        message: 'Unable to load Instagram feed.',
      });
    }

    const data = await response.json();
    const items = (data.data || [])
      .filter((m) => m.media_url && (m.media_type === 'IMAGE' || m.media_type === 'CAROUSEL_ALBUM' || (m.media_type === 'VIDEO' && m.thumbnail_url)))
      .slice(0, LIMIT)
      .map((m) => ({
        id: m.id,
        url: m.media_url,
        thumb: m.thumbnail_url || m.media_url,
        caption: (m.caption || '').slice(0, 120),
        link: m.permalink || `https://www.instagram.com/p/${m.id}/`,
      }));

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ ok: true, feed: items });
  } catch (err) {
    if (err.name === 'AbortError') {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ ok: false, feed: [], message: 'Request timeout.' });
    }
    console.error('Instagram feed error:', err);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ ok: false, feed: [], message: 'Unable to load feed.' });
  }
}
