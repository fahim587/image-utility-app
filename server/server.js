import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import { PDFDocument } from "pdf-lib";

// routes
import aiRoutes from "./routes/ai.js";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payment.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= COEP + SECURITY FIX ================= */
app.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Embedder-Policy");
  res.removeHeader("Cross-Origin-Opener-Policy");
  next();
});

/* ================= CORS ================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://googiz.com",
      "https://image-utility-app-0qf0.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* ================= RAW WEBHOOK ================= */
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

/* ================= BODY PARSER ================= */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/* ================= STATIC ================= */
app.use("/uploads", express.static("uploads"));

/* ================= MONGODB ================= */
mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

/* ================= ROUTES ================= */
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

/* ================= UPLOAD SETUP ================= */

const UPLOADS_DIR = "uploads";

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const upload = multer({
  dest: UPLOADS_DIR,
  limits: { fileSize: 25 * 1024 * 1024 },
});

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GOOGIZ Server Running 🚀",
  });
});

/* ================= FILE UPLOAD URL ================= */

app.post("/api/upload-url", async (req, res) => {
  const { url, isGoogleDrive, fileId } = req.body;

  if (!url && !fileId) {
    return res.status(400).json({ error: "URL required" });
  }

  try {
    let targetUrl = url;

    if (isGoogleDrive || fileId) {
      targetUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${process.env.GOOGLE_DRIVE_API_KEY}`;
    }

    const response = await axios.get(targetUrl, {
      responseType: "arraybuffer",
      timeout: 15000,
    });

    const contentType = response.headers["content-type"];
    const base64 = Buffer.from(response.data).toString("base64");

    res.json({
      url: `data:${contentType};base64,${base64}`,
      contentType,
    });
  } catch (err) {
    console.error("Upload Error:", err.message);
    res.status(500).json({ error: "File load failed" });
  }
});

/* ================= PDF PROTECT (UPDATED) ================= */

app.post("/api/protect-pdf", upload.single("file"), async (req, res) => {
  const { password } = req.body;
  const file = req.file;

  if (!file || !password) {
    if (file) fs.unlinkSync(file.path);
    return res.status(400).json({ error: "File & password required" });
  }

  try {
    const pdfBytes = fs.readFileSync(file.path);

    const pdfDoc = await PDFDocument.load(pdfBytes);

    const protectedPdf = await pdfDoc.save({
      userPassword: password,
      ownerPassword: password,
    });

    const outputPath = path.join(
      UPLOADS_DIR,
      `protected-${Date.now()}.pdf`
    );

    fs.writeFileSync(outputPath, protectedPdf);

    fs.unlinkSync(file.path);

    res.download(outputPath, () => {
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error("PDF Protect Error:", err);

    if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);

    res.status(500).json({ error: "PDF protect failed" });
  }
});

/* ================= SIGN PDF ================= */

app.post("/api/sign-pdf", upload.single("file"), async (req, res) => {
  const { signature } = req.body;
  const file = req.file;

  if (!file || !signature) {
    if (file) fs.unlinkSync(file.path);
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    const pdfBytes = fs.readFileSync(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const base64 = signature.split(",")[1] || signature;
    const img = await pdfDoc.embedPng(Buffer.from(base64, "base64"));

    const page = pdfDoc.getPages()[0];

    page.drawImage(img, {
      x: 50,
      y: 50,
      width: 150,
      height: 50,
    });

    const output = await pdfDoc.save();

    const outPath = path.join(UPLOADS_DIR, `signed-${Date.now()}.pdf`);

    fs.writeFileSync(outPath, output);
    fs.unlinkSync(file.path);

    res.download(outPath, () => {
      if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    });
  } catch (err) {
    console.error("Sign Error:", err);

    if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);

    res.status(500).json({ error: "Sign failed" });
  }
});

/* ================= AI IMAGE EXPLAIN ================= */

app.post("/api/explain-image", upload.single("image"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "Image required" });
  }

  try {
    const base64 = fs.readFileSync(file.path).toString("base64");

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
                image_url: {
                  url: `data:image/png;base64,${base64}`,
                },
              },
            ],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    fs.unlinkSync(file.path);

    res.json({
      success: true,
      explanation: response.data?.choices?.[0]?.message?.content || "",
    });
  } catch (err) {
    console.error("AI Error:", err.message);

    if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);

    res.status(500).json({ error: "AI failed" });
  }
});

/* ================= START SERVER ================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});