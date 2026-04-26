import React, { useRef, useState } from "react";
import { Download, Image as ImageIcon, HelpCircle, ChevronDown } from "lucide-react";
import { jsPDF } from "jspdf";
import RelatedTools from "../../components/RelatedTools";


const ImageToPDF = () => {
  const [imgFile, setImgFile] = useState(null);
  const [showDirections, setShowDirections] = useState(false);

  const fileInputRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImgFile(url);
  };

  const downloadPDF = () => {
    if (!imgFile) return;

    const pdf = new jsPDF();
    const img = new Image();
    img.src = imgFile;

    img.onload = () => {
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (img.height * imgWidth) / img.width; // maintain aspect ratio
      pdf.addImage(img, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`ImageToPDF-${Date.now()}.pdf`);
    };
  };

  return (
    <div className="max-w-7xl mx-auto pt-32 pb-12 px-4">
      <h1 className="text-4xl font-black text-center mb-6 text-gray-900 tracking-tight">Image To PDF Tool</h1>
    <div className="max-w-3xl mx-auto p-6 font-sans text-gray-800 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Image → PDF Converter</h1>
        <button
          onClick={() => setShowDirections(!showDirections)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
        >
          <HelpCircle size={18} className="text-blue-600" /> How to use
          <ChevronDown className={`transition-transform ${showDirections ? "rotate-180" : ""}`} />
        </button>
      </div>

      {showDirections && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            <li>Click “Select Image” to upload your image.</li>
            <li>Preview will appear below.</li>
            <li>Click “Convert to PDF” to download the PDF file.</li>
            <li>Supports PNG, JPG, JPEG images.</li>
          </ol>
        </div>
      )}

      {/* Upload */}
      {!imgFile && (
        <label
          className="flex flex-col items-center justify-center cursor-pointer text-center bg-gray-100 p-16 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all"
        >
          <div className="p-8 bg-blue-600 rounded-3xl mb-4">
            <ImageIcon size={64} className="text-white" />
          </div>
          <span className="font-bold text-gray-700">Select Image</span>
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/*"
          />
        </label>
      )}

      {/* Preview + Convert */}
      {imgFile && (
        <>
          <div className="mb-6">
            <img src={imgFile} alt="preview" className="max-w-full rounded-xl shadow-lg" />
          </div>

          <button
            onClick={downloadPDF}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold transition-all"
          >
            <Download size={20} /> Convert to PDF
          </button>

          <button
            onClick={() => setImgFile(null)}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-bold transition-all"
          >
            Select Another Image
          </button>
        </>
      )}
       <RelatedTools categoryId="image" />
    </div>

    </div>
  );
};

export default ImageToPDF;