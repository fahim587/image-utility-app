import React, { useState } from "react";
import { Copy, Check, Trash2, Hash, Unlock, AlertCircle, Info, ChevronDown } from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const Base64Decoder = () => {
    const [inputText, setInputText] = useState("");
    const [decodedText, setDecodedText] = useState("");
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [openFAQ, setOpenFAQ] = useState(false);

    const theme = {
        primary: "emerald-600",
        bgLight: "bg-emerald-50",
        textLight: "text-emerald-600",
        borderLight: "border-emerald-100",
    };

    const handleDecode = (text) => {
        setInputText(text);
        if (!text.trim()) {
            setDecodedText("");
            setError(false);
            return;
        }

        try {
            // Base64 থেকে টেক্সটে রূপান্তর (UTF-8 সাপোর্ট সহ)
            const decoded = decodeURIComponent(escape(atob(text)));
            setDecodedText(decoded);
            setError(false);
        } catch  {
            setDecodedText("");
            setError(true);
        }
    };

    const handleCopy = () => {
        if (!decodedText) return;
        navigator.clipboard.writeText(decodedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInputText("");
        setDecodedText("");
        setError(false);
    };

    const faqs = [
        { q: "What is Base64 Decoding?", a: "Base64 decoding is the process of converting a Base64 encoded string back into its original textual or binary format." },
        { q: "Why is my code not decoding?", a: "Base64 strings must have a specific format. If characters are missing or if it contains non-Base64 characters, the decoder will show an error." },
        { q: "Does it support Bengali/Special Characters?", a: "Yes, this decoder uses UTF-8 decoding logic, so it will correctly display Bengali and other international characters." }
    ];

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 bg-[#fcfcfd]">
            <div className="max-w-5xl mx-auto mb-6">
                
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-12 h-12 ${theme.bgLight} rounded-2xl mb-3`}>
                        <Unlock size={24} className={theme.textLight} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1 tracking-tight">Base64 Decoder</h1>
                    <p className="text-gray-500 font-medium text-xs">Decode Base64 strings back into human-readable text.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Input Section */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base64 Input</label>
                            <button onClick={handleClear} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <textarea
                            value={inputText}
                            onChange={(e) => handleDecode(e.target.value)}
                            placeholder="Paste your Base64 string here..."
                            className={`w-full h-64 p-4 bg-gray-50 border ${error ? 'border-rose-200 focus:ring-rose-500' : 'border-gray-100 focus:ring-emerald-500'} rounded-2xl outline-none text-sm font-mono resize-none transition-all`}
                        />
                        {error && (
                            <div className="flex items-center gap-2 text-rose-500 text-[10px] font-bold px-1 uppercase tracking-tighter">
                                <AlertCircle size={12} /> Invalid Base64 String
                            </div>
                        )}
                    </div>

                    {/* Output Section */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4 relative">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Decoded Output</label>
                            <button
                                onClick={handleCopy}
                                disabled={!decodedText}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${copied ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'}`}
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Text'}
                            </button>
                        </div>
                        <textarea
                            readOnly
                            value={decodedText}
                            placeholder="Your decoded text will appear here..."
                            className="w-full h-64 p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl outline-none text-sm font-medium text-emerald-900 resize-none cursor-default"
                        />
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 px-1 uppercase">
                            <span>Output Length: {decodedText.length}</span>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className={`bg-white border ${theme.borderLight} rounded-3xl overflow-hidden my-10`}>
                    <button 
                        onClick={() => setOpenFAQ(!openFAQ)}
                        className={`w-full flex items-center justify-between p-5 text-left font-black text-xs uppercase tracking-widest ${theme.textLight}`}
                    >
                        <span className="flex items-center gap-2"><Info size={16}/> Decoder Info</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openFAQ ? 'rotate-180' : ''}`} />
                    </button>
                    {openFAQ && (
                        <div className={`px-8 pb-8 space-y-6 border-t ${theme.borderLight} pt-6`}>
                            {faqs.map((faq, index) => (
                                <div key={index}>
                                    <p className="font-black text-gray-800 text-xs mb-1 uppercase tracking-tight">{faq.q}</p>
                                    <p className="text-gray-500 text-xs leading-relaxed font-medium italic">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <RelatedTools categoryId="utility" />
            </div>
        </div>
    );
};

export default Base64Decoder;