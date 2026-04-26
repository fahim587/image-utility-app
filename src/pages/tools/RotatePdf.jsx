import React, { useState } from "react";
import { FilePlus, Trash2, Loader2, RotateCw, RotateCcw, FileDown, ChevronDown, RefreshCcw } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";
import RelatedTools from '../../components/RelatedTools';

// Setup PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const RotatePdf = () => {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rotatedUrl, setRotatedUrl] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  // Generate page previews
  const generatePreviews = async (file) => {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const previews = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.6 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;
      previews.push({ index: i - 1, preview: canvas.toDataURL(), rotation: 0 });
    }
    return previews;
  };

  // Handle file upload
  const handleFile = async (selectedFile) => {
    if (!selectedFile || selectedFile.type !== "application/pdf")
      return alert("Please upload a valid PDF.");
    setFile(selectedFile);
    const previews = await generatePreviews(selectedFile);
    setPages(previews);
    setRotatedUrl(null);
  };

  // Rotate a single page
  const rotatePage = (index, direction) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === index
          ? { ...p, rotation: direction === "right" ? (p.rotation + 90) % 360 : (p.rotation + 270) % 360 }
          : p
      )
    );
  };

  // Rotate all pages
  const rotateAll = (direction) => {
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        rotation: direction === "right" ? (p.rotation + 90) % 360 : (p.rotation + 270) % 360,
      }))
    );
  };

  // Reset all rotations
  const resetAll = () => {
    setPages((prev) => prev.map((p) => ({ ...p, rotation: 0 })));
  };

  // Apply rotation and generate PDF
  const applyRotation = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      pages.forEach((p) => {
        const page = pdfDoc.getPage(p.index);
        page.setRotation((p.rotation * Math.PI) / 180);
      });
      const rotatedBytes = await pdfDoc.save();
      const blob = new Blob([rotatedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setRotatedUrl(url);
    } catch (err) {
      alert("Rotation failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* SEO-Friendly Title */}
        <h1 className="text-4xl font-bold text-center  text-rose-500 mb-10">
          Rotate PDF Online  
        </h1>
        <h2 className="text-xl text-gray-600 text-center mb-10">
          Rotate, Reset & Download Pages
        </h2>

        {/* Upload */}
        {!file && (
          <label className="border-2 border-dashed p-16 rounded-xl bg-white text-center cursor-pointer block mb-10 hover:border-red-500 transition-all shadow-sm">
            <FilePlus className="mx-auto mb-4 text-red-500" size={48} />
            <p className="font-bold text-xl text-slate-700">Upload PDF file</p>
            <input
              type="file"
              hidden
              accept="application/pdf"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </label>
        )}

        {/* Page Actions */}
        {pages.length > 0 && (
          <div className="flex gap-4 mb-6 justify-center flex-wrap">
            <button
              onClick={() => rotateAll("left")}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            >
              <RotateCcw size={16} /> Rotate All Left
            </button>
            <button
              onClick={() => rotateAll("right")}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            >
              <RotateCw size={16} /> Rotate All Right
            </button>
            <button
              onClick={resetAll}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            >
              <RefreshCcw size={16} /> Reset All
            </button>
          </div>
        )}

        {/* Page Previews */}
        {pages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {pages.map((p, i) => (
              <div key={i} className="bg-white p-2 rounded-xl shadow relative">
                <img
                  src={p.preview}
                  alt={`Page ${i + 1}`}
                  className="w-full h-40 object-contain rounded"
                  style={{ transform: `rotate(${p.rotation}deg)` }}
                />
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => rotatePage(i, "left")}
                    className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <button
                    onClick={() => rotatePage(i, "right")}
                    className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    <RotateCw size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Apply Rotation */}
        {pages.length > 0 && (
          <button
            onClick={applyRotation}
            disabled={loading}
            className="w-full py-4 bg-red-600 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 mb-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Apply Rotation & Download"}
          </button>
        )}

        {/* Download Link */}
        {rotatedUrl && (
          <a
            href={rotatedUrl}
            download={`rotated_${file.name}`}
            className="block text-center text-green-600 font-semibold hover:underline mb-6"
          >
            <FileDown size={20} /> Download Rotated PDF
          </a>
        )}

        {/* How to use */}
        <div className="mt-6">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between bg-white border p-4 rounded-xl font-semibold"
          >
            <span>How to use this tool</span>
            <ChevronDown className={`transition-transform ${showGuide ? "rotate-180" : ""}`} />
          </button>
          {showGuide && (
            <div className="bg-white border border-t-0 p-5 text-sm text-gray-600 leading-relaxed">
              <p>1. Upload a PDF file using the “Upload PDF file” button.</p>
              <p>2. Preview pages and rotate individual pages left/right.</p>
              <p>3. Use “Rotate All Left/Right” to rotate every page at once.</p>
              <p>4. Click “Reset All” to reset all pages to 0° rotation.</p>
              <p>5. Click “Apply Rotation & Download” to get your rotated PDF.</p>
            </div>
          )}
        </div>
         <RelatedTools categoryId='pdf' />
      </div>
    </div>
  );
};

export default RotatePdf;