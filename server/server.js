import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import { exec } from "child_process";
import { PDFDocument } from "pdf-lib";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import aiRoutes from "./routes/ai.js";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payment.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= SECURITY ================= */
app.disable("x-powered-by");

/* ================= LOGGING ================= */
app.use(morgan("dev"));

/* ================= RATE LIMIT ================= */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

/* ================= CORS (FULLY UPDATED FOR LIVE) ================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://googiz.com",
  "https://image-utility-app-1.onrender.com",
  "https://image-utility-app-ochre.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // ডেভলপমেন্টের সুবিধার্থে আপাতত এলাউ রাখা হলো
      }
    },
    credentials: true,
  })
);

/* ================= IMPORTANT BODY PARSERS ================= */
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

/* ================= STATIC FILES ================= */
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use("/uploads", express.static(UPLOADS_DIR));

/* ================= DB (FIXED CASE SENSITIVITY) ================= */
mongoose
  .connect(process.env.MONGO_URI, { 
    dbName: "GOOGIZ" // এখানে 'GOOGIZ' বড় হাতের অক্ষরে দেওয়া হয়েছে ফিক্স হিসেবে
  })
  .then(() => console.log("✅ MongoDB Connected to GOOGIZ"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

/* ================= ROUTES ================= */
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS_DIR),
  filename: (_, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        Math.random().toString(36).slice(2) +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

/* ================= HEALTH CHECK ================= */
app.get("/", (_, res) => {
  res.json({ success: true, message: "GOOGIZ Server Running 🚀" });
});

/* ================= SAFE DELETE ================= */
const safeDelete = (filePath) => {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch {}
};

/* ================= FILE URL ================= */
app.post("/api/upload-url", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL required" });

    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 15000,
    });

    const base64 = Buffer.from(response.data).toString("base64");
    res.json({
      url: `data:${response.headers["content-type"]};base64,${base64}`,
    });
  } catch {
    res.status(500).json({ error: "File load failed" });
  }
});

/* ================= AI IMAGE ================= */
app.post("/api/explain-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Image required" });

    const base64 = fs.readFileSync(req.file.path).toString("base64");

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Explain this image" },
              {
                type: "image_url",
                image_url: { url: `data:image/png;base64,${base64}` },
              },
            ],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    safeDelete(req.file.path);
    res.json({
      success: true,
      explanation: response.data.choices?.[0]?.message?.content || "",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
});

/* ================= GLOBAL ERROR ================= */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);
  res.status(500).json({ error: "Something went wrong" });
});

/* ================= START ================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});