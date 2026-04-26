import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, rgb } from "pdf-lib";
import Draggable from "react-draggable";
import SignatureCanvas from "react-signature-canvas";
import { 
  Type, Image as ImageIcon, PenTool, Eraser, 
  Square, Download, UploadCloud, X, Undo, Trash2 
} from "lucide-react";

// Worker setup for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

const PdfEditor = () => {
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [elements, setElements] = useState([]);
  const [activeTool, setActiveTool] = useState("text");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);

  const fileInput = useRef(null);
  const imageInput = useRef(null);
  const sigCanvas = useRef(null);
  const containerRef = useRef(null);

  // 1. Handle PDF Upload & Render Preview
  const handleUpload = async (e) => {
    const selected = e.target.files[0];
    if (selected?.type === "application/pdf") {
      setFile(selected);
      const buffer = await selected.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: ctx, viewport }).promise;
      setPreviewImage(canvas.toDataURL());
    }
  };

  // 2. Add New Element (Text, Shape, etc.)
  const addElement = (e) => {
    if (!previewImage || activeTool === "sign" || activeTool === "image") return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newEl = {
      id: Date.now(),
      type: activeTool,
      x: x - 50,
      y: y - 10,
      content: activeTool === "text" ? "Type here..." : "",
    };

    setElements([...elements, newEl]);
  };

  // 3. Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (r) => {
      setElements([...elements, { id: Date.now(), type: "image", x: 100, y: 100, content: r.target.result }]);
    };
    reader.readAsDataURL(file);
  };

  // 4. Save & Download PDF
  const savePdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const page = pdfDoc.getPages()[0];
      const { width, height } = page.getSize();

      const displayWidth = 650; 
      const displayHeight = 850;

      for (const el of elements) {
        const pdfX = (el.x / displayWidth) * width;
        const pdfY = height - (el.y / displayHeight) * height - 20;

        if (el.type === "text") {
          page.drawText(el.content, { x: pdfX, y: pdfY, size: 14, color: rgb(0, 0, 0) });
        } else if (el.type === "image" || el.type === "sign") {
          const img = el.content.includes("png") ? await pdfDoc.embedPng(el.content) : await pdfDoc.embedJpg(el.content);
          page.drawImage(img, { x: pdfX, y: pdfY - 40, width: 120, height: 60 });
        } else if (el.type === "whiteout") {
          page.drawRectangle({ x: pdfX, y: pdfY, width: 100, height: 25, color: rgb(1, 1, 1) });
        } else if (el.type === "shape") {
          page.drawRectangle({ x: pdfX, y: pdfY, width: 100, height: 60, borderWidth: 2, borderColor: rgb(1, 0, 0) });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Edited_By_SiteNexa.pdf";
      link.click();
    } catch (err) {
      console.error("Error saving PDF:", err);
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <Helmet><title>Pro PDF Editor | SiteNexa</title></Helmet>

      {/* Toolbar */}
      <div className="max-w-5xl mx-auto sticky top-6 z-50 bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-3 mb-10 border border-white flex flex-wrap gap-2 justify-center">
        {[
          { id: 'text', icon: <Type size={18}/>, label: 'Text' },
          { id: 'image', icon: <ImageIcon size={18}/>, label: 'Image' },
          { id: 'sign', icon: <PenTool size={18}/>, label: 'Sign' },
          { id: 'whiteout', icon: <Eraser size={18}/>, label: 'Eraser' },
          { id: 'shape', icon: <Square size={18}/>, label: 'Shape' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTool(t.id);
              if (t.id === "image") imageInput.current.click();
              if (t.id === "sign") setShowSignModal(true);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTool === t.id ? "bg-blue-600 text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
        <div className="w-[1px] bg-slate-200 mx-2 h-10" />
        <button onClick={() => setElements([])} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Undo size={20}/></button>
      </div>

      <input type="file" ref={imageInput} className="hidden" accept="image/*" onChange={handleImageUpload} />

      {/* Editor Area */}
      <div className="flex flex-col items-center">
        {!file ? (
          <div 
            onClick={() => fileInput.current.click()}
            className="group border-4 border-dashed border-slate-300 rounded-[40px] p-20 text-center bg-white cursor-pointer hover:border-blue-500 transition-all shadow-sm"
          >
            <input type="file" ref={fileInput} className="hidden" accept="application/pdf" onChange={handleUpload} />
            <UploadCloud className="mx-auto mb-6 text-slate-300 group-hover:text-blue-500 transition-colors" size={80} />
            <h2 className="text-3xl font-black text-slate-700">Drop your PDF here</h2>
            <p className="text-slate-400 mt-2 font-medium">Click to browse from your computer</p>
          </div>
        ) : (
          <div 
            ref={containerRef}
            className="relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-[12px] border-white bg-white rounded-sm overflow-visible"
            style={{ width: 650, height: 850 }}
            onClick={addElement}
          >
            <img src={previewImage} alt="PDF Preview" className="w-full h-full object-contain pointer-events-none" />
            
            {elements.map(el => (
              <Draggable 
                key={el.id} 
                bounds="parent" 
                defaultPosition={{ x: el.x, y: el.y }}
                onStop={(e, data) => setElements(elements.map(item => item.id === el.id ? { ...item, x: data.x, y: data.y } : item))}
              >
                <div className="absolute z-50 group cursor-move touch-none">
                  {el.type === "text" && (
                    <input 
                      autoFocus
                      className="bg-blue-50/80 border border-blue-200 rounded px-2 py-1 outline-none text-blue-900 font-medium shadow-sm"
                      value={el.content}
                      onChange={(e) => setElements(elements.map(item => item.id === el.id ? { ...item, content: e.target.value } : item))}
                    />
                  )}
                  {el.type === "whiteout" && <div className="bg-white border w-32 h-8 shadow-sm" />}
                  {el.type === "shape" && <div className="border-2 border-red-500 w-32 h-20" />}
                  {(el.type === "image" || el.type === "sign") && (
                    <img src={el.content} alt="element" className="w-40 select-none shadow-md rounded" draggable={false} />
                  )}
                  <button 
                    onClick={() => setElements(elements.filter(i => i.id !== el.id))}
                    className="absolute -top-3 -right-3 hidden group-hover:flex bg-red-500 text-white rounded-full p-1 shadow-lg"
                  ><X size={12}/></button>
                </div>
              </Draggable>
            ))}
          </div>
        )}

        {file && (
          <button 
            onClick={savePdf}
            disabled={isProcessing}
            className="mt-12 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
          >
            <Download size={24}/>
            {isProcessing ? "PROCESSING..." : "FINISH & DOWNLOAD"}
          </button>
        )}
      </div>

      {/* Signature Modal */}
      {showSignModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800">Add Signature</h3>
              <button onClick={() => setShowSignModal(false)} className="text-slate-400 hover:text-red-500"><X/></button>
            </div>
            <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl overflow-hidden mb-6">
              <SignatureCanvas ref={sigCanvas} canvasProps={{ width: 350, height: 180, className: 'sigCanvas' }} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => sigCanvas.current.clear()} className="flex-1 py-4 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors">CLEAR</button>
              <button 
                onClick={() => {
                  if (sigCanvas.current.isEmpty()) return;
                  const data = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
                  setElements([...elements, { id: Date.now(), type: 'sign', x: 150, y: 150, content: data }]);
                  setShowSignModal(false);
                }}
                className="flex-[2] py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
              >USE SIGNATURE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfEditor;