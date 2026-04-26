import React, { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";
import {
  Upload,
  Download,
  Zap,
  Loader2,
  Copy,
  RefreshCw,
} from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

export default function SvgOptimizer() {

  const [svgText, setSvgText] = useState("");
  const [optimizedSvg, setOptimizedSvg] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [optimizedSize, setOptimizedSize] = useState(0);
  const [reduction, setReduction] = useState(0);

  const [engineReady, setEngineReady] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  const previewRef = useRef(null);

  // Load SVGO
  useEffect(() => {
    if (window.SVGO) {
      Promise.resolve().then(() => setEngineReady(true));
      return;
    }

    const script = document.createElement("script");
    script.src = "/js/svgo.full.min.js";
    script.async = true;

    script.onload = () => setEngineReady(true);

    document.body.appendChild(script);
  }, []);

  // SVG preview fix
  useEffect(() => {
    if (!previewRef.current) return;

    const svg = previewRef.current.querySelector("svg");

    if (svg) {
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    }

  }, [svgText, optimizedSvg]);

  // Handle File Upload
  const handleFile = useCallback((file) => {

    if (!file || !file.name.endsWith(".svg")) {
      alert("Please upload a valid SVG file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {

      const content = e.target.result;

      setSvgText(content);
      setOptimizedSvg("");

      const size = content.length / 1024;

      setOriginalSize(size);
      setOptimizedSize(0);
      setReduction(0);
    };

    reader.readAsText(file);

  }, []);

  // Optimize SVG
  const handleOptimize = () => {

    if (!svgText || !window.SVGO) return;

    setOptimizing(true);

    try {

      const result = window.SVGO.optimize(svgText, {
        multipass: true,
        plugins: ["preset-default", "removeDimensions"],
      });

      const optimized = result.data;

      const optSize = optimized.length / 1024;

      setOptimizedSvg(optimized);
      setOptimizedSize(optSize);

      const reduce =
        ((originalSize - optSize) / originalSize) * 100;

      setReduction(reduce > 0 ? reduce.toFixed(1) : 0);

    } catch {
      alert("SVG optimization failed. Invalid SVG code.");
    }

    setOptimizing(false);
  };

  // Download SVG
  const downloadSVG = () => {

    const content = optimizedSvg || svgText;

    if (!content) return;

    const blob = new Blob([content], { type: "image/svg+xml" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "optimized.svg";

    link.click();

    URL.revokeObjectURL(url);
  };

  // Copy SVG
  const copySVG = async () => {
    const textToCopy = optimizedSvg || svgText;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      alert("✅ Success! SVG Code copied to clipboard.");
    } catch {
      alert("❌ Copy failed. Please try again.");
    }
  };

  // Reset
  const resetTool = () => {

    setSvgText("");
    setOptimizedSvg("");
    setOriginalSize(0);
    setOptimizedSize(0);
    setReduction(0);

  };

  return (

    <div className="max-w-6xl mx-auto p-6 md:p-10">

      <Helmet>
        <title>SVG Optimizer | GOOGIZ</title>
      </Helmet>

      <h1 className="text-4xl font-black text-center mb-10 flex items-center justify-center gap-2">
        <Zap className="text-blue-600" fill="currentColor" />
        SVG Optimizer
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Upload */}

        <div className="space-y-6">

          <div className="border-4 border-dashed rounded-3xl p-10 text-center bg-slate-50 relative">

            <Upload size={40} className="mx-auto mb-2 text-blue-300" />

            <p className="font-bold text-slate-600">
              Upload SVG File
            </p>

            <input
              type="file"
              accept=".svg"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => handleFile(e.target.files[0])}
            />

          </div>

          <textarea
            className="w-full h-44 p-4 border rounded-xl bg-slate-50 text-xs font-mono"
            placeholder="Paste SVG code here..."
            value={svgText}
            onChange={(e) => {
              const value = e.target.value;
              setSvgText(value);
              setOriginalSize(value.length / 1024);
            }}
          />

        </div>

        {/* Preview */}

        <div className="space-y-6">

          <div className="bg-slate-900 rounded-3xl p-6 min-h-[350px] flex flex-col shadow-xl">

            {svgText ? (

              <div className="flex-1 flex flex-col">

                <div
                  ref={previewRef}
                  className="flex-1 bg-white rounded-xl p-4 flex items-center justify-center max-h-[250px]"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      optimizedSvg || svgText
                    ),
                  }}
                />

                <div className="grid grid-cols-3 gap-4 mt-6">

                  <div className="bg-white/10 p-4 rounded-xl text-center">

                    <p className="text-xs text-blue-400 font-bold">
                      Original
                    </p>

                    <p className="text-lg font-black text-white">
                      {originalSize.toFixed(2)} KB
                    </p>

                  </div>

                  <div className="bg-white/10 p-4 rounded-xl text-center">

                    <p className="text-xs text-blue-400 font-bold">
                      Optimized
                    </p>

                    <p className="text-lg font-black text-white">
                      {optimizedSize.toFixed(2)} KB
                    </p>

                  </div>

                  <div className="bg-blue-600 p-4 rounded-xl text-center">

                    <p className="text-xs text-white/70 font-bold">
                      Reduction
                    </p>

                    <p className="text-lg font-black text-white">
                      {reduction}%
                    </p>

                  </div>

                </div>

              </div>

            ) : (

              <p className="m-auto text-slate-500 font-bold">
                Preview Area
              </p>

            )}

          </div>

          {/* Buttons */}

          {svgText && (

            <div className="flex flex-col gap-4">

              <button
                onClick={handleOptimize}
                disabled={!engineReady || optimizing}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
              >
                {optimizing ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Optimize SVG"
                )}
              </button>

              <div className="flex gap-4">

                <button
                  onClick={downloadSVG}
                  className="flex-1 py-3 bg-slate-800 text-white rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Download size={18} />
                  Download
                </button>

                <button
                  onClick={copySVG}
                  className="p-3 bg-white border rounded-xl hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
                  title="Copy SVG Code"
                >
                  <Copy size={20} />
                </button>

                <button
                  onClick={resetTool}
                  className="p-3 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition-all active:scale-95"
                  title="Reset"
                >
                  <RefreshCw size={20} />
                </button>

              </div>

            </div>

          )}

        </div>

      </div>

      <div className="mt-20">
        <RelatedTools categoryId="image" />
      </div>

    </div>
  );
}