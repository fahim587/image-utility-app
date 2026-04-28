import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Sparkles, Copy, Download, Upload, Loader2, 
  ChevronDown, FileSearch, Trash2, Check 
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";

// PDF.js Worker সেটআপ
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function AIPDFSummarizer() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [fileType, setFileType] = useState("txt");

  // PDF থেকে টেক্সট এক্সট্রাক্ট এবং প্রিভিউ জেনারেট করা
  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const typedArray = new Uint8Array(reader.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;

          // প্রথম পেজ থেকে প্রিভিউ ইমেজ জেনারেট
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport: viewport }).promise;
          setPdfPreview(canvas.toDataURL());

          let text = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(" ");
            text += pageText + "\n";
          }
          resolve(text);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFile = async (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setSummary("");
      setPdfPreview(null);
      try {
        await extractTextFromPDF(selected);
      } catch (err) {
        console.error("Preview failed:", err);
      }
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleSummarize = async () => {
    if (!file) {
      alert("Please upload a PDF first");
      return;
    }

    setLoading(true);
    try {
      const text = await extractTextFromPDF(file);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first to use AI tools.");
        setLoading(false);
        return;
      }

      // আপডেট করা এপিআই কল (ব্যাকটিক ব্যবহার করা হয়েছে)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/generate-content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          topic: `Summarize this PDF content clearly in bullet points:\n${text}`,
          type: "pdf-summary"
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSummary(data.content);
      } else {
        alert(data.message || data.error || "AI could not summarize this file.");
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Service Error: Check connection or server status.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSummary = () => {
    if (!summary) return;
    let content = summary;
    let mime = "text/plain";
    let filename = `${file?.name.replace(".pdf", "")}-summary`;

    if (fileType === "md") { mime = "text/markdown"; filename += ".md"; }
    else if (fileType === "html") {
      mime = "text/html";
      content = `<html><body style="font-family:Arial;padding:40px;line-height:1.6;"><h2>PDF Summary</h2><p>${summary.replace(/\n/g, "<br/>")}</p></body></html>`;
      filename += ".html";
    }
    else if (fileType === "doc") { mime = "application/msword"; filename += ".doc"; }
    else { filename += ".txt"; }

    const element = document.createElement("a");
    const blob = new Blob([content], { type: mime + ';charset=utf-8' });
    element.href = URL.createObjectURL(blob);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <Helmet>
        <title>Free AI PDF Summarizer | Get Instant Document Insights</title>
        <meta name="description" content="Fast, secure, and accurate AI PDF analysis." />
      </Helmet>

      <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6 font-sans">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              AI PDF Summarizer: <span className="text-blue-600">Smart Insights</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Upload complex PDFs and get concise summaries in seconds.
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <FileText size={18} className="text-blue-600" /> Document Source
                </label>
                
                <div className="relative group border-2 border-dashed border-gray-200 rounded-[2rem] p-4 transition-all hover:border-blue-500 bg-gray-50 min-h-[300px] flex items-center justify-center overflow-hidden text-center">
                  <input type="file" accept="application/pdf" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  
                  {!file ? (
                    <div>
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload size={28} />
                      </div>
                      <p className="text-gray-600 font-bold text-xl">Drag & Drop PDF or Click</p>
                    </div>
                  ) : (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                       {pdfPreview ? (
                         <div className="relative mb-4">
                           <img src={pdfPreview} alt="Preview" className="w-32 h-44 object-cover rounded-lg shadow-md border border-gray-200" />
                           <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full shadow-lg">
                             <Check size={14} />
                           </div>
                         </div>
                       ) : (
                         <div className="w-20 h-20 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4">
                            <FileSearch size={40} />
                         </div>
                       )}
                       <h3 className="text-gray-900 font-bold text-xl mb-1 truncate max-w-[250px]">{file.name}</h3>
                       <p className="text-gray-400 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </motion.div>
                  )}
                  {loading && (
                    <motion.div 
                      initial={{ left: "-100%" }} animate={{ left: "100%" }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute bottom-0 h-1 w-full bg-blue-500"
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-center">
                <button
                  onClick={handleSummarize}
                  disabled={loading || !file}
                  className="w-full md:flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold text-xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={24} />}
                  {loading ? "Reading PDF..." : "Summarize Now"}
                </button>

                <div className="relative w-full md:w-auto">
                  <button onClick={() => setShowOptions(!showOptions)} className="w-full md:w-auto bg-gray-100 hover:bg-gray-200 px-8 py-5 rounded-2xl font-bold flex items-center justify-between gap-3 transition-all text-gray-700">
                    Actions <ChevronDown size={20} className={showOptions ? 'rotate-180' : ''} />
                  </button>
                  
                  <AnimatePresence>
                    {showOptions && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full mb-3 right-0 w-56 bg-white rounded-2xl shadow-2xl border p-2 z-50">
                        <div className="p-2">
                          <select value={fileType} onChange={(e) => setFileType(e.target.value)} className="w-full p-2 bg-gray-50 border rounded-lg text-sm font-bold outline-none text-gray-700">
                            <option value="txt">TXT File</option>
                            <option value="md">Markdown</option>
                            <option value="html">HTML File</option>
                            <option value="doc">DOC File</option>
                          </select>
                        </div>
                        <button onClick={copyText} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-xl text-sm font-bold text-gray-700 transition-colors">
                          <Copy size={16} /> {copied ? "Copied!" : "Copy Summary"}
                        </button>
                        <button onClick={downloadSummary} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-xl text-sm font-bold text-gray-700 transition-colors">
                          <Download size={16} /> Download Result
                        </button>
                        <button onClick={() => {setFile(null); setSummary(""); setPdfPreview(null); setShowOptions(false)}} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl text-sm font-bold text-red-600 border-t mt-1">
                          <Trash2 size={16} /> Remove File
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <AnimatePresence>
                {summary && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-10 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-6 text-blue-600 font-black uppercase tracking-widest">
                       <Sparkles size={20} /> <span>AI Summary Result</span>
                    </div>
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] text-gray-800 leading-relaxed border border-gray-100 text-lg shadow-inner whitespace-pre-wrap font-medium">
                      {summary}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}