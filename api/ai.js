// Serverless proxy to Groq AI API (free, fast, reliable)
// Deploy this file in the project root under /api (Vercel/Netlify serverless function)
// Set environment variables in Vercel: GROQ_API_KEY

module.exports = async (req, res) => {
  console.log('api/ai invoked', { method: req.method });
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) {
    console.error('Missing GROQ_API_KEY in environment');
    res.status(500).json({ error: 'Missing Groq API key', details: 'Set GROQ_API_KEY in Vercel environment variables.' });
    return;
  }

  let userPrompt = '';
  try {
    const incoming = req.body || {};
    userPrompt = incoming.prompt || incoming.inputs || JSON.stringify(incoming);
  } catch (e) {
    userPrompt = '';
  }

  if (!userPrompt) {
    res.status(400).json({ error: 'Missing prompt' });
    return;
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32k',
        messages: [{ role: 'user', content: userPrompt }],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Groq API error ${response.status}: ${errText}`);
      res.status(response.status).json({ error: `Groq error: ${response.status}`, details: errText });
      return;
    }

    const data = await response.json();
    // Return in a format compatible with HF Inference (array with generated_text)
    const generatedText = data.choices?.[0]?.message?.content || '';
    res.status(200).json([{ generated_text: generatedText }]);

  } catch (err) {
    console.error('AI proxy fetch failed:', err.message);
    res.status(502).json({ error: 'Error connecting to Groq', details: err.message });
  }
};
