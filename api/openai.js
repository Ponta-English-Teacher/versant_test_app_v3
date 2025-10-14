// CommonJS proxy to OpenAI Chat Completions
module.exports = async (req, res) => {
  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await resp.json();
    res.status(resp.ok ? 200 : resp.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "openai_proxy_error", details: String(err) });
  }
};

