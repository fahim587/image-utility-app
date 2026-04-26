import React, { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { useDropzone } from "react-dropzone";
import { Helmet } from "react-helmet-async";
import {
  UploadCloud,
  FileText,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Scissors,
  Plus
} from "lucide-react";
import RelatedTools from '../../components/RelatedTools';

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const SplitPdf = () => {

  const [file, setFile] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [pageRanges, setPageRanges] = useState([{ start: 1, end: 1 }]);
  const [loading, setLoading] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);

  // Generate PDF previews
  const generatePreviews = async (pdfFile) => {

    setRendering(true);
    setThumbnails([]);

    try {

      const arrayBuffer = await pdfFile.arrayBuffer();

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

      const pdf = await loadingTask.promise;

      const tempThumbnails = [];

      for (let i = 1; i <= pdf.numPages; i++) {

        const page = await pdf.getPage(i);

        const viewport = page.getViewport({ scale: 0.2 });

        const canvas = document.createElement("canvas");

        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport
        }).promise;

        tempThumbnails.push(canvas.toDataURL());

      }

      setThumbnails(tempThumbnails);

    } catch (err) {

      console.error("Preview Error:", err);

    }

    setRendering(false);

  };

  // Upload handler
  const onDrop = useCallback(async (acceptedFiles) => {

    const pdfFile = acceptedFiles[0];

    if (!pdfFile || pdfFile.type !== "application/pdf") {

      alert("Please upload a valid PDF file");

      return;

    }

    setFile(pdfFile);

    try {

      const bytes = await pdfFile.arrayBuffer();

      const pdfDoc = await PDFDocument.load(bytes);

      const count = pdfDoc.getPageCount();

      setPageCount(count);

      setPageRanges([{ start: 1, end: count }]);

      generatePreviews(pdfFile);

    } catch {

      alert("PDF load error");

    }

  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({

    onDrop,
    accept: { "application/pdf": [] },
    multiple: false

  });

  // Add new range
  const addRange = () => {

    setPageRanges([...pageRanges, { start: 1, end: pageCount }]);

  };

  // Update range
  const updateRange = (index, field, value) => {

    const newRanges = [...pageRanges];

    newRanges[index][field] = parseInt(value) || 1;

    setPageRanges(newRanges);

  };

  // Split PDF
  const splitPDF = async () => {

    if (!file) return;

    setLoading(true);

    try {

      const pdfBytes = await file.arrayBuffer();

      const pdfDoc = await PDFDocument.load(pdfBytes);

      for (const range of pageRanges) {

        const newPdf = await PDFDocument.create();

        const start = Math.max(1, Math.min(range.start, pageCount));

        const end = Math.max(start, Math.min(range.end, pageCount));

        const pages = Array.from(
          { length: end - start + 1 },
          (_, i) => start - 1 + i
        );

        const copiedPages = await newPdf.copyPages(pdfDoc, pages);

        copiedPages.forEach((p) => newPdf.addPage(p));

        const newBytes = await newPdf.save();

        const blob = new Blob([newBytes], { type: "application/pdf" });

        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = `split_${start}-${end}_${file.name}`;

        link.click();

      }

    } catch {

      alert("Split error");

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-[#F7F9FC] pt-24 pb-12 px-4">

      <Helmet>
        <title>Split PDF Online</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">

        {/* SEO Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-rose-500 uppercase mb-4">Split PDF Online</h1>
          <h2 className="text-lg text-gray-500">Extract pages from your PDF file quickly and easily</h2>
        </div>

        {/* Instructions */}

        <div className="max-w-3xl mx-auto mb-8">

          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full flex justify-between bg-white p-4 rounded-xl shadow"
          >

            How to use this tool

            {showInstructions ? <ChevronUp /> : <ChevronDown />}

          </button>

          {showInstructions && (

            <div className="bg-white p-5 mt-2 rounded-xl shadow text-sm">

              <ul className="list-decimal list-inside space-y-2">

                <li>Upload your PDF</li>
                <li>Wait for preview pages</li>
                <li>Select page ranges</li>
                <li>Click split PDF</li>

              </ul>

            </div>

          )}

        </div>

        {!file ? (

          <div className="max-w-2xl mx-auto text-center">

            <div
              {...getRootProps()}
              className={`bg-white border-2 border-dashed p-16 rounded-3xl cursor-pointer ${
                isDragActive ? "border-red-500" : "border-gray-300"
              }`}
            >

              <input {...getInputProps()} />

              <UploadCloud size={50} className="mx-auto text-red-500 mb-4" />

              <p className="text-xl font-bold">Upload PDF</p>

              <p className="text-gray-400">Drag & drop or click</p>

            </div>

          </div>

        ) : (

          <div className="grid lg:grid-cols-4 gap-8">

            {/* Preview */}

            <div className="lg:col-span-3 bg-white p-6 rounded-3xl shadow">

              <div className="flex justify-between mb-6">

                <div className="flex items-center gap-2">

                  <FileText className="text-red-500" />

                  {file.name}

                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setThumbnails([]);
                  }}
                >

                  <Trash2 />

                </button>

              </div>

              {rendering ? (

                <div className="text-center py-20">

                  <Loader2 className="animate-spin mx-auto text-red-500" />

                  <p className="text-gray-400 mt-2">Generating preview...</p>

                </div>

              ) : (

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                  {thumbnails.map((src, idx) => (

                    <div
                      key={idx}
                      className={`border rounded-lg p-1 ${
                        pageRanges.some(
                          r => idx + 1 >= r.start && idx + 1 <= r.end
                        )
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                    >

                      <img src={src} alt="" />

                      <p className="text-center text-xs">{idx + 1}</p>

                    </div>

                  ))}

                </div>

              )}

            </div>

            {/* Sidebar */}

            <div>

              <div className="bg-white p-6 rounded-3xl shadow sticky top-28">

                <h3 className="font-bold mb-4 flex items-center gap-2">

                  <Scissors size={18} /> Split Options

                </h3>

                {pageRanges.map((range, index) => (

                  <div key={index} className="flex gap-2 mb-3">

                    <input
                      type="number"
                      value={range.start}
                      min="1"
                      max={pageCount}
                      onChange={(e) =>
                        updateRange(index, "start", e.target.value)
                      }
                      className="border p-2 w-1/2 rounded"
                    />

                    <input
                      type="number"
                      value={range.end}
                      min="1"
                      max={pageCount}
                      onChange={(e) =>
                        updateRange(index, "end", e.target.value)
                      }
                      className="border p-2 w-1/2 rounded"
                    />

                  </div>

                ))}

                <button
                  onClick={addRange}
                  className="w-full border-dashed border p-2 rounded mb-4 flex items-center justify-center gap-2"
                >

                  <Plus size={16} /> Add Range

                </button>

                <button
                  onClick={splitPDF}
                  disabled={loading || rendering}
                  className="w-full bg-red-600 text-white py-3 rounded-xl flex justify-center items-center gap-2"
                >

                  {loading ? <Loader2 className="animate-spin" /> : "Split PDF"}

                </button>

              </div>

            </div>

          </div>

        )}

      </div>
      <RelatedTools categoryId='pdf' />

    </div>

  );

};

export default SplitPdf;