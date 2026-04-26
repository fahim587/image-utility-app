import React, { useState } from "react";
import { Copy, Check, Trash2, Hash, ArrowRight, Info, ChevronDown } from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const Base64Encoder = () => {
    const [inputText, setInputText] = useState("");
    const [encodedText, setEncodedText] = useState("");
    const [copied, setCopied] = useState(false);
    const [openFAQ, setOpenFAQ] = useState(false);

    const theme = {
        primary: "emerald-600",
        bgLight: "bg-emerald-50",
        textLight: "text-emerald-600",
        borderLight: "border-emerald-100",
    };

    const handleEncode = (text) => {
        setInputText(text);
        try {
            // btoa() ব্যবহার করে টেক্সটকে Base64 এ রূপান্তর
            const encoded = btoa(unescape(encodeURIComponent(text)));
            setEncodedText(encoded);
        } catch {
            setEncodedText("");
        }
    };

    const handleCopy = () => {
        if (!encodedText) return;
        navigator.clipboard.writeText(encodedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInputText("");
        setEncodedText("");
    };

    const faqs = [
        { q: "What is Base64 Encoding?", a: "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format by translating it into a radix-64 representation." },
        { q: "Is Base64 encryption?", a: "No, Base64 is an encoding method, not encryption. It can be easily decoded by anyone and should not be used for security purposes." },
        { q: "Why use Base64?", a: "It is commonly used when there is a need to encode binary data that needs to be stored and transferred over media that are designed to deal with textual data." }
    ];

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 bg-[#fcfcfd]">
            <div className="max-w-5xl mx-auto mb-6">
                
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-12 h-12 ${theme.bgLight} rounded-2xl mb-3`}>
                        <Hash size={24} className={theme.textLight} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1 tracking-tight">Base64 Encoder</h1>
                    <p className="text-gray-500 font-medium text-xs">Encode your text data into Base64 format instantly.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Input Section */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Input Text</label>
                            <button onClick={handleClear} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <textarea
                            value={inputText}
                            onChange={(e) => handleEncode(e.target.value)}
                            placeholder="Type or paste your text here..."
                            className="w-full h-64 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium resize-none transition-all"
                        />
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 px-1 uppercase">
                            <span>Characters: {inputText.length}</span>
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4 relative">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base64 Output</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCopy}
                                    disabled={!encodedText}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${copied ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Result'}
                                </button>
                            </div>
                        </div>
                        <div className="relative group">
                            <textarea
                                readOnly
                                value={encodedText}
                                placeholder="Base64 result will appear here..."
                                className="w-full h-64 p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl outline-none text-sm font-mono text-emerald-900 resize-none cursor-default"
                            />
                            {encodedText && (
                                <div className="absolute top-4 right-4 animate-pulse">
                                    <ArrowRight size={20} className="text-emerald-200" />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 px-1 uppercase">
                            <span>Encoded Length: {encodedText.length}</span>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className={`bg-white border ${theme.borderLight} rounded-3xl overflow-hidden my-10`}>
                    <button 
                        onClick={() => setOpenFAQ(!openFAQ)}
                        className={`w-full flex items-center justify-between p-5 text-left font-black text-xs uppercase tracking-widest ${theme.textLight}`}
                    >
                        <span className="flex items-center gap-2"><Info size={16}/> Understanding Base64</span>
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

export default Base64Encoder;