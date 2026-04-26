import React, { useState, useRef, useEffect, useMemo } from "react";
import JsBarcode from "jsbarcode";
import { Download, Barcode as BarcodeIcon, Settings2, Maximize, Palette, AlertCircle } from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const BarcodeGenerator = () => {
    const [value, setValue] = useState("123456789012");
    const [format, setFormat] = useState("CODE128");
    const [lineColor, setLineColor] = useState("#000000");
    const [width, setWidth] = useState(2);
    const [height, setHeight] = useState(100);
    const [displayValue, setDisplayValue] = useState(true);
    const barcodeRef = useRef(null);
    const [bgColor, setBgColor] = useState("#ffffff");

    const theme = {
        primary: "emerald-600",
        bgLight: "bg-emerald-50",
        textLight: "text-emerald-600",
        borderLight: "border-emerald-100",
    };

    // Error handling without triggering cascading renders
    const error = useMemo(() => {
        if (!value.trim()) return "Input is required";
        
        // EAN-13 validation logic
        if (format === "EAN13" && !/^\d{13}$/.test(value)) {
            return "EAN-13 requires exactly 13 digits";
        }
        // UPC validation logic
        if (format === "UPC" && !/^\d{12}$/.test(value)) {
            return "UPC requires exactly 12 digits";
        }
        return null;
    }, [value, format]);

    useEffect(() => {
        if (barcodeRef.current && !error) {
            try {
                JsBarcode(barcodeRef.current, value, {
                    format: format,
                    lineColor: lineColor,
                    width: width,
                    height: height,
                    displayValue: displayValue,
                    background: bgColor
                });
            } catch {
                // Silent catch for library specific render issues
            }
        }
    }, [value, format, lineColor, width, height, displayValue, error, bgColor]);

    const downloadBarcode = () => {
        if (error || !barcodeRef.current) return;
        const svg = barcodeRef.current;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `barcode-GOOGIZ.png`;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 bg-[#fcfcfd]">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-12 h-12 ${theme.bgLight} rounded-2xl mb-3`}>
                        <BarcodeIcon size={24} className={theme.textLight} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1 tracking-tight">Barcode Generator</h1>
                    <p className="text-gray-500 font-medium text-xs">Create professional barcodes for products and inventory.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Enter Data</label>
                            <input 
                                type="text" 
                                value={value} 
                                onChange={(e) => setValue(e.target.value)}
                                className={`w-full p-3 bg-gray-50 border ${error ? 'border-rose-300' : 'border-gray-100'} rounded-xl outline-none text-sm font-medium focus:ring-2 focus:ring-emerald-500`}
                                placeholder="Type numbers..."
                            />
                            {error && (
                                <p className="mt-2 text-[10px] text-rose-500 font-bold flex items-center gap-1 uppercase tracking-tighter">
                                    <AlertCircle size={12}/> {error}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Standard</label>
                                <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none">
                                    <option value="CODE128">CODE128 (Universal)</option>
                                    <option value="EAN13">EAN-13 (13 Digits)</option>
                                    <option value="UPC">UPC (12 Digits)</option>
                                    <option value="CODE39">CODE39</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Line</label>
                                    <input type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer bg-white border-2 border-gray-50" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">BG</label>
                                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer bg-white border-2 border-gray-50" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Maximize size={12}/> Dimensions</label>
                                <div className="flex gap-2">
                                    <input type="number" title="Width" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold" />
                                    <input type="number" title="Height" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold" />
                                </div>
                            </div>
                            <div className="flex items-end pb-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={displayValue} onChange={(e) => setDisplayValue(e.target.checked)} className="w-4 h-4 accent-emerald-600" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Show Text</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-between min-h-[300px]">
                        <div className={`p-6 rounded-3xl border-2 border-dashed ${theme.borderLight} w-full flex-1 flex items-center justify-center overflow-hidden relative`} style={{ backgroundColor: bgColor }}>
                            {error ? (
                                <div className="text-center px-4">
                                    <AlertCircle size={40} className="text-rose-200 mx-auto mb-2" />
                                    <p className="text-[10px] font-black text-rose-400 uppercase">{error}</p>
                                </div>
                            ) : (
                                <svg ref={barcodeRef} className="max-w-full h-auto"></svg>
                            )}
                        </div>
                        <button
                            onClick={downloadBarcode}
                            disabled={!!error}
                            className={`w-full mt-6 py-4 ${error ? 'bg-gray-200' : 'bg-emerald-600 hover:bg-emerald-700'} text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all uppercase tracking-wider text-sm shadow-lg`}
                        >
                            <Download size={20} /> Download PNG
                        </button>
                    </div>
                </div>
                <div className="mt-10">
                    <RelatedTools categoryId="utility" />
                </div>
            </div>
        </div>
    );
};

export default BarcodeGenerator;