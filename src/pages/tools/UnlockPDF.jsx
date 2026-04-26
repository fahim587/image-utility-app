import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { 
  Unlock, FileKey, Download, Loader2, FilePlus, 
  Trash2, FileText, ShieldOff, Eye, EyeOff, 
  AlertCircle, CheckCircle2, ChevronDown, HelpCircle 
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

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
      resetStates();
    }
  };

  const resetStates = () => {
    setError("");
    setSuccess(false);
    setPassword("");
    setUnlockedBlobUrl(null);
  };

  const removePassword = async () => {
    if (!file || !password) return;
    setIsProcessing(true);
    setError("");

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    try {
      // আপনার লোকাল ব্যাকএন্ড ইউআরএল
      const response = await fetch('http://localhost:5000/api/unlock-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Incorrect password or server error.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // থাম্বনেইল হিসেবে দেখানোর জন্য এবং ডাউনলোডের জন্য ইউআরএল সেট করা
      setUnlockedBlobUrl(url);
      setSuccess(true);

      // অটোমেটিক ডাউনলোড
      const a = document.createElement("a");
      a.href = url;
      a.download = `unlocked-${file.name}`;
      a.click();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-20">
      <Helmet>
        <title>Unlock PDF Online | Remove Password Security - GOOGIZ</title>
        <meta name="description" content="Remove password protection from your PDF files instantly. Secure, fast, and easy to use PDF unlocker tool." />
      </Helmet>

      <div className="max-w-[1000px] mx-auto p-4 md:p-8 space-y-8">
        {/* HEADER */}
        <header className="text-center space-y-4 pt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-widest shadow-sm">
             <ShieldOff size={14} /> 100% Secure & Private
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900">
            Unlock <span className="text-rose-600">PDF</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Remove security and password restrictions from your PDF documents in seconds.
          </p>
        </header>

        {/* HOW TO USE DROPDOWN */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <button 
            onClick={() => setShowHowTo(!showHowTo)}
            className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 font-bold text-slate-700">
              <HelpCircle className="text-rose-500" size={20} />
              How to use this tool?
            </div>
            <ChevronDown className={`transition-transform duration-300 ${showHowTo ? 'rotate-180' : ''}`} />
          </button>
          {showHowTo && (
            <div className="p-6 pt-0 text-slate-500 text-sm leading-relaxed space-y-2 border-t border-slate-50 animate-in fade-in slide-in-from-top-2">
              <p>1. <strong>Upload:</strong> Click the area below to select your password-protected PDF.</p>
              <p>2. <strong>Password:</strong> Enter the exact password of the document in the input field.</p>
              <p>3. <strong>Unlock:</strong> Click "Unlock & Download". The server will remove the encryption.</p>
              <p>4. <strong>Download:</strong> Your unlocked file will be ready for download instantly.</p>
            </div>
          )}
        </div>

        {/* MAIN UPLOADER / RESULT */}
        {!file ? (
          <div 
            onClick={() => fileInputRef.current.click()} 
            className="group relative border-2 border-dashed border-slate-200 bg-white p-20 md:p-32 text-center rounded-[3rem] cursor-pointer hover:border-rose-400 hover:bg-rose-50/20 transition-all duration-500"
          >
            <div className="w-20 h-20 bg-rose-50 text-rose-500 flex items-center justify-center mx-auto rounded-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <Unlock size={36} />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Choose PDF File</h2>
            <p className="text-slate-400 mt-2">or drag and drop your protected PDF here</p>
            <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileChange} hidden />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* FILE INFO & THUMBNAIL */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center">
              {success && unlockedBlobUrl ? (
                <div className="w-full aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 mb-6 shadow-inner relative group">
                  <iframe 
                    src={`${unlockedBlobUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                    className="w-full h-full pointer-events-none"
                    title="PDF Thumbnail"
                  />
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 size={48} className="text-green-500 bg-white rounded-full" />
                  </div>
                </div>
              ) : (
                <div className="w-full py-12 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center mb-6">
                  <FileText size={64} className="text-rose-500 mb-4" />
                  <p className="font-bold text-slate-800">{file.name}</p>
                  <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}
              
              <button 
                onClick={() => setFile(null)}
                className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-tighter hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
              >
                <Trash2 size={14} /> Remove File
              </button>
            </div>

            {/* ACTION CARD */}
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Current Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Type document password..."
                    className={`w-full bg-slate-50 border-2 ${error ? 'border-red-200 ring-4 ring-red-50' : 'border-slate-100 focus:border-rose-400 focus:ring-4 focus:ring-rose-50'} p-5 rounded-2xl font-bold outline-none transition-all pr-14`}
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {error && <p className="text-red-500 text-xs font-bold flex items-center gap-2 pl-1 animate-shake"><AlertCircle size={14} /> {error}</p>}
                {success && <p className="text-green-600 text-xs font-bold flex items-center gap-2 pl-1"><CheckCircle2 size={14} /> Unlocked successfully!</p>}
              </div>

              <button 
                onClick={removePassword}
                disabled={isProcessing || !password}
                className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-lg hover:bg-rose-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none overflow-hidden relative"
              >
                <div className="flex justify-center items-center gap-3">
                  {isProcessing ? <Loader2 className="animate-spin" size={20} /> : success ? <Download size={20} /> : <Unlock size={20} />}
                  {isProcessing ? "Decrypting File..." : success ? "Download Unlocked PDF" : "Unlock & Download"}
                </div>
              </button>
            </div>
          </div>
        )}

        <div className="pt-10">
          <RelatedTools categoryId='pdf' />
        </div>
      </div>
    </div>
  );
}