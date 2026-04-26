import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, QrCode, Info, ChevronDown, Settings2, Maximize, Palette, Image as ImageIcon, Trash2, Wifi, Type, Link as LinkIcon, Share2 } from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const QrGenerator = () => {
    const [mode, setMode] = useState("url");
    const [text, setText] = useState("https://GOOGIZ.com");
    const [wifi, setWifi] = useState({ ssid: "", password: "", encryption: "WPA" });
    const [size, setSize] = useState(512);
    const [level, setLevel] = useState("H");
    const [fgColor, setFgColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [logo, setLogo] = useState(null);
    const [includeMargin, ] = useState(true);
    const [openFAQ, setOpenFAQ] = useState(false);
    const qrRef = useRef();

    const theme = {
        primary: "emerald-600",
        primaryHover: "emerald-700",
        bgLight: "bg-emerald-50",
        textLight: "text-emerald-600",
        borderLight: "border-emerald-100",
    };

    const getQrValue = () => {
        if (mode === "wifi") {
            return `WIFI:S:${wifi.ssid};T:${wifi.encryption};P:${wifi.password};;`;
        }
        return text;
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogo(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const downloadQRCode = (format) => {
        const canvas = qrRef.current.querySelector("canvas");
        if (!canvas) return;
        const url = canvas.toDataURL(`image/${format}`);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = `GOOGIZ-qr.${format}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const faqs = [
        { q: "What are Error Correction Levels?", a: "L (7%), M (15%), Q (25%), H (30%). Higher levels allow the QR to be readable even if damaged or covered by a logo." },
        { q: "How to add a logo?", a: "Upload your icon using the 'Add Logo' button. We recommend using High (H) correction level when adding logos." },
        { q: "Can I use WiFi QR?", a: "Yes, select WiFi mode and enter details. Scanners will automatically connect to the network." }
    ];

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 bg-[#fcfcfd]">
            <div className="max-w-5xl mx-auto mb-6">
                
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-12 h-12 ${theme.bgLight} rounded-2xl mb-3`}>
                        <QrCode size={24} className={theme.textLight} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1 tracking-tight">QR Code Generator</h1>
                    <p className="text-gray-500 font-medium text-xs">Professional QR codes with custom variants.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm gap-1">
                            {[
                                { id: "url", icon: <LinkIcon size={14}/>, label: "URL/Text" },
                                { id: "wifi", icon: <Wifi size={14}/>, label: "WiFi" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setMode(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${mode === tab.id ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className={`bg-white rounded-3xl border ${theme.borderLight} shadow-sm p-6 space-y-6`}>
                            {mode === "url" ? (
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Content</label>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Enter your URL or message here..."
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium min-h-[100px] resize-none"
                                    />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Network Name (SSID)</label>
                                        <input type="text" value={wifi.ssid} onChange={(e) => setWifi({...wifi, ssid: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Password</label>
                                        <input type="password" value={wifi.password} onChange={(e) => setWifi({...wifi, password: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Security</label>
                                        <select value={wifi.encryption} onChange={(e) => setWifi({...wifi, encryption: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-bold">
                                            <option value="WPA">WPA/WPA2</option>
                                            <option value="WEP">WEP</option>
                                            <option value="nopass">None</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block items-center gap-1"><Palette size={12}/> Colors</label>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border-2 border-gray-50 bg-white" />
                                            <p className="text-[8px] text-center font-bold text-gray-400 mt-1">Dots</p>
                                        </div>
                                        <div className="flex-1">
                                            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border-2 border-gray-50 bg-white" />
                                            <p className="text-[8px] text-center font-bold text-gray-400 mt-1">BG</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2  flex items-center gap-1"><ImageIcon size={12}/> Branding</label>
                                    <div className="flex gap-2">
                                        <label className="flex-1 flex items-center justify-center h-10 bg-emerald-50 text-emerald-600 border border-dashed border-emerald-200 rounded-xl cursor-pointer hover:bg-emerald-100 transition-colors">
                                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                            <span className="text-[10px] font-black uppercase">Logo</span>
                                        </label>
                                        {logo && (
                                            <button onClick={() => setLogo(null)} className="p-2.5 text-rose-500 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Resolution</label>
                                    <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none">
                                        <option value={512}>512 x 512 (Standard)</option>
                                        <option value={1024}>1024 x 1024 (HD)</option>
                                        <option value={2048}>2048 x 2048 (Print)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Precision</label>
                                    <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none">
                                        <option value="L">L - 7% Recovery</option>
                                        <option value="M">M - 15% Recovery</option>
                                        <option value="Q">Q - 25% Recovery</option>
                                        <option value="H">H - 30% Recovery</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <div className={`bg-white rounded-3xl border ${theme.borderLight} shadow-sm p-8 flex flex-col items-center sticky top-24`}>
                            <div className={`relative p-8 ${theme.bgLight} rounded-[2rem] border-2 border-dashed ${theme.borderLight} w-full aspect-square flex items-center justify-center shadow-inner`} ref={qrRef}>
                                <QRCodeCanvas 
                                    value={getQrValue() || " "} 
                                    size={size > 1024 ? 1024 : size}
                                    style={{ width: "100%", height: "auto", maxWidth: "260px" }}
                                    bgColor={bgColor}
                                    fgColor={fgColor}
                                    level={level}
                                    includeMargin={includeMargin}
                                    imageSettings={logo ? {
                                        src: logo,
                                        height: 50,
                                        width: 50,
                                        excavate: true,
                                    } : undefined}
                                />
                                <div className="absolute -top-3 bg-white px-4 py-1.5 rounded-full text-[10px] font-black text-emerald-600 border border-emerald-100 shadow-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> LIVE PREVIEW
                                </div>
                            </div>

                            <div className="w-full space-y-3 mt-8">
                                <button
                                    onClick={() => downloadQRCode("png")}
                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-100 active:scale-[0.98]"
                                >
                                    <Download size={20} /> DOWNLOAD PNG
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => downloadQRCode("jpeg")} className="py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-xs transition-colors border border-gray-100 uppercase tracking-tight">Save as JPG</button>
                                    <button onClick={() => window.print()} className="py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-xs transition-colors border border-gray-100 uppercase tracking-tight">Print Code</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`bg-white border ${theme.borderLight} rounded-3xl overflow-hidden my-12`}>
                    <button 
                        onClick={() => setOpenFAQ(!openFAQ)}
                        className={`w-full flex items-center justify-between p-6 text-left font-black text-sm uppercase tracking-[0.2em] ${theme.textLight}`}
                    >
                        <span className="flex items-center gap-3"><Info size={20}/> Technical Guide</span>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFAQ ? 'rotate-180' : ''}`} />
                    </button>
                    {openFAQ && (
                        <div className={`px-8 pb-8 space-y-6 border-t ${theme.borderLight} pt-6`}>
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-gray-50/50 p-4 rounded-2xl">
                                    <p className="font-black text-gray-800 text-xs mb-2 flex items-center gap-2 underline decoration-emerald-200 underline-offset-4">{faq.q}</p>
                                    <p className="text-gray-500 text-xs leading-relaxed font-medium">{faq.a}</p>
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

export default QrGenerator;