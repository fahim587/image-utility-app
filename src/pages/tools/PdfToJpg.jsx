import React, { useState } from "react";
import {
  FilePlus,
  Trash2,
  Loader2,
  Download,
  ChevronDown,
  RefreshCcw,
} from "lucide-react";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";
import RelatedTools from '../../components/RelatedTools';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const PdfToJpg = () => {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState("high");
  const [showGuide, setShowGuide] = useState(false);

  // generate preview
  const generatePreviews = async (file) => {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    const previews = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const scale =
        quality === "high" ? 2 : quality === "medium" ? 1.5 : 1;

      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;

      previews.push({
        page: i,
        img: canvas.toDataURL("image/jpeg", 0.9),
      });
    }

    return previews;
  };

  const handleFile = async (selectedFile) => {
    if (!selectedFile || selectedFile.type !== "application/pdf")
      return alert("Upload a valid PDF");

    setLoading(true);

    setFile(selectedFile);

    const previews = await generatePreviews(selectedFile);

    setPages(previews);

    setLoading(false);
  };

  const resetAll = () => {
    setFile(null);
    setPages([]);
  };

  const downloadImage = (img, index) => {
    const link = document.createElement("a");
    link.href = img;
    link.download = `page-${index + 1}.jpg`;
    link.click();
  };

  const downloadAll = () => {
    pages.forEach((p, i) => {
      setTimeout(() => downloadImage(p.img, i), i * 300);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">

        {/* SEO Title */}
        <h1 className="text-4xl font-bold text-rose-500 text-center mb-10">
          Convert PDF to JPG Online 
        </h1>
        <h2 className="text-xl text-gray-600 text-center mb-10">
          Free PDF Image Converter
        </h2>

        {/* Upload */}
        {!file && (
          <label className="border-2 border-dashed border-red-200 p-16 rounded-2xl bg-white text-center block mb-10 cursor-pointer hover:border-red-500">
            <FilePlus className="mx-auto mb-4 text-red-500" size={48} />
            <p className="font-bold text-xl">Upload PDF</p>

            <input
              type="file"
              hidden
              accept="application/pdf"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </label>
        )}

        {/* Options */}
        {file && (
          <div className="bg-white p-6 rounded-xl shadow mb-6 flex flex-wrap gap-4 items-center justify-between">

            <div>
              <p className="font-semibold">{file.name}</p>
              <p className="text-sm text-gray-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="high">High Quality</option>
              <option value="medium">Medium Quality</option>
              <option value="low">Low Quality</option>
            </select>

            <button
              onClick={resetAll}
              className="flex items-center gap-2 text-red-500"
            >
              <Trash2 size={18} /> Remove
            </button>
          </div>
        )}

        {/* Preview */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="animate-spin mx-auto" size={40} />
          </div>
        )}

        {pages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {pages.map((p, i) => (
              <div key={i} className="bg-white p-2 rounded-xl shadow">

                <img
                  src={p.img}
                  alt={`Page ${p.page}`}
                  className="w-full h-48 object-contain"
                />

                <button
                  onClick={() => downloadImage(p.img, i)}
                  className="w-full mt-2 bg-gray-100 hover:bg-gray-200 p-2 rounded flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download
                </button>

              </div>
            ))}
          </div>
        )}

        {/* Download All */}
        {pages.length > 0 && (
          <button
            onClick={downloadAll}
            className="w-full py-4 bg-red-600 text-white rounded-xl font-semibold mb-6"
          >
            Download All JPG Images
          </button>
        )}

        {/* Guide */}
        <div>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full bg-white border p-4 rounded-xl flex justify-between"
          >
            How to use this tool
            <ChevronDown
              className={`transition-transform ${
                showGuide ? "rotate-180" : ""
              }`}
            />
          </button>

          {showGuide && (
            <div className="bg-white border-t p-5 text-sm text-gray-600">

              <p>1. Upload your PDF file.</p>
              <p>2. Wait while pages are converted to JPG.</p>
              <p>3. Download single images or all pages.</p>
              <p>4. Choose quality for better output.</p>

            </div>
          )}
        </div>
     <RelatedTools categoryId='pdf' />
      </div>
    </div>
  );
};

export default PdfToJpg;