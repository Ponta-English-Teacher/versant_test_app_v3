// CommonJS proxy to Google Cloud Speech-to-Text
module.exports = async (req, res) => {
  try {
    const url = `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GOOGLE_STT_KEY}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await resp.json();
    res.status(resp.ok ? 200 : resp.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "stt_proxy_error", details: String(err) });
  }
};

