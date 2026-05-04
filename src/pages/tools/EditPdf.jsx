import React, { useState, useRef, useReducer, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import * as pdfjsLib from "pdfjs-dist";
import { Rnd } from "react-rnd";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  Type,
  Highlighter,
  Image as ImageIcon,
  Download,
  Plus,
  Minus,
  UploadCloud,
  Trash2,
  Undo2,
  Redo2,
  MousePointer2,
  Loader2,
  X,
  Settings2,
  ChevronLeft,
  ChevronRight,
  AlignCenter,
  AlignLeft,
  AlignRight,
} from "lucide-react";

// PDF.js Worker Configuration
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// Google Fonts CSS Import
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Roboto:wght@400;700&family=Open+Sans:wght@400;700&family=Lato:wght@400;700&family=Montserrat:wght@400;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const historyReducer = (state, action) => {
  switch (action.type) {
    case "SET_ELEMENTS":
      return {
        past: [...state.past.slice(-20), state.present],
        present: action.payload,
        future: [],
      };
    case "UNDO":
      if (state.past.length === 0) return state;
      return {
        past: state.past.slice(0, -1),
        present: state.past[state.past.length - 1],
        future: [state.present, ...state.future],
      };
    case "REDO":
      if (state.future.length === 0) return state;
      return {
        past: [...state.past, state.present],
        present: state.future[0],
        future: state.future.slice(1),
      };
    default:
      return state;
  }
};

const PdfEditor = () => {
  const [file, setFile] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [scale, setScale] = useState(1.0);
  const [activeTool, setActiveTool] = useState("select");
  const [activeId, setActiveId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const [history, dispatch] = useReducer(historyReducer, {
    past: [],
    present: [],
    future: [],
  });

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || selectedFile.type !== "application/pdf") return;

    setIsLoading(true);
    setFile(selectedFile);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const renderedPages = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        renderedPages.push({
          url: canvas.toDataURL("image/jpeg", 0.95),
          width: viewport.width / 2.5,
          height: viewport.height / 2.5,
        });
      }
      setPdfPages(renderedPages);
      setCurrentPage(1);
    } catch (error) {
      console.error("Rendering Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addElement = (type, customData = {}) => {
    if (!file) return;
    const newEl = {
      id: Date.now(),
      type,
      x: 100,
      y: 100,
      width: type === "text" ? "auto" : 150,
      height: "auto",
      content: customData.content || (type === "text" ? "Enter text here" : ""),
      color: "#000000",
      fontSize: 18,
      fontWeight: "500",
      fontFamily: "'Inter', sans-serif",
      opacity: 1,
      textAlign: "left",
      pageIndex: currentPage - 1,
      ...customData
    };
    dispatch({ type: "SET_ELEMENTS", payload: [...history.present, newEl] });
    setActiveId(newEl.id);
  };

  const updateElement = (id, updates) => {
    const updated = history.present.map(el => el.id === id ? { ...el, ...updates } : el);
    dispatch({ type: "SET_ELEMENTS", payload: updated });
  };

  const downloadPdf = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setActiveId(null); // Hide UI handles before export

    try {
      const doc = new jsPDF({
        orientation: pdfPages[0].width > pdfPages[0].height ? "l" : "p",
        unit: "px",
        format: [pdfPages[0].width, pdfPages[0].height]
      });

      for (let i = 0; i < pdfPages.length; i++) {
        if (i > 0) doc.addPage([pdfPages[i].width, pdfPages[i].height]);
        
        setCurrentPage(i + 1);
        // Wait for state update and re-render
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = await html2canvas(canvasRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: null
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        doc.addImage(imgData, 'JPEG', 0, 0, pdfPages[i].width, pdfPages[i].height);
      }

      doc.save("edited-document.pdf");
    } catch (error) {
      console.error("Download Error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const activeElement = history.present.find(el => el.id === activeId);

  return (
    <div className="flex flex-col h-screen bg-[#F1F5F9] overflow-hidden select-none font-sans">
      <Helmet><title>PDF Editor | Advanced Suite</title></Helmet>

      {/* --- NAVBAR --- */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-[100] shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <ToolbarItem 
              icon={<MousePointer2 size={18}/>} 
              active={activeTool === 'select'} 
              onClick={() => setActiveTool('select')} 
              label="Select"
            />
            <ToolbarItem 
              icon={<Type size={18}/>} 
              onClick={() => { setActiveTool('text'); addElement('text'); }} 
              label="Text"
            />
            <ToolbarItem 
              icon={<Highlighter size={18}/>} 
              onClick={() => { setActiveTool('highlight'); addElement('highlight', { color: '#fbbf2466' }); }} 
              label="Highlight"
            />
            <ToolbarItem 
              icon={<ImageIcon size={18}/>} 
              onClick={() => imageInputRef.current.click()} 
              label="Image"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 border-r pr-4 border-slate-200">
            <button onClick={() => dispatch({ type: "UNDO" })} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500" title="Undo"><Undo2 size={18}/></button>
            <button onClick={() => dispatch({ type: "REDO" })} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500" title="Redo"><Redo2 size={18}/></button>
          </div>
          <button 
            onClick={downloadPdf}
            disabled={!file || isExporting}
            className="bg-rose-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-rose-100 hover:bg-rose-600 disabled:opacity-50 flex items-center gap-2 transition-all active:scale-95"
          >
            {isExporting ? <Loader2 className="animate-spin" size={18}/> : <Download size={18}/>} 
            {isExporting ? "Exporting..." : "Download PDF"}
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        {/* --- THUMBNAILS --- */}
        <aside className="w-52 bg-white border-r border-slate-200 p-4 hidden md:flex flex-col gap-4 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Page Preview</p>
          {pdfPages.map((page, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentPage(idx + 1)}
              className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${currentPage === idx + 1 ? 'border-rose-500 bg-rose-50' : 'border-transparent hover:border-slate-200'}`}
            >
              <img src={page.url} className="w-full" alt={`Page ${idx + 1}`} />
              <div className="absolute bottom-1 right-1 bg-slate-900/70 text-white text-[9px] px-1.5 py-0.5 rounded-md">{idx + 1}</div>
            </div>
          ))}
        </aside>

        {/* --- CANVAS --- */}
        <main className="flex-1 overflow-auto p-10 flex flex-col items-center relative custom-scrollbar">
          {!file ? (
            <div 
              className="m-auto max-w-lg w-full bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200 hover:border-rose-400 transition-all cursor-pointer group shadow-xl"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-6 group-hover:scale-110 transition-transform">
                <UploadCloud size={40}/>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Your PDF</h2>
              <p className="text-slate-400 text-sm">Drag & drop or click to browse</p>
              <input type="file" ref={fileInputRef} hidden accept="application/pdf" onChange={handleFileUpload} />
            </div>
          ) : (
            <div 
              ref={canvasRef}
              className="relative bg-white shadow-2xl transition-all duration-100 origin-top"
              style={{ 
                width: pdfPages[currentPage-1]?.width * scale, 
                height: pdfPages[currentPage-1]?.height * scale,
              }}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50 rounded-lg">
                  <Loader2 className="animate-spin text-rose-500" size={40}/>
                </div>
              )}
              
              <img src={pdfPages[currentPage-1]?.url} className="w-full h-full pointer-events-none select-none" alt="" />
              
              <div className="absolute inset-0 z-20">
                {history.present.filter(el => el.pageIndex === currentPage - 1).map((el) => (
                  <Rnd
                    key={el.id}
                    size={{ 
                      width: el.width === "auto" ? "auto" : el.width * scale, 
                      height: el.height === "auto" ? "auto" : el.height * scale 
                    }}
                    position={{ x: el.x * scale, y: el.y * scale }}
                    onDragStop={(e, d) => updateElement(el.id, { x: d.x/scale, y: d.y/scale })}
                    onResizeStop={(e, d, ref, delta, pos) => updateElement(el.id, { width: ref.offsetWidth/scale, height: ref.offsetHeight/scale, ...pos })}
                    onMouseDown={() => setActiveId(el.id)}
                    dragGrid={[1, 1]}
                    bounds="parent"
                    enableResizing={el.type !== 'text'}
                    className={`z-30 group ${activeId === el.id ? 'ring-2 ring-rose-500' : ''}`}
                  >
                    <div className="w-full h-full relative" style={{ opacity: el.opacity }}>
                      {el.type === 'text' && (
                        <div 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateElement(el.id, { content: e.target.innerText })}
                          className="outline-none px-2 py-1 whitespace-nowrap min-w-[20px] cursor-text"
                          style={{ 
                            fontSize: `${el.fontSize * scale}px`, 
                            color: el.color, 
                            fontWeight: el.fontWeight,
                            fontFamily: el.fontFamily,
                            textAlign: el.textAlign
                          }}
                        >
                          {el.content}
                        </div>
                      )}
                      {el.type === 'highlight' && <div className="w-full h-full" style={{ backgroundColor: el.color }}></div>}
                      {el.type === 'image' && <img src={el.content} className="w-full h-full object-contain pointer-events-none" alt="" />}
                      
                      {activeId === el.id && !isExporting && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch({ type: "SET_ELEMENTS", payload: history.present.filter(e => e.id !== el.id) });
                            setActiveId(null);
                          }}
                          className="absolute -top-3 -right-3 bg-slate-900 text-white p-1 rounded-full shadow-lg hover:bg-rose-500 transition-colors z-50"
                        >
                          <X size={12}/>
                        </button>
                      )}
                    </div>
                  </Rnd>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* --- PROPERTIES PANEL --- */}
        <AnimatePresence>
          {activeElement && (
            <motion.aside 
              initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }}
              className="w-72 bg-white border-l border-slate-200 p-6 z-[110] shadow-xl overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
                  <Settings2 size={16} className="text-rose-500"/> Settings
                </h3>
                <button onClick={() => setActiveId(null)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>

              <div className="space-y-8">
                {/* FONT FAMILY SELECTOR */}
                {activeElement.type === 'text' && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Font Family</label>
                    <select 
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                      value={activeElement.fontFamily}
                      onChange={(e) => updateElement(activeId, { fontFamily: e.target.value })}
                    >
                      <option value="'Inter', sans-serif">Inter (Default)</option>
                      <option value="'Roboto', sans-serif">Roboto</option>
                      <option value="'Open Sans', sans-serif">Open Sans</option>
                      <option value="'Montserrat', sans-serif">Montserrat</option>
                      <option value="'Lato', sans-serif">Lato</option>
                    </select>
                  </div>
                )}

                {/* COLOR PICKER */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Appearance</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={activeElement.color.substring(0,7)} 
                      onChange={(e) => updateElement(activeId, { color: activeElement.type === 'highlight' ? e.target.value + '66' : e.target.value })}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-xs font-mono text-slate-500">{activeElement.color.toUpperCase()}</span>
                  </div>
                </div>

                {/* OPACITY SLIDER */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 flex justify-between">
                    Opacity <span>{Math.round(activeElement.opacity * 100)}%</span>
                  </label>
                  <input 
                    type="range" min="0.1" max="1" step="0.1"
                    className="w-full accent-rose-500"
                    value={activeElement.opacity}
                    onChange={(e) => updateElement(activeId, { opacity: parseFloat(e.target.value) })}
                  />
                </div>

                {activeElement.type === 'text' && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 flex justify-between">
                        Font Size <span>{activeElement.fontSize}px</span>
                      </label>
                      <input 
                        type="range" min="10" max="100" 
                        className="w-full accent-rose-500"
                        value={activeElement.fontSize}
                        onChange={(e) => updateElement(activeId, { fontSize: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => updateElement(activeId, { textAlign: 'left' })} className={`p-2 flex-1 rounded-lg border ${activeElement.textAlign === 'left' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500'}`}><AlignLeft size={16} className="mx-auto" /></button>
                      <button onClick={() => updateElement(activeId, { textAlign: 'center' })} className={`p-2 flex-1 rounded-lg border ${activeElement.textAlign === 'center' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500'}`}><AlignCenter size={16} className="mx-auto" /></button>
                      <button onClick={() => updateElement(activeId, { textAlign: 'right' })} className={`p-2 flex-1 rounded-lg border ${activeElement.textAlign === 'right' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500'}`}><AlignRight size={16} className="mx-auto" /></button>
                    </div>

                    <button 
                      onClick={() => updateElement(activeId, { fontWeight: activeElement.fontWeight === 'bold' ? 'normal' : 'bold' })}
                      className={`w-full py-2 rounded-lg border text-sm font-bold ${activeElement.fontWeight === 'bold' ? 'bg-slate-900 text-white' : 'bg-white'}`}
                    >
                      Bold Text
                    </button>
                  </div>
                )}

                <button 
                  onClick={() => { dispatch({ type: "SET_ELEMENTS", payload: history.present.filter(e => e.id !== activeId) }); setActiveId(null); }}
                  className="w-full py-3 bg-rose-50 text-rose-500 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16}/> Delete Element
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* --- FOOTER STATUS --- */}
      {file && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-8 z-[120]">
          <div className="flex items-center gap-4 border-r border-white/20 pr-6">
            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} className="hover:text-rose-400"><ChevronLeft size={20}/></button>
            <span className="text-xs font-bold">Page {currentPage} of {pdfPages.length}</span>
            <button onClick={() => setCurrentPage(p => Math.min(pdfPages.length, p+1))} className="hover:text-rose-400"><ChevronRight size={20}/></button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setScale(s => Math.max(0.5, s-0.1))}><Minus size={18}/></button>
            <span className="text-xs font-bold w-10 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(2, s+0.1))}><Plus size={18}/></button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input 
        type="file" ref={imageInputRef} hidden accept="image/*" 
        onChange={(e) => {
          const f = e.target.files[0];
          if(f) {
            const r = new FileReader();
            r.onload = (ev) => addElement("image", { content: ev.target.result });
            r.readAsDataURL(f);
          }
        }} 
      />
    </div>
  );
};

const ToolbarItem = ({ icon, label, onClick, active }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${active ? 'bg-white text-rose-500 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'}`}
  >
    {icon}
    <span className="text-xs">{label}</span>
  </button>
);

export default PdfEditor;