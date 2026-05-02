import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileUp, Download, CheckCircle2, AlertCircle, 
  ChevronDown, UploadCloud, X, FileText 
} from "lucide-react";
import RelatedTools from "../components/RelatedTools";

const ConverterPage = ({ title, description, targetFormat, accept, categoryId }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [showHowTo, setShowHowTo] = useState(false);

  // মেমোরি লিক রোধ করতে প্রিভিউ ইউআরএল ক্লিনআপ
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // পুরানো প্রিভিউ থাকলে ডিলিট করা
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(selectedFile);
    setStatus('idle');

    // PDF অথবা Image হলে প্রিভিউ URL তৈরি করবে
    if (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf') {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setStatus('idle');
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setStatus('loading');

    const formData = new FormData();
    formData.append("file", file);
    formData.append("targetFormat", targetFormat);

    const API_URL = "https://image-utility-app-1.onrender.com/api/convert-document";

    try {
      const response = await axios.post(API_URL, formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${file.name.split('.')[0]}.${targetFormat}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setStatus('success');
    } catch (err) {
      console.error("Conversion Error:", err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-[#E91E63] uppercase tracking-tighter mb-4"
          >
            {title}
          </motion.h1>
          <p className="text-gray-500 text-lg font-medium">{description}</p>
        </div>

        {/* --- How to use Accordion --- */}
        <div className="mb-8 max-w-2xl mx-auto">
          <button 
            onClick={() => setShowHowTo(!showHowTo)}
            className="w-full flex items-center justify-between px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-all"
          >
            <span>How to use this tool</span>
            <ChevronDown size={20} className={`transition-transform duration-300 ${showHowTo ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showHowTo && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-white border-x border-b border-gray-100 rounded-b-xl"
              >
                <div className="p-6 text-gray-600 text-sm leading-relaxed space-y-2">
                  <p>1. Click on the upload box or drag and drop your file.</p>
                  <p>2. View the thumbnail preview (for images/PDFs) to confirm.</p>
                  <p>3. Click the "CONVERT NOW" button to start processing.</p>
                  <p>4. The converted file will download automatically.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- Main Upload & Preview Box --- */}
        <div className="relative max-w-3xl mx-auto">
          <div className={`relative border-2 border-dashed rounded-[2rem] p-12 transition-all text-center flex flex-col items-center justify-center min-h-[350px] ${
            file ? 'border-green-400 bg-green-50/20' : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:border-rose-400'
          }`}>
            {!file && (
              <input 
                type="file" 
                accept={accept} 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
            )}
            
            {!file ? (
              <div className="space-y-4">
                <div className="text-rose-500">
                  <UploadCloud size={64} strokeWidth={1.5} className="mx-auto" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Upload Your File</h3>
                  <p className="text-gray-400 text-sm font-medium mt-1">Drag & drop or click to browse</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 z-30 w-full flex flex-col items-center">
                {/* Thumbnail Preview Area */}
                <div className="relative group">
                  {/* IMAGE PREVIEW */}
                  {file?.type?.startsWith("image/") && previewUrl && (
                    <img 
                      src={previewUrl} 
                      alt="preview" 
                      className="w-40 h-40 object-cover rounded-2xl border-4 border-white shadow-2xl transition-transform group-hover:scale-105" 
                    />
                  )}

                  {/* PDF PREVIEW */}
                  {file?.type === "application/pdf" && previewUrl && (
                    <iframe
                      src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-40 h-40 rounded-2xl border-4 border-white shadow-2xl overflow-hidden pointer-events-none"
                      title="pdf-preview"
                    />
                  )}

                  {/* FALLBACK FOR OTHER FILES (DOCX, EXCEL, ETC) */}
                  {!file?.type?.startsWith("image/") && file?.type !== "application/pdf" && (
                    <div className="w-40 h-40 bg-white rounded-2xl flex flex-col items-center justify-center border-4 border-white shadow-xl">
                      <FileText size={48} className="text-rose-500 mb-2" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {file?.name?.split('.').pop()}
                      </span>
                    </div>
                  )}

                  {/* REMOVE BUTTON */}
                  <button 
                    onClick={handleRemoveFile}
                    className="absolute -top-3 -right-3 bg-rose-500 text-white p-1.5 rounded-full shadow-lg hover:bg-rose-600 transition-colors z-40"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900 truncate max-w-[250px] mx-auto">{file.name}</p>
                  <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-widest">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>

                <button 
                  onClick={handleConvert}
                  disabled={loading}
                  className={`px-12 py-4 rounded-full font-black text-lg flex items-center justify-center gap-3 transition-all ${
                    loading 
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                      : "bg-[#E91E63] text-white hover:bg-[#C2185B] shadow-xl shadow-rose-200 active:scale-95"
                  }`}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Download size={22} />
                      CONVERT NOW
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {status === 'error' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold shadow-sm">
              <AlertCircle size={18} />
              <span>Conversion failed. Please check the file or server.</span>
            </motion.div>
          )}

          {/* Success Message */}
          {status === 'success' && (
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-600 text-sm font-bold shadow-sm">
               <CheckCircle2 size={18} />
               <span>Successfully converted and downloaded!</span>
             </motion.div>
          )}
        </div>

        <div className="mt-32">
           <RelatedTools categoryId={categoryId || "pdf"} />
        </div>

      </div>
    </div>
  );
};

export default ConverterPage;