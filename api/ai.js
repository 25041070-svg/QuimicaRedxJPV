// Simple serverless proxy to Hugging Face Inference API
// Deploy this file in the project root under /api (Vercel/Netlify serverless function)
// Set environment variables in Vercel: HF_API_KEY and optionally HF_MODEL

const fetch = require('node-fetch');

module.exports = async (req, res) => {
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

  const HF_KEY = process.env.HF_API_KEY;
  const HF_MODEL = process.env.HF_MODEL || 'gpt2';
  const HF_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

  if (!HF_KEY) {
    console.error('Missing HF_API_KEY in environment');
    res.status(500).json({ error: 'Missing Hugging Face API key', details: 'Set HF_API_KEY in Vercel environment variables.' });
    return;
  }

  let body;
  try {
    const incoming = req.body || {};
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
        Authorization: `Bearer ${HF_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const text = await r.text();
    if (!r.ok) {
      console.error(`Hugging Face returned ${r.status}: ${text}`);
      res.status(r.status).send(text);
      return;
    }

    try {
      const data = JSON.parse(text);
      res.status(200).json(data);
    } catch (err) {
      res.status(200).send(text);
    }
  } catch (err) {
    console.error('AI proxy fetch failed', err);
    res.status(502).json({ error: 'Error connecting to Hugging Face', details: err.message });
  }
};
