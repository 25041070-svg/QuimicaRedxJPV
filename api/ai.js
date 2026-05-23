// Simple serverless proxy to Hugging Face Inference API
// Deploy this file in the project root under /api (Vercel/Netlify serverless function)
// Set environment variables in Vercel: HF_API_KEY and optionally HF_MODEL

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const HF_MODEL = process.env.HF_MODEL || 'gpt2';
  const HF_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

  let body;
  try {
    const incoming = req.body || {};
    // Accept either { prompt: '...' } or full inference payloads
    if (incoming.prompt) {
      body = { inputs: incoming.prompt, parameters: incoming.parameters || {} };
    } else if (incoming.inputs) {
      body = { inputs: incoming.inputs, parameters: incoming.parameters || {} };
    } else {
      body = incoming;
    }
  } catch (e) {
    body = {};
  }

  try {
    const r = await fetch(HF_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const text = await r.text();
    // try parse JSON, otherwise return raw text
    try {
      const data = JSON.parse(text);
      res.status(r.status).json(data);
    } catch (err) {
      res.status(r.status).send(text);
    }
  } catch (err) {
    console.error('AI proxy error', err);
    res.status(502).json({ error: 'Error connecting to Hugging Face', details: err.message });
  }
};
