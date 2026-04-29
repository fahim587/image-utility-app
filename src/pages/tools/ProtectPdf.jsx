import React, { useState, useCallback } from "react";
import { UploadCloud, Lock, Eye, EyeOff, Download, Trash2, ChevronDown, ChevronUp, CheckCircle2, AlertCircle } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";
import RelatedTools from '../../components/RelatedTools';

// PDF.js Worker Configuration
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const ProtectPdf = () => {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState("");

  // GENERATE PDF THUMBNAIL
  const generateThumbnail = async (file) => {
    try {
      const reader = new FileReader();
      reader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const loadingTask = pdfjsLib.getDocument(typedArray);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.5 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        setThumbnail(canvas.toDataURL());
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("Preview error", err);
    }
  };

  // HANDLE FILE UPLOAD
  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }

    setError("");
    setFile(selected);
    setDownloadUrl(null); // Reset previous download link if new file selected
    generateThumbnail(selected);
  };

  // ENCRYPT PDF ACTION
  const protectPdf = async () => {
    if (!file) return setError("Upload a PDF file first.");
    if (password.length < 4) return setError("Password must be at least 4 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    setLoading(true);
    setError("");

    try {
      // API URL logic - ensured correct backticks usage
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      
      const res = await fetch(`${apiUrl}/api/protect-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Server failed to protect PDF. Make sure server is updated to use pdf-lib.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Automatic download trigger
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `protected_${file.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error("Protection Error:", err);
      setError(err.message || "Something went wrong. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // RESET FUNCTION
  const resetAll = useCallback(() => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setThumbnail(null);
    setPassword("");
    setConfirm("");
    setDownloadUrl(null);
    setError("");
  }, [downloadUrl]);

  return (
    <div className="max-w-6xl mx-auto pt-32 pb-16 px-4">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Protect <span className="text-rose-600">PDF</span> Online
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          Secure your PDF documents with professional encryption. Fast, private, and 100% free.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-10">
        {/* LEFT SIDE - PREVIEW */}
        <div className="rounded-[32px] p-8 flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-200 min-h-[450px] transition-all relative overflow-hidden">
          {downloadUrl ? (
            <div className="flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={64} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 uppercase">File Secured!</h3>
              <p className="text-slate-500 mt-2 font-medium">Your protected PDF is ready to download.</p>
              <button onClick={resetAll} className="mt-8 bg-rose-50 text-rose-600 px-6 py-2 rounded-full font-bold hover:bg-rose-100 transition-colors">
                Protect Another File
              </button>
            </div>
          ) : thumbnail ? (
            <div className="relative group animate-in zoom-in duration-300">
              <img src={thumbnail} className="max-h-[420px] rounded-xl shadow-2xl border-[12px] border-white ring-1 ring-gray-200" alt="PDF Preview" />
              <button onClick={resetAll} className="absolute -top-4 -right-4 bg-rose-500 text-white p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                <Trash2 size={20} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer group p-10">
              <div className="bg-rose-50 p-8 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud size={56} className="text-rose-400 group-hover:text-rose-600 transition-colors" />
              </div>
              <input type="file" className="hidden" accept="application/pdf" onChange={handleUpload} />
              <span className="text-2xl font-bold text-gray-800">Select PDF File</span>
              <span className="text-gray-400 mt-3 text-sm font-medium italic">Privacy: Your files stay safe and encrypted</span>
            </label>
          )}
        </div>

        {/* RIGHT SIDE - SETTINGS */}
        <div className="space-y-6 bg-white p-8 rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-3 text-xl font-bold text-gray-800 border-b border-gray-50 pb-5">
            <div className="bg-rose-50 p-2.5 rounded-xl">
              <Lock size={22} className="text-rose-600" />
            </div>
            Encryption Settings
          </div>

          <div className="space-y-5">
            <div className="relative">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 4 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-rose-500 focus:bg-white transition-all outline-none font-bold text-gray-700"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 bottom-4 text-gray-400 hover:text-rose-500">
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            <div className="relative">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Confirm Password</label>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-rose-500 focus:bg-white transition-all outline-none font-bold text-gray-700"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 bottom-4 text-gray-400 hover:text-rose-500">
                {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-4 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-right-2">
              <AlertCircle size={20} /> {error}
            </div>
          )}

          <div className="flex flex-col gap-4 pt-4">
            <button
              onClick={protectPdf}
              disabled={loading || downloadUrl || !file}
              className="w-full bg-rose-600 text-white py-4.5 rounded-2xl font-black text-lg hover:bg-rose-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center shadow-lg shadow-rose-200"
            >
              {loading ? (
                <>
                  <LoaderIcon className="animate-spin mr-3" /> ENCRYPTING...
                </>
              ) : "LOCK PDF NOW"}
            </button>
            
            {downloadUrl ? (
              <a
                href={downloadUrl}
                download={`protected_${file?.name || 'document.pdf'}`}
                className="flex items-center justify-center gap-3 bg-green-600 text-white py-5 rounded-2xl w-full font-black shadow-xl hover:bg-green-700 transition-all animate-bounce mt-2"
              >
                <Download size={24} /> DOWNLOAD PROTECTED PDF
              </a>
            ) : (
               <button onClick={resetAll} className="flex items-center justify-center gap-2 text-gray-400 font-bold py-2 hover:text-rose-500 transition-colors">
                <Trash2 size={16} /> Clear Settings
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Guide */}
      <section className="mt-24 max-w-4xl mx-auto">
        <div className="border border-gray-100 rounded-[32px] overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
          <button onClick={() => setIsGuideOpen(!isGuideOpen)} className="w-full flex items-center justify-between p-8 text-left group">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span className="bg-rose-50 text-rose-600 w-8 h-8 rounded-lg flex items-center justify-center text-base">?</span>
              Quick Guide: How to Lock your PDF
            </h2>
            {isGuideOpen ? <ChevronUp className="text-rose-500" /> : <ChevronDown className="text-gray-400 group-hover:text-rose-500" />}
          </button>
          {isGuideOpen && (
            <div className="p-8 pt-0 border-t border-gray-50 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center mt-6">
                {[
                  { title: "Select", desc: "Choose PDF from device" },
                  { title: "Set Keys", desc: "Type your password" },
                  { title: "Encrypt", desc: "Click Lock button" },
                  { title: "Get File", desc: "Download secured PDF" }
                ].map((step, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center mx-auto font-black shadow-lg shadow-rose-100">{idx + 1}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                      <p className="text-gray-500 text-xs font-medium">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="mt-24">
        <RelatedTools categoryId='pdf' />
      </div>
    </div>
  );
};

// Loader Icon
const LoaderIcon = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default ProtectPdf;