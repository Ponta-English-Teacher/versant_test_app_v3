// Azure Speech-to-Text proxy

module.exports = async (req, res) => {
  try {
    const { audioBase64 } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: "No audio data" });
    }

    const audioBuffer = Buffer.from(audioBase64, "base64");

    const endpoint = `https://${process.env.AZURE_SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`;

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY,
        "Content-Type": "audio/wav"
      },
      body: audioBuffer
    });

    const text = await resp.text();

    try {
      const data = JSON.parse(text);
      res.status(200).json(data);
    } catch {
      res.status(500).json({ error: "Invalid Azure response", raw: text });
    }

  } catch (err) {
    res.status(500).json({ error: "azure_stt_error", details: String(err) });
  }
};