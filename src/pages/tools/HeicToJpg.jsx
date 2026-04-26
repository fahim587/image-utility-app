import React, { useState } from 'react';
import heic2any from "heic2any";
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp, Upload, Download, Image as ImageIcon, CheckCircle } from 'lucide-react';
import RelatedTools from "../../components/RelatedTools";

const HeicToJpg = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [convertedImage, setConvertedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic"))) {
            setSelectedFile(file);
            setConvertedImage(null);
        } else {
            alert("Please upload a valid .heic file.");
        }
    };

    const convertHeicToJpg = async () => {
        if (!selectedFile) return;
        setLoading(true);

        try {
            const blob = await heic2any({
                blob: selectedFile,
                toType: "image/jpeg",
                quality: 0.8
            });

            const url = URL.createObjectURL(blob);
            setConvertedImage(url);
        } catch (error) {
            console.error("Conversion failed:", error);
            alert("Conversion failed. Please try again with a different file.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <Helmet>
                <title>HEIC to JPG Converter | Fast & Free Online Tool</title>
                <meta name="description" content="Convert Apple HEIC images to high-quality JPG format instantly. Secure, browser-based conversion without uploading to any server." />
                <meta name="keywords" content="heic to jpg, convert heic, apple image converter, online image tool" />
            </Helmet>

            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-blue-600 mb-3">HEIC to JPG Converter</h1>
                <p className="text-slate-600 text-lg">Easily convert your iPhone HEIC photos to compatible JPG format.</p>
            </div>

            {/* Dropdown Instructions */}
            <div className="mb-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button 
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                    <span className="font-semibold text-slate-700">How to use this tool?</span>
                    {showInstructions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {showInstructions && (
                    <div className="p-4 text-slate-600 bg-white space-y-2 border-t border-slate-200">
                        <p>1. Click on the <strong>Upload</strong> area and select a .heic file from your device.</p>
                        <p>2. Once the file is selected, click the <strong>Convert</strong> button.</p>
                        <p>3. Wait a few seconds for the process to complete.</p>
                        <p>4. Preview your converted image and click <strong>Download</strong> to save it as JPG.</p>
                    </div>
                )}
            </div>

            {/* Main Tool Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center">
                    <div className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${selectedFile ? 'border-green-400 bg-green-50' : 'border-blue-300 bg-blue-50'}`}>
                        <input 
                            type="file" 
                            accept=".heic" 
                            onChange={handleFileChange} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center">
                            {selectedFile ? <CheckCircle size={48} className="text-green-500 mb-3" /> : <Upload size={48} className="text-blue-500 mb-3" />}
                            <p className="text-slate-700 font-medium">
                                {selectedFile ? selectedFile.name : "Click or Drag HEIC file here"}
                            </p>
                            {selectedFile && <p className="text-xs text-slate-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>}
                        </div>
                    </div>
                    
                    {selectedFile && !convertedImage && (
                        <button 
                            onClick={convertHeicToJpg}
                            disabled={loading}
                            className={`w-full mt-6 py-4 rounded-xl text-white font-bold text-lg transition-all shadow-md ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
                        >
                            {loading ? "Processing..." : "Convert to JPG"}
                        </button>
                    )}
                </div>

                {/* Preview & Download Area */}
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[300px]">
                    {convertedImage ? (
                        <div className="w-full text-center">
                            <div className="relative group inline-block">
                                <img src={convertedImage} alt="Converted Preview" className="max-h-64 rounded-lg shadow-md mb-6 border-4 border-white" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                    <ImageIcon className="text-white" size={32} />
                                </div>
                            </div>
                            <a 
                                href={convertedImage} 
                                download={`GOOGIZ-${Date.now()}.jpg`}
                                className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-md active:scale-95"
                            >
                                <Download size={20} /> Download Image
                            </a>
                        </div>
                    ) : (
                        <div className="text-slate-400 text-center">
                            <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />
                            <p>Converted image preview will appear here</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-16">
                <RelatedTools categoryId="image" />
            </div>
        </div>
    );
};

export default HeicToJpg;