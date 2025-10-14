// CommonJS proxy to Google Cloud Text-to-Speech
module.exports = async (req, res) => {
  try {
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_KEY}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await resp.json();
    res.status(resp.ok ? 200 : resp.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "tts_proxy_error", details: String(err) });
  }
};

