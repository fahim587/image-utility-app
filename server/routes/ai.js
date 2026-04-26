// routes/ai.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

import { verifyToken } from "../middleware/authMiddleware.js";
import Usage from "../models/Usage.js";

dotenv.config();

const router = express.Router();

// -------- CONFIG --------
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const COMMON_HEADERS = {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "http://localhost:5173",
  "X-Title": "SiteNexa AI Tools" // আপনার প্রোজেক্ট নাম অনুযায়ী
};

// -------- API KEY CHECK --------
if (!process.env.OPENROUTER_API_KEY) {
  console.error("❌ OPENROUTER_API_KEY missing in .env");
}

// ============================================================
// 1️⃣ AI IMAGE EXPLAINER
// ============================================================
router.post("/explain-image", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        error: "Image URL or Base64 required"
      });
    }

    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image in detail. Objects, colors, environment, text, and atmosphere."
              },
              {
                type: "image_url",
                image_url: { url: image }
              }
            ]
          }
        ],
        max_tokens: 1000
      },
      { headers: COMMON_HEADERS }
    );

    const result = response.data.choices?.[0]?.message?.content;
    res.json({ success: true, explanation: result });
  } catch (error) {
    console.error("Image Explainer Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: "Image analysis failed" });
  }
});

// ============================================================
// 2️⃣ AI CONTENT WRITER (ফিক্সড এন্ডপয়েন্ট: /generate-content)
// ============================================================
router.post("/generate-content", verifyToken, async (req, res) => {
  try {
    const { topic, language } = req.body;
    const userId = req.userId;

    if (!topic) {
      return res.status(400).json({ success: false, error: "Topic is required" });
    }

    // -------- FREE USER USAGE LIMIT --------
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usageCount = await Usage.countDocuments({
      userId,
      tool: "ai-content-writer",
      date: { $gte: today }
    });

    // আপনার লজিক অনুযায়ী: ৩ বার ফ্রি লিমিট
    if (usageCount >= 3) {
      return res.status(403).json({ 
        success: false, 
        message: "Free limit reached. Upgrade to PRO for unlimited access." 
      });
    }

    // Save usage
    await Usage.create({ userId, tool: "ai-content-writer", date: new Date() });

    // -------- AI API CALL --------
    const selectedLanguage = language || "English";

    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional SEO content writer who writes long, structured, and high-quality blog articles."
          },
          {
            role: "user",
            content: `Write a detailed SEO optimized article about: "${topic}" in ${selectedLanguage}. 
            Minimum 800-1200 words, including Engaging H1, Intro, H2/H3 headings, Bullet points, FAQ, and Conclusion.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      },
      { headers: COMMON_HEADERS }
    );

    const result = response.data.choices?.[0]?.message?.content;
    res.json({ success: true, content: result });
  } catch (error) {
    console.error("Content Writer Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: "Content generation failed" });
  }
});

export default router;