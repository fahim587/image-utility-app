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

import aiRoutes from "./routes/ai.js";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payment.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= SECURITY ================= */
app.disable("x-powered-by");

app.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Embedder-Policy");
  res.removeHeader("Cross-Origin-Opener-Policy");
  next();
});

/* ================= CORS ================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://googiz.com",
  "https://image-utility-app-1.onrender.com",
  "https://image-utility-rmi8cjg9n-fahims-projects-cbd7e4c2.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
  })
);

/* ================= BODY ================= */
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

/* ================= STATIC ================= */
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use("/uploads", express.static(UPLOADS_DIR));

/* ================= DB ================= */
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "googiz",
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

/* ================= ROUTES ================= */
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.json({ success: true, message: "GOOGIZ Server Running 🚀" });
});

/* ================= FILE URL ================= */
app.post("/api/upload-url", async (req, res) => {
  try {
    const { url, isGoogleDrive, fileId } = req.body;

    if (!url && !fileId) {
      return res.status(400).json({ error: "URL required" });
    }

    let targetUrl = url;

    if (isGoogleDrive && fileId) {
      targetUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${process.env.GOOGLE_DRIVE_API_KEY}`;
    }

    const response = await axios.get(targetUrl, {
      responseType: "arraybuffer",
      timeout: 15000,
    });

    const base64 = Buffer.from(response.data).toString("base64");

    res.json({
      url: `data:${response.headers["content-type"]};base64,${base64}`,
    });
  } catch (err) {
    res.status(500).json({ error: "File load failed" });
  }
});

/* ================= PROTECT PDF ================= */
app.post("/api/protect-pdf", upload.single("file"), (req, res) => {
  const { password } = req.body;
  const file = req.file;

  if (!file || !password) {
    if (file) fs.unlinkSync(file.path);
    return res.status(400).json({ error: "File & password required" });
  }

  const input = path.resolve(file.path);
  const output = path.join(UPLOADS_DIR, `protected-${Date.now()}.pdf`);

  const cmd = `qpdf --encrypt "${password}" "${password}" 256 -- "${input}" "${output}"`;

  exec(cmd, (err, stdout, stderr) => {
    fs.unlinkSync(input);

    if (err) {
      return res.status(500).json({ error: "PDF protect failed" });
    }

    res.download(output, () => {
      if (fs.existsSync(output)) fs.unlinkSync(output);
    });
  });
});

/* ================= UNLOCK PDF ================= */
app.post("/api/unlock-pdf", upload.single("file"), (req, res) => {
  const { password } = req.body;
  const file = req.file;

  if (!file || !password) {
    if (file) fs.unlinkSync(file.path);
    return res.status(400).json({ error: "File & password required" });
  }

  const input = path.resolve(file.path);
  const output = path.join(UPLOADS_DIR, `unlocked-${Date.now()}.pdf`);

  const cmd = `qpdf --password="${password}" --decrypt "${input}" "${output}"`;

  exec(cmd, (err, stdout, stderr) => {
    fs.unlinkSync(input);

    if (err) {
      return res.status(400).json({ error: "Wrong password or failed" });
    }

    res.download(output, () => {
      if (fs.existsSync(output)) fs.unlinkSync(output);
    });
  });
});

/* ================= SIGN PDF ================= */
app.post("/api/sign-pdf", upload.single("file"), async (req, res) => {
  try {
    const { signature } = req.body;
    const file = req.file;

    if (!file || !signature) {
      if (file) fs.unlinkSync(file.path);
      return res.status(400).json({ error: "Missing data" });
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const base64 = signature.split(",")[1];
    const img = await pdfDoc.embedPng(Buffer.from(base64, "base64"));

    const page = pdfDoc.getPages()[0];

    page.drawImage(img, {
      x: 50,
      y: 50,
      width: 150,
      height: 50,
    });

    const outputBytes = await pdfDoc.save();
    const outPath = path.join(UPLOADS_DIR, `signed-${Date.now()}.pdf`);

    fs.writeFileSync(outPath, outputBytes);
    fs.unlinkSync(file.path);

    res.download(outPath, () => {
      if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    });
  } catch (err) {
    res.status(500).json({ error: "Sign failed" });
  }
});

/* ================= AI ================= */
app.post("/api/explain-image", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Image required" });

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
        },
      }
    );

    fs.unlinkSync(file.path);

    res.json({
      success: true,
      explanation: response.data.choices[0].message.content,
    });
  } catch (err) {
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