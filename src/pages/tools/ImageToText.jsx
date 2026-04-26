import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Tesseract from "tesseract.js";
import { Upload, FileText, Copy, Trash2, Loader2, Languages, Download } from 'lucide-react';
import RelatedTools from "../../components/RelatedTools";

export default function ImageToText() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState("eng");

  const handleExtract = async () => {
    if (!imageFile) return;
    setLoading(true);
    setProgress(0);

    try {
      const { data: { text } } = await Tesseract.recognize(imageFile, language, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(parseInt(m.progress * 100));
          }
        },
      });
      setText(text);
    } catch {
      alert("Error extracting text!");
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    alert("✅ Text copied to clipboard!");
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'extracted-text.txt';
    link.click();
  };

  const handleFileChange = (file) => {
    setImage(URL.createObjectURL(file));
    setImageFile(file);
    setText(""); // Clear previous text
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <Helmet>
        <title>Image to Text (OCR) | GOOGIZ</title>
      </Helmet>

      <h1 className="text-4xl font-black text-center mb-10 flex items-center justify-center gap-2">
        <FileText className="text-blue-600" /> Image to Text (OCR)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Panel - Upload */}
        <div className="space-y-6">
          <div
            onDrop={(e) => { e.preventDefault(); handleFileChange(e.dataTransfer.files[0]); }}
            onDragOver={(e) => e.preventDefault()}
            className="border-4 border-dashed rounded-[2rem] p-10 text-center bg-slate-50 relative group cursor-pointer hover:bg-slate-100 transition"
          >
            {image ? (
              <img src={image} alt="Upload" className="max-h-64 mx-auto rounded-xl shadow-lg" />
            ) : (
              <>
                <Upload size={40} className="mx-auto mb-2 text-blue-300" />
                <p className="font-bold text-slate-600">Drag & Drop or Click to Upload</p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
          </div>

          {/* Language Selection */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border">
            <Languages className="text-blue-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="flex-1 bg-transparent font-bold outline-none"
            >
              <option value="eng">English</option>
              <option value="ben">Bengali (বাংলা)</option>
              <option value="hin">Hindi</option>
            </select>
          </div>

          <button
            onClick={handleExtract}
            disabled={!image || loading}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 disabled:bg-slate-300 transition shadow-xl"
          >
            {loading ? `Extracting... ${progress}%` : "Extract Text Now"}
          </button>
        </div>

        {/* Right Panel - Result */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-6 min-h-[400px] flex flex-col relative">

            {loading && (
              <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-[2.5rem]">
                <Loader2 className="animate-spin text-blue-500 mb-2" size={40} />
                <p className="text-white font-bold">Scanning Image...</p>
              </div>
            )}

            <textarea
              className="flex-1 w-full bg-white/5 text-white p-5 rounded-2xl font-medium outline-none resize-none border border-white/10"
              placeholder="Extracted text will appear here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {text && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={copyText}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Copy size={18} /> Copy Text
                </button>
                <button
                  onClick={() => { setImage(null); setImageFile(null); setText(""); }}
                  className="p-3 bg-rose-500 text-white rounded-xl"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={downloadText}
                  className="p-3 bg-green-500 text-white rounded-xl flex items-center justify-center gap-2"
                >
                  <Download size={18} /> Download
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-20"><RelatedTools categoryId="image" /></div>
    </div>
  );
}