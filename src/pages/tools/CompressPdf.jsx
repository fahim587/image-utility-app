import React, { useState } from "react";
import {
  FilePlus,
  Trash2,
  Loader2,
  FileDown,
  ChevronDown
} from "lucide-react";

import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";
import RelatedTools from '../../components/RelatedTools';


// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const CompressPdf = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState("recommended");

  // Generate thumbnail
  const generatePreview = async (file) => {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2 }); // bigger thumbnail
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: ctx, viewport }).promise;
    return canvas.toDataURL();
  };

  // Handle file upload
  const handleFile = async (selectedFile) => {
    if (!selectedFile || selectedFile.type !== "application/pdf")
      return alert("Please upload a PDF file.");
    setFile(selectedFile);
    const img = await generatePreview(selectedFile);
    setPreview(img);
    setCompressedUrl(null);
  };

  // Compress PDF
  const compressPdf = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);

      // Set compression options based on level
      const options = {
        useObjectStreams: compressionLevel !== "less",
        compress: compressionLevel !== "less"
      };

      const compressedBytes = await pdfDoc.save(options);

      const blob = new Blob([compressedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setCompressedUrl(url);
    } catch (err) {
      alert("Compression failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">
          Compress <span className="text-red-600">PDF</span>
        </h1>

        {/* Upload */}
        {!file && (
          <label className="border-2 border-dashed p-16 rounded-xl bg-white text-center cursor-pointer block mb-10">
            <FilePlus className="mx-auto mb-4 text-red-500" size={40} />
            <p className="font-semibold text-lg">Upload PDF file</p>
            <input
              type="file"
              hidden
              accept="application/pdf"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </label>
        )}

        {/* File Preview */}
        {file && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4 items-center">
                {preview ? (
                  <img
                    src={preview}
                    className="w-36 h-48 object-contain rounded-xl cursor-pointer shadow-md border"
                    alt="preview"
                  />
                ) : (
                  <div className="w-36 h-48 bg-gray-200 animate-pulse rounded-xl" />
                )}
                <div>
                  <p className="font-semibold">{file.name}</p>
                  <p className="text-gray-400 text-sm">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  setCompressedUrl(null);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 />
              </button>
            </div>

            {/* Compression level */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">Compression Level</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-xl"
                value={compressionLevel}
                onChange={(e) => setCompressionLevel(e.target.value)}
              >
                <option value="extreme">Extreme Compression - Less quality, high compression</option>
                <option value="recommended">Recommended Compression - Good quality, good compression</option>
                <option value="less">Less Compression - High quality, less compression</option>
              </select>
            </div>

            {/* Compress Button */}
            <button
              onClick={compressPdf}
              disabled={loading}
              className="w-full py-4 bg-red-600 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Compress PDF"}
            </button>

            {/* Download */}
            {compressedUrl && (
              <a
                href={compressedUrl}
                download={`compressed_${file.name}`}
                className="mt-4 block text-center text-green-600 font-semibold hover:underline"
              >
                <FileDown className="inline mr-2" /> Download Compressed PDF
              </a>
            )}
          </div>
        )}

        {/* How to use dropdown */}
        <div className="mt-6">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between bg-white border p-4 rounded-xl font-semibold"
          >
            <span>How to use this tool</span>
            <ChevronDown
              className={`transition-transform ${showGuide ? "rotate-180" : ""}`}
            />
          </button>
          {showGuide && (
            <div className="bg-white border border-t-0 p-5 text-sm text-gray-600 leading-relaxed">
              <p>1. Click <b>Upload PDF file</b> and select your PDF.</p>
              <p>2. Wait for thumbnail preview to load.</p>
              <p>3. Select a <b>Compression Level</b> (Extreme / Recommended / Less).</p>
              <p>4. Click <b>Compress PDF</b> to reduce file size.</p>
              <p>5. Download the compressed PDF using the link.</p>
            </div>
          )}
        </div>
      </div>
      <RelatedTools categoryId='pdf' />

    </div>
  );
};

export default CompressPdf;