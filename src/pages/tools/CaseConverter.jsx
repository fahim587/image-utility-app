import React, { useState } from "react";
import { Copy, Trash2, CheckCircle2, ChevronDown, Type, Info } from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const CaseConverter = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(false);

  // Utility Category Theme (Green/Emerald)
  const theme = {
    primary: "emerald-600",
    primaryHover: "emerald-700",
    bgLight: "bg-emerald-50",
    textLight: "text-emerald-600",
    borderLight: "border-emerald-100",
    shadow: "shadow-emerald-100"
  };

  const transformText = (type) => {
    if (!text) return;
    let newText = "";
    switch (type) {
      case "upper": newText = text.toUpperCase(); break;
      case "lower": newText = text.toLowerCase(); break;
      case "sentence": newText = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()); break;
      case "title": newText = text.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '); break;
      default: newText = text;
    }
    setText(newText);
  };

  const faqs = [
    { q: "What is an Online Case Converter?", a: "It's a free web tool that changes the capitalization of your text instantly. You can convert to UPPERCASE, lowercase, Sentence case, or Title Case with one click." },
    { q: "How do I use this Text Case Tool?", a: "Simply paste your text into the box, click the format button you need (like 'Title Case'), and then click 'Copy' to get your formatted text." },
    { q: "Is my data safe with this converter?", a: "Yes, 100%. Our tool works entirely in your browser. We never store or transmit your text to any server." }
  ];

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-8 bg-[#fcfcfd]">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-12 h-12 ${theme.bgLight} rounded-2xl mb-3`}>
            <Type size={24} className={theme.textLight} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">
            Online Text Case Converter
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            The simplest way to change text case: Uppercase, Lowercase, Title Case & more.
          </p>
        </div>

        {/* Main Interface Card */}
        <div className={`bg-white rounded-3xl border ${theme.borderLight} shadow-sm overflow-hidden mb-4 transition-all hover:shadow-md`}>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your content here..."
              className={`w-full h-56 md:h-64 p-6 outline-none text-gray-700 text-lg leading-relaxed resize-none border-b ${theme.borderLight} placeholder:text-gray-300 focus:bg-emerald-50/20 transition-all`}
            />
            {/* Stats Badge */}
            <div className={`absolute top-4 right-6 flex gap-3 text-[10px] font-bold ${theme.textLight} uppercase tracking-widest bg-white/80 px-2 py-1 rounded-lg backdrop-blur-sm border ${theme.borderLight}`}>
              <span>Words: {text.trim() ? text.trim().split(/\s+/).length : 0}</span>
              <span>Chars: {text.length}</span>
            </div>
          </div>

          <div className="p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => transformText("upper")} className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-sm">UPPERCASE</button>
              <button onClick={() => transformText("lower")} className={`px-4 py-2 ${theme.bgLight} ${theme.textLight} rounded-xl text-xs font-bold hover:opacity-80 transition-all`}>lowercase</button>
              <button onClick={() => transformText("sentence")} className={`px-4 py-2 ${theme.bgLight} ${theme.textLight} rounded-xl text-xs font-bold hover:opacity-80 transition-all`}>Sentence</button>
              <button onClick={() => transformText("title")} className={`px-4 py-2 ${theme.bgLight} ${theme.textLight} rounded-xl text-xs font-bold hover:opacity-80 transition-all`}>Title Case</button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => { window.navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm shadow-lg transition-all ${copied ? 'bg-green-500 text-white' : `${theme.primary} bg-emerald-600 text-white hover:${theme.primaryHover} shadow-emerald-100`}`}
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={() => setText("")} className="p-2 text-gray-300 hover:text-rose-500 transition-colors" title="Clear All">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Dropdown */}
        <div className="mb-8">
          <div className={`bg-white border ${theme.borderLight} rounded-2xl overflow-hidden`}>
            <button 
              onClick={() => setOpenFAQ(!openFAQ)}
              className={`w-full flex items-center justify-between p-4 text-left font-bold text-xs hover:${theme.bgLight} transition-colors uppercase tracking-wider ${theme.textLight}`}
            >
              <span className="flex items-center gap-2"><Info size={16} className={theme.textLight}/> Frequently Asked Questions</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openFAQ ? 'rotate-180' : ''}`} />
            </button>
            {openFAQ && (
              <div className={`px-4 pb-4 space-y-4 border-t ${theme.borderLight} pt-4`}>
                {faqs.map((faq, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-bold text-gray-700 mb-1">{faq.q}</p>
                    <p className="text-gray-500 text-xs leading-relaxed italic">{faq.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Tools Area */}
        <div className={`pt-6 border-t ${theme.borderLight}`}>
           <RelatedTools categoryId="utility" />
        </div>
      </div>
    </div>
  );
};

export default CaseConverter;