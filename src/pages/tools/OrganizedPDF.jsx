import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.min?url";
import { UploadCloud, Download, Trash2, GripVertical, HelpCircle, ChevronDown, LayoutGrid, FileText } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import RelatedTools from "../../components/RelatedTools";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Sortable Item Component
const SortablePage = ({ id, thumb, onDelete, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group bg-white p-3 rounded-2xl border-2 border-slate-100 shadow-sm hover:border-rose-400 transition-all duration-300">
      <div {...attributes} {...listeners} className="absolute top-3 left-3 z-10 p-1.5 bg-white shadow-md rounded-lg cursor-grab active:cursor-grabbing hover:bg-slate-50 text-slate-400 hover:text-rose-500 transition-colors">
        <GripVertical size={16} />
      </div>
      
      <button 
        onClick={() => onDelete(id)} 
        className="absolute top-3 right-3 z-10 p-1.5 bg-rose-50 text-rose-500 shadow-sm rounded-lg hover:bg-rose-500 hover:text-white transition-all duration-300"
      >
        <Trash2 size={16} />
      </button>

      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-slate-50 border border-slate-100 mb-3">
        <img src={thumb} className="w-full h-full object-contain pointer-events-none" alt={`Page ${index + 1}`} />
      </div>
      
      <div className="flex items-center justify-center gap-2">
         <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Page {index + 1}</span>
      </div>
    </div>
  );
};

const OrganizedPdf = () => {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]); 
  const [showHowTo, setShowHowTo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInput = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleUpload = async (e) => {
    const selected = e.target.files[0];
    if (!selected || selected.type !== "application/pdf") return;
    
    setIsProcessing(true);
    setFile(selected);

    try {
      const arrayBuffer = await selected.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const thumbs = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        thumbs.push({ id: `page-${i}-${Date.now()}`, originalIndex: i - 1, thumb: canvas.toDataURL() });
      }
      setPages(thumbs);
    } catch (err) {
      console.error("Error loading PDF:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const deletePage = (id) => {
    setPages(pages.filter((p) => p.id !== id));
  };

  const downloadOrganizedPdf = async () => {
    if (pages.length === 0) return;
    setIsProcessing(true);
    try {
      const originalBuffer = await file.arrayBuffer();
      const originalDoc = await PDFDocument.load(originalBuffer);
      const newDoc = await PDFDocument.create();

      for (const pageObj of pages) {
        const [copiedPage] = await newDoc.copyPages(originalDoc, [pageObj.originalIndex]);
        newDoc.addPage(copiedPage);
      }

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Organized_GOOGIZ_${file.name}`;
      link.click();
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 px-4">
      <Helmet>
        <title>Organize PDF Online - Rearrange, Delete & Manage Pages | GOOGIZ</title>
        <meta name="description" content="Organize your PDF pages easily. Drag to rearrange, delete unnecessary pages, and download your customized PDF for free. No server upload required." />
      </Helmet>

      <div className="max-w-[1400px] mx-auto">
        {/* Header Section with Dropdown Instructions */}
        <div className="mb-10 text-center">
            <h1 className="text-3xl font-black text-slate-800 mb-4 flex items-center justify-center gap-3">
              <LayoutGrid className="text-rose-600" size={32} /> Organize PDF Pages
            </h1>
            
            <button 
                onClick={() => setShowHowTo(!showHowTo)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all text-sm font-bold text-slate-600"
            >
                <HelpCircle size={18} className="text-rose-500" />
                How to organize pages?
                <ChevronDown size={16} className={`transition-transform duration-300 ${showHowTo ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 max-w-2xl mx-auto ${showHowTo ? 'max-h-96 mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl text-left grid md:grid-cols-3 gap-6 text-xs leading-relaxed">
                    <div className="space-y-2">
                        <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center font-black">1</div>
                        <p className="font-bold text-slate-700">Upload PDF</p>
                        <p className="text-slate-500">Select the PDF file you want to organize from your device.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center font-black">2</div>
                        <p className="font-bold text-slate-700">Rearrange & Delete</p>
                        <p className="text-slate-500">Drag pages to change order. Use the trash icon to remove pages.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center font-black">3</div>
                        <p className="font-bold text-slate-700">Save Result</p>
                        <p className="text-slate-500">Click Download to get your new organized PDF instantly.</p>
                    </div>
                </div>
            </div>
        </div>

        {!file ? (
          <div onClick={() => fileInput.current.click()} className="max-w-3xl mx-auto border-4 border-dashed border-rose-100 rounded-[3rem] p-24 text-center cursor-pointer bg-white shadow-2xl hover:border-rose-400 transition-all group">
            <input type="file" ref={fileInput} className="hidden" accept="application/pdf" onChange={handleUpload} />
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                <UploadCloud className="text-rose-600" size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Select PDF File</h2>
            <p className="text-slate-400 font-medium tracking-tight">or drag and drop your PDF here</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toolbar */}
            <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100 gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-slate-100 p-3 rounded-2xl">
                    <FileText className="text-rose-600" />
                </div>
                <div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight leading-tight">{file.name}</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{pages.length} Pages remaining</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => {setFile(null); setPages([]);}} 
                  className="px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={downloadOrganizedPdf} 
                  disabled={isProcessing}
                  className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-rose-100 flex items-center gap-3 hover:bg-rose-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : <><Download size={18} /> Save & Download</>}
                </button>
              </div>
            </div>

            {/* Grid Area */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                <SortableContext items={pages.map((p) => p.id)} strategy={rectSortingStrategy}>
                  {pages.map((page, index) => (
                    <SortablePage key={page.id} id={page.id} thumb={page.thumb} onDelete={deletePage} index={index} />
                  ))}
                </SortableContext>
              </div>
            </DndContext>
            
            {pages.length === 0 && !isProcessing && (
                <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                    <Trash2 size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold">All pages removed. Please upload again.</p>
                </div>
            )}
          </div>
        )}

        {/* SEO Content Section */}
        {!file && (
          <div className="mt-20 grid md:grid-cols-2 gap-12 text-slate-600 max-w-5xl mx-auto px-4">
             <div>
                <h3 className="text-xl font-black text-slate-800 mb-4">Why organize your PDF?</h3>
                <p className="text-sm leading-relaxed">Managing large documents can be tricky. Our tool allows you to visually reorder pages, delete sensitive information, or simply clean up your PDF before sharing it. It's fast, secure, and works entirely in your browser.</p>
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-800 mb-4">Is it secure?</h3>
                <p className="text-sm leading-relaxed">Yes! Unlike other online tools, we don't upload your files to any server. All the processing (sorting and merging) happens locally on your computer using advanced JavaScript libraries.</p>
             </div>
          </div>
        )}

        <div className="mt-28">
          <RelatedTools categoryId="pdf" />
        </div>
      </div>
      
      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-black uppercase tracking-[0.3em] text-xs">Processing PDF</p>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default OrganizedPdf;