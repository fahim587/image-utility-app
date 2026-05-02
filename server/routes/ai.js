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
  "X-Title": "SiteNexa AI Tools"
};

/* ================= KEY CHECK ================= */
if (!process.env.OPENROUTER_API_KEY) {
  console.error("❌ OPENROUTER_API_KEY missing");
}

/* ================= AI IMAGE EXPLAIN ================= */
router.post("/explain-image", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        error: "Image required"
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
                text: "Describe this image clearly."
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
      {
        headers: COMMON_HEADERS,
        timeout: 30000
      }
    );

    const result =
      response.data?.choices?.[0]?.message?.content || "";

    res.json({
      success: true,
      explanation: result
    });

  } catch (error) {
    console.error("Image Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: "Image analysis failed"
    });
  }
});

/* ================= AI CONTENT WRITER ================= */
router.post("/generate-content", verifyToken, async (req, res) => {
  try {
    const { topic, language } = req.body;
    const userId = req.userId;

    if (!topic) {
      return res.status(400).json({
        success: false,
        error: "Topic required"
      });
    }

    /* ================= SAFE USAGE CHECK ================= */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usageCount = await Usage.countDocuments({
      userId,
      tool: "ai-content-writer",
      date: { $gte: today }
    });

    if (usageCount >= 3) {
      return res.status(403).json({
        success: false,
        message: "Free limit reached"
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
            content: "You are a professional SEO writer."
          },
          {
            role: "user",
            content: `Write SEO article about: ${topic} in ${language || "English"}`
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

    const result =
      response.data?.choices?.[0]?.message?.content || "";

    res.json({
      success: true,
      content: result
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



