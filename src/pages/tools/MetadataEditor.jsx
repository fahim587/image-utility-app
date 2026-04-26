import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.min?url";
import { 
  UploadCloud, 
  Download, 
  FileText, 
  HelpCircle, 
  ChevronDown, 
  Tag, 
  User, 
  Type, 
  ShieldCheck,
  RefreshCcw,
  Info
} from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const MetadataEditor = () => {
  const [file, setFile] = useState(null);
  const [previews, setPreviews] = useState([]); 
  const [showHowTo, setShowHowTo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [metadata, setMetadata] = useState({
    title: "",
    author: "",
    subject: "",
    keywords: "",
    creator: "GOOGIZ PDF Editor",
  });
  
  const fileInput = useRef(null);

  const handleUpload = async (e) => {
    const selected = e.target.files[0];
    if (!selected || selected.type !== "application/pdf") return;
    
    setFile(selected);
    setIsProcessing(true);

    try {
      const arrayBuffer = await selected.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const images = [];

      for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.6 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        images.push(canvas.toDataURL());
      }
      setPreviews(images);

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setMetadata({
        title: pdfDoc.getTitle() || "",
        author: pdfDoc.getAuthor() || "",
        subject: pdfDoc.getSubject() || "",
        keywords: pdfDoc.getKeywords() || "",
        creator: pdfDoc.getCreator() || "GOOGIZ PDF Editor",
      });

    } catch (err) {
      console.error("Error loading PDF:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdate = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      pdfDoc.setTitle(metadata.title || "");
      pdfDoc.setAuthor(metadata.author || "");
      pdfDoc.setSubject(metadata.subject || "");
      pdfDoc.setKeywords(metadata.keywords.split(",").map(k => k.trim()));
      pdfDoc.setCreator(metadata.creator);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `GOOGIZ_Metadata_${file.name}`;
      link.click();
    } catch (err) {
      console.error("Error updating metadata:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 px-4">
      <Helmet>
        <title>Edit PDF Metadata Online - Change PDF Properties | GOOGIZ</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 flex items-center justify-center gap-3">
            <Tag className="text-rose-600" size={32} /> PDF Metadata Editor
          </h1>
          
          <button 
              onClick={() => setShowHowTo(!showHowTo)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all text-sm font-bold text-slate-600"
          >
              <HelpCircle size={18} className="text-rose-500" />
              How it works?
              <ChevronDown size={16} className={`transition-transform duration-300 ${showHowTo ? 'rotate-180' : ''}`} />
          </button>

          <div className={`overflow-hidden transition-all duration-500 max-w-2xl mx-auto ${showHowTo ? 'max-h-96 mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl text-left grid md:grid-cols-3 gap-6 text-[11px] leading-relaxed">
                  <div className="space-y-2">
                      <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center font-black">1</div>
                      <p className="font-bold text-slate-700 uppercase tracking-tighter">Upload PDF</p>
                      <p className="text-slate-500">Select the PDF file you want to edit. We'll extract current metadata.</p>
                  </div>
                  <div className="space-y-2">
                      <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center font-black">2</div>
                      <p className="font-bold text-slate-700 uppercase tracking-tighter">Edit Info</p>
                      <p className="text-slate-500">Update Title, Author, Subject, and Keywords in the form.</p>
                  </div>
                  <div className="space-y-2">
                      <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center font-black">3</div>
                      <p className="font-bold text-slate-700 uppercase tracking-tighter">Download</p>
                      <p className="text-slate-500">Save changes. Processing is 100% client-side for privacy.</p>
                  </div>
              </div>
          </div>
        </div>

        {!file ? (
          <div onClick={() => fileInput.current.click()} className="max-w-2xl mx-auto border-4 border-dashed border-rose-100 rounded-[3rem] p-20 text-center cursor-pointer bg-white shadow-2xl hover:border-rose-400 transition-all group">
            <input type="file" ref={fileInput} className="hidden" accept="application/pdf" onChange={handleUpload} />
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <UploadCloud className="text-rose-600" size={40} />
            </div>
            <h2 className="text-xl font-black text-slate-800">Select PDF File</h2>
            <p className="text-slate-400 text-sm mt-2">Private & Secure Processing</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid md:grid-cols-[400px_1fr] gap-8 animate-in fade-in zoom-in duration-500">
            
            <div className="space-y-4">
                <div className="bg-slate-800 p-2 rounded-[2rem] shadow-2xl sticky top-28 overflow-hidden h-[600px] flex flex-col">
                    <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Viewer</span>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-700 custom-scrollbar">
                        {previews.length > 0 ? (
                            previews.map((img, idx) => (
                                <div key={idx} className="relative group">
                                    <img src={img} className="w-full rounded-lg shadow-lg border border-slate-600" alt={`Page ${idx + 1}`} />
                                    <span className="absolute top-2 right-2 bg-black/50 text-white text-[8px] px-2 py-0.5 rounded-full">{idx + 1}</span>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center space-y-4 animate-pulse">
                                <FileText size={48} className="text-slate-600" />
                                <div className="h-2 w-32 bg-slate-600 rounded"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-slate-50 self-start">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                            <Type size={14} className="text-rose-500" /> Document Title
                        </label>
                        <input 
                            type="text" 
                            value={metadata.title}
                            placeholder="Enter title..."
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-bold text-slate-700"
                            onChange={(e) => setMetadata({...metadata, title: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                            <User size={14} className="text-rose-500" /> Author Name
                        </label>
                        <input 
                            type="text" 
                            value={metadata.author}
                            placeholder="Enter author..."
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-bold text-slate-700"
                            onChange={(e) => setMetadata({...metadata, author: e.target.value})} 
                        />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                        <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                            <Info size={14} className="text-rose-500" /> Subject / Description
                        </label>
                        <textarea 
                            rows="3"
                            value={metadata.subject}
                            placeholder="Briefly describe the document contents..."
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-bold text-slate-700 resize-none"
                            onChange={(e) => setMetadata({...metadata, subject: e.target.value})} 
                        />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                        <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                            <Tag size={14} className="text-rose-500" /> Keywords (Separated by comma)
                        </label>
                        <input 
                            type="text" 
                            value={metadata.keywords}
                            placeholder="e.g. Invoice, Report, 2026"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-bold text-slate-700"
                            onChange={(e) => setMetadata({...metadata, keywords: e.target.value})} 
                        />
                    </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => {setFile(null); setPreviews([]);}} 
                        className="flex-1 px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCcw size={16} /> Change File
                    </button>
                    <button 
                        onClick={handleUpdate} 
                        disabled={isProcessing}
                        className="flex-[2] bg-rose-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-rose-100 flex items-center justify-center gap-3 hover:bg-rose-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isProcessing ? "Processing..." : <><Download size={18} /> Update & Download</>}
                    </button>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
                   <ShieldCheck size={16} />
                   <p className="text-[10px] font-bold uppercase tracking-widest">Client-side processing • Secure</p>
                </div>
            </div>
          </div>
        )}

        <div className="mt-32">
          <RelatedTools categoryId="pdf" />
        </div>
      </div>
      
      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-black uppercase tracking-[0.3em] text-[10px]">Updating Metadata</p>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default MetadataEditor;