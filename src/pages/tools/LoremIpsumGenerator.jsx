import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { LoremIpsum } from "lorem-ipsum";
import { 
  FileText, Copy, Settings, CheckCircle2, ChevronDown, ListCheck, RefreshCw 
} from 'lucide-react';
import RelatedTools from "../../components/RelatedTools";

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState("paragraphs");
  const [addTags, setAddTags] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [copyStatus, setCopyStatus] = useState(false);

  // Memoized configuration to avoid re-creation on every render
  const lorem = new LoremIpsum({
    sentencesPerParagraph: { max: 8, min: 4 },
    wordsPerSentence: { max: 16, min: 4 }
  });

  const generateText = useCallback(() => {
    let text = "";
    const numCount = parseInt(count, 10);

    if (isNaN(numCount) || numCount <= 0) {
       setGeneratedText("Please enter a valid number.");
       return;
    }

    if (type === "paragraphs") {
      text = lorem.generateParagraphs(numCount);
      if (addTags) {
        text = text.split("\n").map(p => `<p>${p}</p>`).join("\n");
      }
    } else if (type === "sentences") {
      text = lorem.generateSentences(numCount);
      if (addTags) text = `<span>${text}</span>`;
    } else if (type === "words") {
      text = lorem.generateWords(numCount);
      if (addTags) text = `<b>${text}</b>`;
    }

    setGeneratedText(text);
  }, [count, type, addTags]);

  // Fix for: Calling setState synchronously within an effect
  useEffect(() => {
    const timer = setTimeout(() => {
      generateText();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
      <Helmet>
        <title>Lorem Ipsum Generator | GOOGIZ</title>
      </Helmet>

      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-5xl font-black text-slate-900 mb-4 flex items-center justify-center gap-3">
          <FileText className="text-emerald-600" size={48} /> Lorem Ipsum
        </h1>
        <p className="text-slate-500 font-medium tracking-tight">Professional placeholder text generator for your creative projects.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings Panel (Left) */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-6 lg:col-span-1 h-fit">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest mb-6">
            <Settings size={20} className="text-emerald-600"/> Configuration
          </h3>

          <div>
            <label className="text-[11px] font-black uppercase text-slate-400 mb-2.5 block ml-1 tracking-widest">Amount to Generate</label>
            <input 
              type="number" 
              value={count} 
              min="1"
              onChange={(e) => setCount(e.target.value)} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] font-black uppercase text-slate-400 mb-2.5 block ml-1 tracking-widest">Select Type</label>
            <div className="relative">
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)} 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-700 focus:outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
              >
                <option value="paragraphs">Paragraphs</option>
                <option value="sentences">Sentences</option>
                <option value="words">Words</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20}/>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
            <label className="text-sm font-bold text-emerald-900 flex items-center gap-2 cursor-pointer">
              <ListCheck size={18} className="text-emerald-600"/> Include HTML Tags?
            </label>
            <input 
              type="checkbox" 
              checked={addTags}
              onChange={(e) => setAddTags(e.target.checked)} 
              className="w-6 h-6 rounded-lg text-emerald-600 border-emerald-200 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
            />
          </div>

          <button 
            onClick={generateText}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} /> Regenerate
          </button>
        </div>

        {/* Results Panel (Right) */}
        <div className="lg:col-span-2">
          <div className="bg-[#0f172a] border border-slate-800 rounded-[3rem] p-8 shadow-2xl h-[550px] flex flex-col relative overflow-hidden group">
            
            {generatedText && (
               <button 
                  onClick={copyToClipboard}
                  className={`absolute right-8 top-8 p-3.5 rounded-2xl transition-all z-20 ${copyStatus ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/10 text-white hover:bg-emerald-600 shadow-xl'}`}
                >
                  {copyStatus ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                </button>
            )}

            <h3 className="text-white/20 uppercase text-[10px] font-black tracking-widest mb-8 text-center">Output Preview</h3>
            
            {generatedText ? (
                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar text-emerald-50/90 font-mono text-base leading-relaxed break-words whitespace-pre-wrap selection:bg-emerald-500/30">
                  {generatedText}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-white/5 text-center">
                  <FileText size={140} strokeWidth={1} />
                  <p className="mt-4 font-bold uppercase tracking-widest text-xs opacity-50">Click Regenerate to begin</p>
                </div>
            )}
          </div>
        </div>
      </div>

      <RelatedTools categoryId="utility" />

      {/* Custom Styles for Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
}