module.exports = async (req, res) => {
  try {
    const { audioBase64 } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: "missing_audioBase64" });
    }

    const audioBuffer = Buffer.from(audioBase64, "base64");

    const endpoint =
      `https://${process.env.AZURE_SPEECH_REGION}.stt.speech.microsoft.com` +
      `/speech/recognition/conversation/cognitiveservices/v1?language=en-US`;

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY,
        "Content-Type": "audio/wav"
      },
      body: audioBuffer
    });

    const raw = await resp.text();

    console.log("AZURE STT STATUS:", resp.status);
    console.log("AZURE STT RAW:", raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(resp.status || 500).json({
        error: "azure_non_json_response",
        raw
      });
    }

    return res.status(resp.status).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "azure_stt_error",
      details: String(err)
    });
  }
};