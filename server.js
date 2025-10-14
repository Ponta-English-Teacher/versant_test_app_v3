// server.js — local Express backend for Versant Test Preparation app

import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "12mb" }));
app.use(express.static(__dirname)); // serves index.html + assets/

// ---- OpenAI proxy ----
app.post("/api/openai", async (req, res) => {
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });
    const data = await r.json();
    res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    console.error("OpenAI error:", e);
    res.status(500).json({ error: "openai_proxy_error", details: String(e) });
  }
});

// ---- Google TTS proxy ----
app.post("/api/tts", async (req, res) => {
  try {
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_KEY}`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await r.json();
    res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    console.error("TTS error:", e);
    res.status(500).json({ error: "tts_proxy_error", details: String(e) });
  }
});

// ---- Google STT proxy ----
app.post("/api/stt", async (req, res) => {
  try {
    const url = `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GOOGLE_STT_KEY}`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await r.json();
    res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    console.error("STT error:", e);
    res.status(500).json({ error: "stt_proxy_error", details: String(e) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Local server running → http://localhost:${port}`));

