import React, { useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  Unlock,
  Download,
  Loader2,
  Trash2,
  FileText,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  UploadCloud,
} from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

export default function UnlockPDF() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [showHowTo, setShowHowTo] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const fileInputRef = useRef(null);

  const resetAll = useCallback(() => {
    setError("");
    setSuccess(false);
    setPassword("");
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setDownloadUrl(null);
  }, [downloadUrl]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    setFile(f);
    resetAll();
  };

  const removeFile = () => {
    setFile(null);
    resetAll();
  };

  const handleUnlock = async () => {
    if (!file) return setError("Please upload a PDF file.");
    if (!password) return setError("Password is required.");

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/unlock-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to unlock PDF");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setSuccess(true);

      const a = document.createElement("a");
      a.href = url;
      a.download = `unlocked_${file.name}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError(err.message || "Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      <Helmet>
        <title>Unlock PDF Online | Remove Password Security</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 pt-24 space-y-8">
        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
            Unlock <span className="text-rose-600">PDF</span>
          </h1>
          <p className="text-slate-500 text-lg">
            Remove password protection and restrictions instantly
          </p>
        </div>

        {/* HOW TO - Clean Accordion */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
          <button
            onClick={() => setShowHowTo(!showHowTo)}
            className="w-full flex justify-between items-center p-5 font-bold text-slate-700"
          >
            <span className="flex items-center gap-2">
              <HelpCircle size={20} className="text-rose-500" /> How to use
            </span>
            <ChevronDown className={`${showHowTo ? "rotate-180" : ""} transition duration-300 text-slate-400`} />
          </button>
          {showHowTo && (
            <div className="p-6 border-t bg-slate-50/50 text-sm text-slate-600 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex gap-3">
                <span className="bg-rose-100 text-rose-600 w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0">1</span>
                <p>Upload your password-protected PDF file.</p>
              </div>
              <div className="flex gap-3">
                <span className="bg-rose-100 text-rose-600 w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0">2</span>
                <p>Enter the correct password of the file.</p>
              </div>
              <div className="flex gap-3">
                <span className="bg-rose-100 text-rose-600 w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0">3</span>
                <p>Click unlock and download your file.</p>
              </div>
            </div>
          )}
        </div>

        {/* MAIN INTERFACE */}
        {!file ? (
          <div
            onClick={() => fileInputRef.current.click()}
            className="group cursor-pointer border-2 border-dashed border-slate-300 p-16 text-center bg-white rounded-[2.5rem] transition-all hover:border-rose-400 hover:bg-rose-50/30"
          >
            <div className="bg-rose-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <UploadCloud className="text-rose-500" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Click or Drag PDF here</h3>
            <p className="text-slate-400 mt-2">Securely remove passwords from your PDF</p>

            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
            {/* FILE INFO CARD */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="bg-slate-50 p-6 rounded-2xl mb-4">
                <FileText size={64} className="text-rose-500" />
              </div>
              <p className="font-bold text-slate-800 break-all px-4">{file.name}</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
                {(file.size / 1024).toFixed(1)} KB
              </p>

              <button
                onClick={removeFile}
                className="mt-6 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-rose-600 transition-colors"
              >
                <Trash2 size={16} /> Remove File
              </button>
            </div>

            {/* ACTION CARD */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-lg space-y-6">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password Required</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter PDF password"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-medium"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100">
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm font-bold flex items-center gap-2 border border-green-100">
                  <CheckCircle2 size={18} /> File unlocked successfully!
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleUnlock}
                  disabled={loading || !password}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-slate-200"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <Unlock size={20} /> Unlock PDF
                    </>
                  )}
                </button>

                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download={`unlocked_${file.name}`}
                    className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all"
                  >
                    <Download size={20} /> Download PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RELATED TOOLS SECTION */}
        <div className="pt-10">
          <RelatedTools categoryId="pdf" />
        </div>
      </div>
    </div>
  );
}