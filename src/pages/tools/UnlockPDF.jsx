import React, { useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { 
  Unlock, Download, Loader2, Trash2, FileText, 
  ShieldOff, Eye, EyeOff, AlertCircle, CheckCircle2, 
  ChevronDown, HelpCircle, UploadCloud 
} from "lucide-react";
import RelatedTools from '../../components/RelatedTools';

export default function UnlockPDF() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [unlockedBlobUrl, setUnlockedBlobUrl] = useState(null);
  const fileInputRef = useRef(null);

  // HANDLE FILE CHANGE
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
      resetStates();
    } else if (f) {
      setError("Please upload a valid PDF file.");
    }
  };

  // RESET FUNCTION
  const resetStates = useCallback(() => {
    setError("");
    setSuccess(false);
    setPassword("");
    if (unlockedBlobUrl) URL.revokeObjectURL(unlockedBlobUrl);
    setUnlockedBlobUrl(null);
  }, [unlockedBlobUrl]);

  const removeFile = () => {
    setFile(null);
    resetStates();
  };

  // UNLOCK ACTION
  const removePassword = async () => {
    if (!file || !password) return;
    setIsProcessing(true);
    setError("");

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      
      const response = await fetch(`${apiUrl}/api/unlock-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Incorrect password or server error.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      setUnlockedBlobUrl(url);
      setSuccess(true);

      // Automatic Download Trigger
      const a = document.createElement("a");
      a.href = url;
      a.download = `unlocked_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    } catch (err) {
      console.error("Unlock Error:", err);
      setError(err.message || "Connection failed. Please check your internet or server.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-20">
      <Helmet>
        <title>Unlock PDF Online | Remove Password Security - GOOGIZ</title>
        <meta name="description" content="Remove password protection from your PDF files instantly and for free with GOOGIZ." />
      </Helmet>

      <div className="max-w-[1000px] mx-auto p-4 md:p-8 space-y-8">
        {/* Header Section */}
        <header className="text-center space-y-4 pt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-widest shadow-sm border border-rose-100">
             <ShieldOff size={14} /> 100% Secure & Private
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            Unlock <span className="text-rose-600">PDF</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Instantly remove password and security restrictions from your encrypted PDF documents.
          </p>
        </header>

        {/* How to Use Accordion */}
        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm transition-all hover:shadow-md">
          <button onClick={() => setShowHowTo(!showHowTo)} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 font-bold text-slate-700">
              <HelpCircle className="text-rose-500" size={22} /> 
              <span className="text-lg">How to use this tool?</span>
            </div>
            <ChevronDown className={`text-slate-400 transition-transform duration-300 ${showHowTo ? 'rotate-180' : ''}`} />
          </button>
          {showHowTo && (
            <div className="p-8 pt-0 text-slate-500 border-t border-slate-50 animate-in fade-in slide-in-from-top-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {[
                  { step: "01", title: "Upload", desc: "Select your password-protected PDF." },
                  { step: "02", title: "Password", desc: "Enter the correct file password." },
                  { step: "03", title: "Unlock", desc: "Download your decrypted file instantly." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl relative">
                    <span className="absolute -top-3 -left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-md">{item.step}</span>
                    <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
                    <p className="text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Interface */}
        {!file ? (
          <div 
            onClick={() => fileInputRef.current.click()} 
            className="group border-4 border-dashed border-slate-200 bg-white p-20 md:p-32 text-center rounded-[4rem] cursor-pointer hover:border-rose-400 hover:bg-rose-50/10 transition-all duration-500"
          >
            <div className="w-24 h-24 bg-rose-50 text-rose-500 flex items-center justify-center mx-auto rounded-[2rem] mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <UploadCloud size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-800">Drop PDF or Click to Select</h2>
            <p className="text-slate-400 mt-4 font-medium uppercase text-xs tracking-widest">Maximum file size: 50MB</p>
            <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileChange} hidden />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start animate-in zoom-in-95 duration-500">
            {/* File Info Card */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="w-full py-16 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                   <ShieldOff size={40} className="text-rose-100 -rotate-12" />
                </div>
                <FileText size={80} className={success ? "text-green-500" : "text-rose-500"} />
                <p className="font-black text-slate-800 mt-6 px-4 text-center break-all">{file.name}</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-slate-400 shadow-sm border border-slate-100 uppercase tracking-tighter">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <button 
                onClick={removeFile} 
                className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase hover:text-rose-500 transition-colors py-2"
              >
                <Trash2 size={16} /> Replace Document
              </button>
            </div>

            {/* Action Card */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 space-y-8">
              <div className="space-y-5">
                <div className="flex items-center gap-2 ml-1">
                   <Unlock size={18} className="text-rose-500" />
                   <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Document Password</label>
                </div>
                
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter PDF password here..."
                    className={`w-full bg-slate-50 border-2 ${error ? 'border-rose-200' : 'border-slate-100'} p-5 rounded-2xl font-bold outline-none focus:border-rose-500 focus:bg-white transition-all text-slate-700`}
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-rose-500 bg-rose-50 p-4 rounded-xl text-xs font-bold animate-shake">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}
                
                {success && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-xl text-xs font-bold">
                    <CheckCircle2 size={16} /> File successfully decrypted!
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <button 
                  onClick={removePassword}
                  disabled={isProcessing || !password}
                  className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl hover:bg-rose-600 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                  <div className="flex justify-center items-center gap-3">
                    {isProcessing ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : success ? (
                      <Download size={24} className="group-hover:animate-bounce" />
                    ) : (
                      <Unlock size={24} />
                    )}
                    {isProcessing ? "Decrypting..." : success ? "Download Unlocked PDF" : "Unlock & Download"}
                  </div>
                </button>
                
                {success && (
                  <button 
                    onClick={resetStates}
                    className="w-full text-slate-400 font-bold text-xs uppercase hover:text-rose-500 transition-colors"
                  >
                    Unlock Another File
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-16 border-t border-slate-100">
          <RelatedTools categoryId='pdf' />
        </div>
      </div>
    </div>
  );
}