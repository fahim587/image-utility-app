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

// routes
import aiRoutes from "./routes/ai.js";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payment.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= SECURITY ================= */
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
      "https://image-utility-app-docker.onrender.com",
      "https://image-utility-rmi8cjg9n-fahims-projects-cbd7e4c2.vercel.app" // এই লিঙ্কটি অবশ্যই যোগ করতে হবে
    ],
    credentials: true,
  })
);

/* ================= BODY ================= */
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/* ================= STATIC ================= */
app.use("/uploads", express.static("uploads"));

/* ================= DB ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

/* ================= ROUTES ================= */
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

/* ================= UPLOAD FIXED ================= */
const UPLOADS_DIR = "uploads";

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".pdf"); // ✅ FIXED
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

  if (file.mimetype !== "application/pdf") {
    fs.unlinkSync(file.path);
    return res.status(400).json({ error: "Only PDF allowed" });
  }

  const input = path.resolve(file.path);
  const output = path.resolve(`uploads/protected-${Date.now()}.pdf`);

  const cmd = `qpdf --encrypt "${password}" "${password}" 256 -- "${input}" "${output}"`;

  exec(cmd, (err, stdout, stderr) => {
    fs.unlinkSync(input);

    if (err) {
      console.error("QPDF ERROR:", stderr);
      return res.status(500).json({ error: "PDF protect failed", details: stderr });
    }

    res.download(output, () => {
      if (fs.existsSync(output)) fs.unlinkSync(output);
    });
  });
});


/* ================= UNIVERSAL OFFICE CONVERTER ================= */
app.post("/api/convert-document", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const inputPath = req.file.path;
    const targetFormat = req.body.targetFormat; // e.g., 'docx', 'pdf', 'xlsx', 'pptx'
    const outputFilename = `${path.parse(req.file.originalname).name}.${targetFormat}`;

    // LibreOffice Headless Command
    const command = `libreoffice --headless --convert-to ${targetFormat} --outdir "${UPLOADS_DIR}" "${inputPath}"`;

    exec(command, (error) => {
      if (error) {
        console.error("Conversion Error:", error);
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        return res.status(500).json({ error: "Conversion failed" });
      }

      // LibreOffice output file path
      const generatedFilePath = path.join(UPLOADS_DIR, path.parse(req.file.filename).name + "." + targetFormat);

      res.download(generatedFilePath, outputFilename, (err) => {
        // ফাইল ডাউনলোড হয়ে গেলে ক্লিনআপ
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(generatedFilePath)) fs.unlinkSync(generatedFilePath);
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
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
  const output = path.resolve(`uploads/unlocked-${Date.now()}.pdf`);

  const cmd = `qpdf --password="${password}" --decrypt "${input}" "${output}"`;

  exec(cmd, (err, stdout, stderr) => {
    fs.unlinkSync(input);

    if (err) {
      console.error("UNLOCK ERROR:", stderr);
      return res.status(400).json({ error: "Wrong password or failed", details: stderr });
    }

    res.download(output, () => {
      if (fs.existsSync(output)) fs.unlinkSync(output);
    });
  });
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

    const base64 = signature.split(",")[1];
    const img = await pdfDoc.embedPng(Buffer.from(base64, "base64"));

    const page = pdfDoc.getPages()[0];

    page.drawImage(img, {
      x: 50,
      y: 50,
      width: 150,
      height: 50,
    });

    const output = await pdfDoc.save();

    const outPath = path.resolve(`uploads/signed-${Date.now()}.pdf`);

    fs.writeFileSync(outPath, output);
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
  const file = req.file;

  if (!file) return res.status(400).json({ error: "Image required" });

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

/* ================= START ================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

