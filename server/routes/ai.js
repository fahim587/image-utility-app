import express from "express";
import axios from "axios";
import dotenv from "dotenv";

import { verifyToken } from "../middleware/authMiddleware.js";
import Usage from "../models/Usage.js";

dotenv.config();

const router = express.Router();

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/* ================= SAFE HEADERS ================= */
const COMMON_HEADERS = {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
  "X-Title": "GOOGIZ AI Tools"
};

/* ================= KEY CHECK ================= */
if (!process.env.OPENROUTER_API_KEY) {
  console.error("❌ OPENROUTER_API_KEY missing");
}

/* ================= UTIL SAFE RESPONSE ================= */
const getAIResult = (response) => {
  return (
    response?.data?.choices?.[0]?.message?.content ||
    "No response from AI"
  );
};

/* ================= IMAGE EXPLAIN ================= */
router.post("/explain-image", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image || typeof image !== "string") {
      return res.status(400).json({
        success: false,
        error: "Valid image required"
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
              { type: "text", text: "Describe this image clearly." },
              {
                type: "image_url",
                image_url: { url: image }
              }
            ]
          }
        ],
        max_tokens: 1000
      },
      {
        headers: COMMON_HEADERS,
        timeout: 30000
      }
    );

    res.json({
      success: true,
      explanation: getAIResult(response)
    });

  } catch (error) {
    console.error("Image Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: "Image analysis failed"
    });
  }
});

/* ================= CONTENT GENERATOR ================= */
router.post("/generate-content", verifyToken, async (req, res) => {
  try {
    const { topic, language } = req.body;
    const userId = req.userId;

    if (!topic || typeof topic !== "string") {
      return res.status(400).json({
        success: false,
        error: "Valid topic required"
      });
    }

    /* ================= DAILY USAGE CHECK ================= */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usageCount = await Usage.countDocuments({
      userId,
      tool: "ai-content-writer",
      date: { $gte: today }
    });

    const FREE_LIMIT = 3;

    if (usageCount >= FREE_LIMIT) {
      return res.status(403).json({
        success: false,
        message: "Daily free limit reached"
      });
    }

    await Usage.create({
      userId,
      tool: "ai-content-writer",
      date: new Date()
    });

    /* ================= AI REQUEST ================= */
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert SEO content writer."
          },
          {
            role: "user",
            content: `Write a high-quality SEO article about: "${topic}" in ${language || "English"}`
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      },
      {
        headers: COMMON_HEADERS,
        timeout: 30000
      }
    );

    res.json({
      success: true,
      content: getAIResult(response)
    });

  } catch (error) {
    console.error("AI Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: "Content generation failed"
    });
  }
});

export default router;