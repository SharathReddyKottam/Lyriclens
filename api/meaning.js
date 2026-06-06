// Vercel Serverless Function: /api/meaning
// Explains the meaning of a single lyric line using the Anthropic API.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { line, song, artist } = req.body || {};
  if (!line) {
    return res.status(400).json({ error: 'Missing lyric line' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server not configured. Add ANTHROPIC_API_KEY in Vercel.' });
  }

  const prompt = `You are a lyric analyst. Explain the meaning of this single lyric line from the song "${song || 'unknown'}"${artist ? ` by ${artist}` : ''}.

Lyric line: "${line}"

Respond in this exact JSON format (no markdown, no preamble):
{
  "translation": "English translation if the line is non-English, otherwise omit this key",
  "meaning": "2-3 sentence emotional and poetic explanation of what this line means"
}`;

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
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await r.json();
    const raw = data.content?.[0]?.text || '{}';
    let result = {};
    try {
      result = JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch {
      result = { meaning: raw };
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to interpret line' });
  }
}
