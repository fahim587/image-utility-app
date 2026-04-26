import React, { useState } from "react";
import {
  FilePlus,
  Trash2,
  Loader2,
  Download,
  ChevronDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";

import { PDFDocument } from "pdf-lib";
import RelatedTools from '../../components/RelatedTools';

const JpgToPdf = () => {

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  const [pageSize, setPageSize] = useState("fit");
  const [orientation, setOrientation] = useState("auto");

  // upload images
  const handleUpload = (files) => {

    const newImages = [];

    Array.from(files).forEach(file => {

      if (!file.type.startsWith("image/")) return;

      newImages.push({
        file,
        url: URL.createObjectURL(file)
      });

    });

    setImages(prev => [...prev, ...newImages]);
  };

  // remove image
  const removeImage = (index) => {

    setImages(prev => prev.filter((_, i) => i !== index));

  };

  // reorder images
  const moveImage = (index, direction) => {

    const updated = [...images];

    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= images.length) return;

    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

    setImages(updated);

  };

  // reset
  const resetAll = () => {

    setImages([]);
    setPdfUrl(null);

  };

  // convert to pdf
  const createPdf = async () => {

    if (!images.length) return;

    setLoading(true);

    try {

      const pdfDoc = await PDFDocument.create();

      for (const img of images) {

        const bytes = await img.file.arrayBuffer();

        let embed;

        if (img.file.type.includes("png")) {

          embed = await pdfDoc.embedPng(bytes);

        } else {

          embed = await pdfDoc.embedJpg(bytes);

        }

        const width = embed.width;
        const height = embed.height;

        let page;

        if (pageSize === "fit") {

          page = pdfDoc.addPage([width, height]);

        } else {

          page = pdfDoc.addPage([595, 842]); // A4

        }

        const { width: pageWidth, height: pageHeight } = page.getSize();

        const scale = Math.min(pageWidth / width, pageHeight / height);

        const imgWidth = width * scale;
        const imgHeight = height * scale;

        page.drawImage(embed, {
          x: (pageWidth - imgWidth) / 2,
          y: (pageHeight - imgHeight) / 2,
          width: imgWidth,
          height: imgHeight
        });

      }

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);

      setPdfUrl(url);

    } catch {

      alert("Conversion failed");

    }

    setLoading(false);

  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">

      <div className="max-w-6xl mx-auto">

        {/* SEO Title */}

        <h1 className="text-4xl font-bold text-red-500 text-center mb-10">
          Convert JPG to PDF 
        </h1>
        <h2 className="text-xl text-gray-600 text-center mb-10">
          Free Image to PDF Converter – Image to PDF Converter Online
        </h2>

        {/* Upload */}

        <label className="border-2 border-dashed p-16 rounded-2xl bg-white text-center cursor-pointer block mb-10 hover:border-red-500">

          <FilePlus className="mx-auto mb-4 text-red-500" size={48} />

          <p className="font-bold text-xl">
            Upload JPG / PNG Images
          </p>

          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={(e) => handleUpload(e.target.files)}
          />

        </label>

        {/* Settings */}

        {images.length > 0 && (

          <div className="bg-white p-6 rounded-xl shadow mb-6 flex flex-wrap gap-4">

            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="fit">Fit Image Size</option>
              <option value="a4">A4 Page</option>
            </select>

            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="auto">Auto Orientation</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>

            <button
              onClick={resetAll}
              className="text-red-500 flex items-center gap-2"
            >
              <Trash2 size={18} />
              Reset All
            </button>

          </div>

        )}

        {/* Image preview */}

        {images.length > 0 && (

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

            {images.map((img, i) => (

              <div key={i} className="bg-white p-2 rounded-xl shadow">

                <img
                  src={img.url}
                  className="w-full h-48 object-cover rounded"
                  alt=""
                />

                <div className="flex justify-between mt-2">

                  <button
                    onClick={() => moveImage(i, -1)}
                    className="p-2 bg-gray-100 rounded"
                  >
                    <ArrowUp size={16}/>
                  </button>

                  <button
                    onClick={() => moveImage(i, 1)}
                    className="p-2 bg-gray-100 rounded"
                  >
                    <ArrowDown size={16}/>
                  </button>

                  <button
                    onClick={() => removeImage(i)}
                    className="p-2 bg-red-100 text-red-600 rounded"
                  >
                    <Trash2 size={16}/>
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* Convert button */}

        {images.length > 0 && (

          <button
            onClick={createPdf}
            disabled={loading}
            className="w-full py-4 bg-red-600 text-white rounded-xl font-semibold mb-6"
          >

            {loading ? (
              <Loader2 className="animate-spin mx-auto"/>
            ) : (
              "Convert to PDF"
            )}

          </button>

        )}

        {/* Download */}

        {pdfUrl && (

          <a
            href={pdfUrl}
            download="images-to-pdf.pdf"
            className="block text-center text-green-600 font-semibold mb-6"
          >
            <Download className="inline mr-2"/>
            Download PDF
          </a>

        )}

        {/* How to use */}

        <div>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full bg-white border p-4 rounded-xl flex justify-between"
          >

            How to use this tool

            <ChevronDown
              className={`transition-transform ${
                showGuide ? "rotate-180" : ""
              }`}
            />

          </button>

          {showGuide && (

            <div className="bg-white border-t p-5 text-sm text-gray-600">

              <p>1. Upload JPG or PNG images.</p>

              <p>2. Arrange image order if needed.</p>

              <p>3. Choose page size and orientation.</p>

              <p>4. Click Convert to PDF.</p>

              <p>5. Download your generated PDF.</p>

            </div>

          )}

        </div>
         <RelatedTools categoryId='pdf' />
      </div>

    </div>
  );
};

export default JpgToPdf;