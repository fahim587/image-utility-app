import React, { useState, useCallback } from 'react'; // useEffect বাদ দেওয়া হয়েছে
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, CheckCircle2, AlertCircle, 
  ChevronDown, UploadCloud, X, FileText, Loader2 
} from "lucide-react";
import RelatedTools from "../components/RelatedTools";

const ConverterPage = ({ title, description, targetFormat, accept, categoryId }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [showHowTo, setShowHowTo] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setStatus('idle');
    setErrorMessage("");
    // এখানে প্রিভিউ URL তৈরির অংশটুকু বাদ দেওয়া হয়েছে
  };

  const handleRemoveFile = () => {
    setFile(null);
    setStatus('idle');
    setErrorMessage("");
  };

  const handleConvert = async () => {
    if (!file || !targetFormat) {
      setErrorMessage("Configuration missing: File or Target Format not found.");
      setStatus('error');
      return;
    }

    setLoading(true);
    setStatus('loading');
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("targetFormat", targetFormat);

    const API_URL = "https://image-utility-app-1.onrender.com/api/convert-document";

    try {
      const response = await axios.post(API_URL, formData, {
        responseType: 'blob',
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/octet-stream'
        },
        timeout: 120000, 
        onUploadProgress: (progressEvent) => {
           const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
           console.log(`Uploading: ${percentCompleted}%`);
        }
      });

      if (response.data.size === 0) throw new Error("Empty file received.");

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const safeFileName = file.name.split('.')[0].replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.setAttribute('download', `${safeFileName}.${targetFormat}`);
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      setStatus('success');
    } catch (err) {
      console.error("Conversion Error:", err);
      let msg = "Conversion failed. Please try again.";
      if (err.code === 'ECONNABORTED') msg = "Server timeout. Please try a smaller file or try again.";
      setErrorMessage(msg);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header & Description */}
        <div className="text-center mb-10">
          <motion.h1 className="text-4xl md:text-5xl font-black text-[#E91E63] uppercase mb-4">
            {title}
          </motion.h1>
          <p className="text-gray-500 text-lg">{description}</p>
        </div>

        {/* Upload Area */}
        <div className="relative max-w-3xl mx-auto">
          <div className={`relative border-2 border-dashed rounded-[2rem] p-12 transition-all text-center flex flex-col items-center justify-center min-h-[350px] ${
            file ? 'border-green-400 bg-green-50/20' : 'border-gray-200 bg-gray-50/50 hover:border-rose-400'
          }`}>
            {!file && (
              <input type="file" accept={accept} onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
            )}
            
            {!file ? (
              <div className="space-y-4">
                <UploadCloud size={64} className="mx-auto text-rose-500" />
                <h3 className="text-xl font-bold">Upload Your File</h3>
              </div>
            ) : (
              <div className="space-y-6 z-30 w-full flex flex-col items-center">
                {/* প্রিভিউ এর বদলে শুধু ফাইল আইকন */}
                <div className="relative">
                  <div className="w-32 h-32 bg-white rounded-2xl flex flex-col items-center justify-center shadow-xl border-4 border-white">
                    <FileText size={48} className="text-rose-500 mb-2" />
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      {file.name.split('.').pop()}
                    </span>
                  </div>
                  <button onClick={handleRemoveFile} className="absolute -top-3 -right-3 bg-rose-500 text-white p-1.5 rounded-full">
                    <X size={18} />
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-sm font-bold truncate max-w-[250px] mx-auto">{file.name}</p>
                  <p className="text-[10px] text-gray-400 font-black">{(file.size / 1024).toFixed(2)} KB</p>
                </div>

                <button onClick={handleConvert} disabled={loading} className={`px-12 py-4 rounded-full font-black text-lg flex items-center gap-3 ${loading ? "bg-gray-200" : "bg-[#E91E63] text-white"}`}>
                  {loading ? <Loader2 size={22} className="animate-spin" /> : <Download size={22} />}
                  {loading ? "PROCESSING..." : "CONVERT NOW"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer/Related Tools */}
        <div className="mt-32">
           <RelatedTools categoryId={categoryId || "pdf"} />
        </div>
      </div>
    </div>
  );
};

export default ConverterPage;