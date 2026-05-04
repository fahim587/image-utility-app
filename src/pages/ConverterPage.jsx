import React from 'react';
import { Settings, Rocket, Bell, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// 1. Defined the component here to avoid "is not defined" error
const ComingSoonConverter = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-white">
      <div className="max-w-md w-full text-center space-y-8 p-10 bg-white rounded-3xl shadow-2xl border border-gray-100">
        
        {/* Animated Icon */}
        <div className="relative flex justify-center">
          <Settings className="text-rose-200 animate-spin" size={80} style={{ animationDuration: '8s' }} />
          <Rocket className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-500" size={40} />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
            Coming Soon!
          </h2>
          <p className="text-gray-500 leading-relaxed font-medium">
            We are currently upgrading our **Universal Office Converter** to provide a faster and more reliable experience. This tool will be back online shortly!
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col gap-3">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg active:scale-95"
          >
            <ArrowLeft size={18} /> Back to Other Tools
          </Link>
        </div>

        {/* Branding Footer */}
        <p className="text-[10px] text-gray-300 uppercase tracking-widest pt-4 font-bold">
          Googiz Advanced Utility • Maintenance Mode
        </p>
      </div>
    </div>
  );
};

// 2. Main Page Component
const ConverterPage = () => {
  return (
    <div className="pt-20">
      {/* The original conversion logic is safely commented out below */}
      <ComingSoonConverter />
    </div>
  );
};

export default ConverterPage;

/* 
============================================================
ORIGINAL CONVERSION CODE PRESERVED BELOW FOR FUTURE USE:
============================================================

// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// ... (The rest of your code remains here)
*/



// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FileUp, Download, CheckCircle2, AlertCircle, 
//   ChevronDown, UploadCloud, X, FileText, Loader2 
// } from "lucide-react";
// import RelatedTools from "../components/RelatedTools";

// const ConverterPage = ({ title, description, targetFormat, accept, categoryId }) => {
//   const [file, setFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState('idle');
//   const [showHowTo, setShowHowTo] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   // ক্লিনআপ ফাংশন
//   const cleanupPreview = useCallback(() => {
//     if (previewUrl) {
//       URL.revokeObjectURL(previewUrl);
//       setPreviewUrl(null);
//     }
//   }, [previewUrl]);

//   useEffect(() => {
//     return cleanupPreview;
//   }, [cleanupPreview]);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;

//     cleanupPreview();
//     setFile(selectedFile);
//     setStatus('idle');
//     setErrorMessage("");

//     if (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf') {
//       const url = URL.createObjectURL(selectedFile);
//       setPreviewUrl(url);
//     }
//   };

//   const handleRemoveFile = () => {
//     setFile(null);
//     cleanupPreview();
//     setStatus('idle');
//     setErrorMessage("");
//   };

//   const handleConvert = async () => {
//     if (!file || !targetFormat) {
//       setErrorMessage("Configuration missing: File or Target Format not found.");
//       setStatus('error');
//       return;
//     }

//     setLoading(true);
//     setStatus('loading');
//     setErrorMessage("");

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("targetFormat", targetFormat);

//     // Render এর জন্য টাইমআউট বাড়ানো হয়েছে (২ মিনিট)
//     const API_URL = "https://image-utility-app-1.onrender.com/api/convert-document";

//     try {
//       const response = await axios.post(API_URL, formData, {
//         responseType: 'blob',
//         headers: { 
//           'Content-Type': 'multipart/form-data',
//           'Accept': 'application/octet-stream'
//         },
//         timeout: 120000, // ১২০ সেকেন্ড বা ২ মিনিট
//         onUploadProgress: (progressEvent) => {
//            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//            console.log(`Uploading: ${percentCompleted}%`);
//         }
//       });

//       // ব্লব ভ্যালিডেশন
//       if (response.data.size === 0) {
//         throw new Error("The server returned an empty file. Please try again.");
//       }

//       // ডাউনলোড প্রসেস
//       const blob = new Blob([response.data], { type: response.headers['content-type'] });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
      
//       const safeFileName = file.name.split('.')[0].replace(/[^a-z0-9]/gi, '_').toLowerCase();
//       link.setAttribute('download', `${safeFileName}.${targetFormat}`);
      
//       document.body.appendChild(link);
//       link.click();
      
//       // ক্লিনআপ
//       setTimeout(() => {
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(url);
//       }, 100);

//       setStatus('success');
//     } catch (err) {
//       console.error("Critical Conversion Error:", err);
      
//       let msg = "Conversion failed. Please try a different file.";
//       if (err.code === 'ECONNABORTED') msg = "Server took too long. Render is waking up, please try again.";
//       if (err.response?.status === 500) msg = "Server error (500). The file might be too complex for the current plan.";
//       if (!navigator.onLine) msg = "Please check your internet connection.";
      
//       setErrorMessage(msg);
//       setStatus('error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white pt-20 pb-10">
//       <div className="max-w-4xl mx-auto px-6">
        
//         {/* Header */}
//         <div className="text-center mb-10">
//           <motion.h1 
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-4xl md:text-5xl font-black text-[#E91E63] uppercase tracking-tighter mb-4"
//           >
//             {title}
//           </motion.h1>
//           <p className="text-gray-500 text-lg font-medium">{description}</p>
//         </div>

//         {/* Accordion */}
//         <div className="mb-8 max-w-2xl mx-auto">
//           <button 
//             onClick={() => setShowHowTo(!showHowTo)}
//             className="w-full flex items-center justify-between px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-all"
//           >
//             <span>How to use this tool</span>
//             <ChevronDown size={20} className={`transition-transform duration-300 ${showHowTo ? 'rotate-180' : ''}`} />
//           </button>
          
//           <AnimatePresence>
//             {showHowTo && (
//               <motion.div 
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: 'auto', opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 className="overflow-hidden bg-white border-x border-b border-gray-100 rounded-b-xl"
//               >
//                 <div className="p-6 text-gray-600 text-sm leading-relaxed space-y-2">
//                   <p>1. Drag and drop or click the box to upload your file.</p>
//                   <p>2. Verify the preview thumbnail (PDF/Images).</p>
//                   <p>3. Click "CONVERT NOW" and wait for the processing to finish.</p>
//                   <p>4. Your file will download automatically once ready.</p>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Upload Area */}
//         <div className="relative max-w-3xl mx-auto">
//           <div className={`relative border-2 border-dashed rounded-[2rem] p-12 transition-all text-center flex flex-col items-center justify-center min-h-[350px] ${
//             file ? 'border-green-400 bg-green-50/20' : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:border-rose-400'
//           }`}>
//             {!file && (
//               <input 
//                 type="file" 
//                 accept={accept} 
//                 onChange={handleFileChange}
//                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
//               />
//             )}
            
//             {!file ? (
//               <div className="space-y-4">
//                 <div className="text-rose-500">
//                   <UploadCloud size={64} strokeWidth={1.5} className="mx-auto" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-900">Upload Your File</h3>
//                   <p className="text-gray-400 text-sm font-medium mt-1">Ready to convert to {targetFormat?.toUpperCase()}</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-6 z-30 w-full flex flex-col items-center">
//                 <div className="relative group">
//                   {/* Preview Logic */}
//                   {file?.type?.startsWith("image/") && previewUrl ? (
//                     <img src={previewUrl} alt="preview" className="w-40 h-40 object-cover rounded-2xl border-4 border-white shadow-2xl" />
//                   ) : file?.type === "application/pdf" && previewUrl ? (
//                     <iframe src={`${previewUrl}#toolbar=0`} className="w-40 h-40 rounded-2xl border-4 border-white shadow-2xl pointer-events-none" title="pdf" />
//                   ) : (
//                     <div className="w-40 h-40 bg-white rounded-2xl flex flex-col items-center justify-center border-4 border-white shadow-xl">
//                       <FileText size={48} className="text-rose-500 mb-2" />
//                       <span className="text-[10px] font-bold text-gray-400 uppercase">{file.name.split('.').pop()}</span>
//                     </div>
//                   )}

//                   <button 
//                     onClick={handleRemoveFile}
//                     className="absolute -top-3 -right-3 bg-rose-500 text-white p-1.5 rounded-full shadow-lg hover:bg-rose-600 transition-colors z-40"
//                   >
//                     <X size={18} />
//                   </button>
//                 </div>

//                 <div className="text-center">
//                   <p className="text-sm font-bold text-gray-900 truncate max-w-[250px] mx-auto">{file.name}</p>
//                   <p className="text-[10px] text-gray-400 font-black mt-1 uppercase">{(file.size / 1024).toFixed(2)} KB</p>
//                 </div>

//                 <button 
//                   onClick={handleConvert}
//                   disabled={loading}
//                   className={`px-12 py-4 rounded-full font-black text-lg flex items-center justify-center gap-3 transition-all ${
//                     loading 
//                       ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
//                       : "bg-[#E91E63] text-white hover:bg-[#C2185B] shadow-xl shadow-rose-200 active:scale-95"
//                   }`}
//                 >
//                   {loading ? <Loader2 size={22} className="animate-spin" /> : <Download size={22} />}
//                   {loading ? "PROCESSING..." : "CONVERT NOW"}
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Messages */}
//           <AnimatePresence>
//             {status === 'error' && (
//               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold shadow-sm">
//                 <AlertCircle size={18} />
//                 <span>{errorMessage || "Something went wrong!"}</span>
//               </motion.div>
//             )}

//             {status === 'success' && (
//                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-600 text-sm font-bold shadow-sm">
//                  <CheckCircle2 size={18} />
//                  <span>File converted and downloaded successfully!</span>
//                </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         <div className="mt-32">
//            <RelatedTools categoryId={categoryId || "pdf"} />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ConverterPage;/*

