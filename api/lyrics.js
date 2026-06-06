// Vercel Serverless Function: /api/lyrics
// Fetches song lyrics line-by-line using the Anthropic API.
// Your API key stays secret on the server — never exposed to the browser.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, artist } = req.body || {};
  if (!title) {
    return res.status(400).json({ error: 'Missing song title' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server not configured. Add ANTHROPIC_API_KEY in Vercel.' });
  }

  const prompt = `You are a lyrics database. Return ONLY the full lyrics of the song "${title}"${artist ? ` by ${artist}` : ''}, line by line.

Format as a JSON array of strings, one string per lyric line. Include all verses, chorus, bridge. Skip empty lines. Return ONLY a valid JSON array, no preamble, no markdown.

Example: ["Line one", "Line two"]

If you don't know the song, return an empty array [].`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await r.json();
    const raw = data.content?.[0]?.text || '[]';
    let lines = [];
    try {
      lines = JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch {
      lines = [];
    }

    return res.status(200).json({ lines });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch lyrics' });
  }
}
