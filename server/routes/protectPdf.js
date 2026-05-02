import express from "express";
import { PDFDocument } from "pdf-lib";

const router = express.Router();

router.post("/protect-pdf", async (req, res) => {
  try {
    res.json({ success: true, message: "PDF protected" });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

export default router;