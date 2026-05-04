import React, { useState, useRef, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.min?url";
import SignaturePad from "signature_pad";
import Draggable from "react-draggable";
import { PDFDocument } from "pdf-lib";
import { UploadCloud, Download, ChevronLeft, ChevronRight, Type, PenTool, Image as ImageIcon, Trash2, Bold, CaseSensitive, HelpCircle, ChevronDown } from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const SignPdf = () => {
  const fileInput = useRef(null);
  const pdfCanvas = useRef(null);
  const drawCanvas = useRef(null);
  const uploadSigRef = useRef(null);
  const nodeRef = useRef(null);
  const sigPadRef = useRef(null);

  const [file, setFile] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [signature, setSignature] = useState(null);
  const [sigPosition, setSigPosition] = useState({ x: 50, y: 50 });
  const [sigSize, setSigSize] = useState({ w: 180, h: 70 });
  const [mode, setMode] = useState("draw");
  const [typeText, setTypeText] = useState("");
  const [selectedFont, setSelectedFont] = useState("'Dancing Script', cursive");
  const [sigColor, setSigColor] = useState("#000000");
  const [isBold, setIsBold] = useState(false);
  const [textTransform, setTextTransform] = useState("none");
  const [thumbnails, setThumbnails] = useState([]);
  const [showHowTo, setShowHowTo] = useState(false);

  // ১. ড্রয়িং সিগনেচার প্যাড ফিক্স
  useEffect(() => {
    let pad = null;
    if (mode === "draw" && drawCanvas.current) {
      const canvas = drawCanvas.current;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      canvas.getContext("2d").scale(ratio, ratio);

      pad = new SignaturePad(canvas, {
        backgroundColor: "rgba(255,255,255,0)",
        penColor: sigColor,
        minWidth: 1.5,
        maxWidth: 3.5,
      });

      // সেফটি চেকসহ ইভেন্ট লিসেনার
      if (typeof pad.addEventListener === "function") {
        pad.addEventListener("endStroke", () => {
          setSignature(pad.toDataURL("image/png"));
        });
      } else {
        // যদি addEventListener না থাকে (ভার্সন ভেদে), তবে onEnd মেথড ব্যবহার করা হয়
        pad.onEnd = () => {
          setSignature(pad.toDataURL("image/png"));
        };
      }

      sigPadRef.current = pad;
    }

    return () => {
      if (pad) pad.off();
    };
  }, [mode, file]);

  // ২. টাইপ করা সিগনেচার জেনারেটর
  const generateTypedSignature = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    let text = typeText || "Signature";
    if (textTransform === "uppercase") text = text.toUpperCase();
    if (textTransform === "lowercase") text = text.toLowerCase();
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${isBold ? 'bold' : ''} italic 100px ${selectedFont.split(',')[0]}`;
    ctx.fillStyle = sigColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 400, 150);
    setSignature(canvas.toDataURL("image/png"));
  }, [typeText, textTransform, isBold, selectedFont, sigColor]);

  // ৩. কালার বা মোড চেঞ্জ হলে সিগনেচার আপডেট
  useEffect(() => {
    if (mode === "draw" && sigPadRef.current) {
      sigPadRef.current.penColor = sigColor;
      if (!sigPadRef.current.isEmpty()) {
        setSignature(sigPadRef.current.toDataURL());
      }
    } else if (mode === "type") {
      generateTypedSignature();
    }
  }, [sigColor, isBold, textTransform, selectedFont, typeText, mode, generateTypedSignature]);

  const uploadPdf = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    const reader = new FileReader();
    reader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const loadingTask = pdfjsLib.getDocument({ data: typedArray });
      const loadedPdf = await loadingTask.promise;
      setPdf(loadedPdf);
      setTotalPages(loadedPdf.numPages);
      renderPage(loadedPdf, 1);
      generateThumbnails(loadedPdf);
    };
    reader.readAsArrayBuffer(selected);
  };

  const renderPage = async (pdfDoc, num) => {
    const p = await pdfDoc.getPage(num);
    const viewport = p.getViewport({ scale: 1.5 });
    const canvas = pdfCanvas.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await p.render({ canvasContext: ctx, viewport: viewport }).promise;
  };

  const generateThumbnails = async (pdfDoc) => {
    const thumbArr = [];
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const p = await pdfDoc.getPage(i);
      const viewport = p.getViewport({ scale: 0.3 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await p.render({ canvasContext: canvas.getContext("2d"), viewport: viewport }).promise;
      thumbArr.push(canvas.toDataURL("image/jpeg", 0.7));
    }
    setThumbnails(thumbArr);
  };

  const downloadSignedPdf = async () => {
    if (!file || !signature) return;
    try {
      const pdfBytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(pdfBytes);
      const pages = doc.getPages();
      const currentPage = pages[page - 1];
      const img = await doc.embedPng(signature);
      const { width: pdfWidth, height: pdfHeight } = currentPage.getSize();
      const rect = pdfCanvas.current.getBoundingClientRect();
      const scaleX = pdfWidth / rect.width;
      const scaleY = pdfHeight / rect.height;

      currentPage.drawImage(img, {
        x: sigPosition.x * scaleX,
        y: pdfHeight - (sigPosition.y * scaleY) - (sigSize.h * scaleY),
        width: sigSize.w * scaleX,
        height: sigSize.h * scaleY,
      });

      const newPdf = await doc.save();
      const blob = new Blob([newPdf], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `Signed_Document.pdf`; a.click();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 px-4 font-sans text-slate-900">
      <Helmet>
        <title>Sign PDF Online Free - E-Signature Tool | GOOGIZ</title>
        <meta name="description" content="Sign PDF documents online for free. Digital signatures made easy." />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&family=Great+Vibes&family=Sacramento&family=Yellowtail&family=Parisienne&family=Alex+Brush&family=Allura&family=Cookie&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8 text-center">
            <button 
                onClick={() => setShowHowTo(!showHowTo)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all text-sm font-semibold text-slate-700"
            >
                <HelpCircle size={18} className="text-rose-500" />
                How to use this tool?
                <ChevronDown size={16} className={`transition-transform duration-300 ${showHowTo ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 max-w-2xl mx-auto ${showHowTo ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-inner text-left grid md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-600">
                    <div className="space-y-2">
                        <p><strong>1. Upload:</strong> Click the box to select your PDF.</p>
                        <p><strong>2. Create:</strong> Draw, Type, or Upload your signature.</p>
                    </div>
                    <div className="space-y-2">
                        <p><strong>3. Position:</strong> Drag the signature to the right spot.</p>
                        <p><strong>4. Finish:</strong> Resize and click 'Download PDF'.</p>
                    </div>
                </div>
            </div>
        </div>

        {!file ? (
          <div className="max-w-3xl mx-auto border-4 border-dashed border-rose-100 rounded-[2.5rem] p-24 text-center cursor-pointer bg-white shadow-2xl transition-all hover:border-rose-400 group" onClick={() => fileInput.current.click()}>
            <input type="file" accept="application/pdf" ref={fileInput} className="hidden" onChange={uploadPdf} />
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <UploadCloud className="text-rose-600" size={45} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Sign Your PDF Online</h1>
            <p className="text-slate-500 font-medium">Click to upload or drag and drop your file here</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[240px_1fr_400px] gap-8 h-[82vh]">
            {/* Pages Sidebar */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 overflow-y-auto custom-scrollbar shadow-sm">
              <h3 className="text-[11px] font-bold uppercase text-slate-400 mb-6 tracking-[0.2em] text-center border-b pb-2">Document Pages</h3>
              {thumbnails.map((thumb, i) => (
                <div key={i} onClick={() => { setPage(i+1); renderPage(pdf, i+1); }} className={`group relative mb-5 cursor-pointer rounded-xl border-4 transition-all duration-300 ${page === i+1 ? 'border-rose-500 shadow-xl scale-[1.02]' : 'border-transparent hover:border-slate-200'}`}>
                  <img src={thumb} className="w-full rounded-lg" alt={`Page ${i+1}`} />
                  <div className="absolute bottom-2 right-2 bg-slate-800/70 text-white text-[10px] px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Page {i+1}</div>
                </div>
              ))}
            </div>

            {/* Main Editor */}
            <div className="bg-slate-200/50 rounded-3xl overflow-auto relative flex flex-col items-center p-8 custom-scrollbar border border-slate-200/60">
              <div className="sticky top-0 z-20 mb-6 bg-white/80 backdrop-blur-md px-8 py-3 rounded-2xl shadow-lg flex items-center gap-6 font-bold text-slate-800">
                <button className="hover:text-rose-600 transition-colors" onClick={() => page > 1 && (setPage(page-1), renderPage(pdf, page-1))}><ChevronLeft size={24}/></button>
                <span className="text-sm font-black tracking-widest tabular-nums">{page} / {totalPages}</span>
                <button className="hover:text-rose-600 transition-colors" onClick={() => page < totalPages && (setPage(page+1), renderPage(pdf, page+1))}><ChevronRight size={24}/></button>
              </div>
              
              <div className="relative shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white mx-auto">
                <canvas ref={pdfCanvas} className="block h-auto w-full rounded-sm" />
                {signature && (
                  <Draggable nodeRef={nodeRef} bounds="parent" position={sigPosition} onStop={(e, data) => setSigPosition({ x: data.x, y: data.y })}>
                    <div ref={nodeRef} className="absolute z-40 cursor-grab active:cursor-grabbing top-0 left-0 group">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] text-white px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">Drag to place</div>
                      <img src={signature} style={{ width: sigSize.w, height: sigSize.h }} className="border-2 border-dashed border-rose-500/50 bg-transparent transition-colors hover:border-rose-500" alt="Signature preview" />
                    </div>
                  </Draggable>
                )}
              </div>
            </div>

            {/* Sidebar Controls */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 overflow-y-auto custom-scrollbar flex flex-col gap-8 shadow-2xl">
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {["draw", "type", "upload"].map(m => (
                  <button key={m} onClick={() => setMode(m)} className={`flex-1 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${mode === m ? "bg-white text-rose-600 shadow-md scale-[1.02]" : "text-slate-400 hover:text-slate-600"}`}>{m}</button>
                ))}
              </div>

              <div className="space-y-5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Signature Color</label>
                <div className="flex items-center gap-3">
                  {["#000000", "#0000FF", "#FF0000", "#008000"].map(c => <button key={c} onClick={() => setSigColor(c)} className={`w-9 h-9 rounded-full border-4 transition-all ${sigColor === c ? 'border-rose-500 scale-110 shadow-lg' : 'border-white shadow-sm'}`} style={{ backgroundColor: c }} />)}
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
                    <input type="color" value={sigColor} onChange={e => setSigColor(e.target.value)} className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer" />
                  </div>
                </div>

                {mode === "draw" && (
                  <div className="space-y-4">
                    <div className="relative group">
                        <canvas ref={drawCanvas} className="w-full h-52 bg-[#fafafa] border-2 border-dashed border-slate-200 rounded-2xl touch-none cursor-crosshair transition-colors hover:border-rose-200" style={{ touchAction: 'none' }} />
                    </div>
                    <button onClick={() => { sigPadRef.current?.clear(); setSignature(null); }} className="w-full py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-bold text-xs uppercase text-slate-500 transition-all flex items-center justify-center gap-2"><Trash2 size={14}/> Clear Canvas</button>
                  </div>
                )}

                {mode === "type" && (
                  <div className="space-y-5">
                    <input value={typeText} onChange={e => setTypeText(e.target.value)} className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-rose-50 transition-all font-medium" placeholder="Type your name..." />
                    <div className="flex gap-3">
                      <button onClick={() => setIsBold(!isBold)} className={`flex-1 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 text-xs font-black ${isBold ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}><Bold size={16}/> BOLD</button>
                      <button onClick={() => setTextTransform(textTransform === 'uppercase' ? 'none' : 'uppercase')} className={`flex-1 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 text-xs font-black ${textTransform === 'uppercase' ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}><CaseSensitive size={18}/> ALL CAPS</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                      {["'Dancing Script', cursive", "'Great Vibes', cursive", "'Sacramento', cursive", "'Yellowtail', cursive", "'Parisienne', cursive", "'Alex Brush', cursive"].map(f => (
                        <button key={f} onClick={() => setSelectedFont(f)} style={{ fontFamily: f, color: sigColor }} className={`p-3 border-2 rounded-xl text-xl transition-all ${selectedFont === f ? 'border-rose-500 bg-rose-50/50 shadow-sm' : 'border-slate-50 hover:bg-slate-50'}`}>Sign</button>
                      ))}
                    </div>
                  </div>
                )}

                {mode === "upload" && (
                  <div onClick={() => uploadSigRef.current.click()} className="border-3 border-dashed border-slate-200 p-12 rounded-2xl text-center cursor-pointer hover:border-rose-400 hover:bg-rose-50/30 transition-all group">
                    <input type="file" accept="image/*" ref={uploadSigRef} className="hidden" onChange={(e) => { const r = new FileReader(); r.onload = () => setSignature(r.result); r.readAsDataURL(e.target.files[0]); }} />
                    <ImageIcon className="text-slate-400 mx-auto mb-4 group-hover:text-rose-500" size={28} />
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Choose Image</p>
                  </div>
                )}
              </div>

              {signature && (
                <div className="mt-auto pt-8 border-t border-slate-100 space-y-6">
                  <div>
                    <div className="flex justify-between text-[11px] font-black text-slate-400 mb-3 uppercase tracking-widest"><span>Signature Scale</span><span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{sigSize.w}px</span></div>
                    <input type="range" min="40" max="600" value={sigSize.w} onChange={e => setSigSize({ w: parseInt(e.target.value), h: parseInt(e.target.value)/2.5 })} className="w-full accent-rose-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <button onClick={downloadSignedPdf} className="w-full py-5 bg-rose-600 text-white rounded-[1.25rem] font-black uppercase text-xs tracking-[0.15em] shadow-xl shadow-rose-200 flex items-center justify-center gap-3 hover:bg-rose-700 hover:-translate-y-1 transition-all active:scale-[0.97] group">
                    <Download size={20} className="group-hover:bounce" /> Finish & Download PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-28">
          <RelatedTools categoryId="pdf" />
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .group-hover\\:bounce { animation: bounce 1s infinite; }
      `}</style>
    </div>
  );
};

export default SignPdf;