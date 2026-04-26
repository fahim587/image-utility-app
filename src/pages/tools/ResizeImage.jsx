import React, { useState } from "react";
import {
  UploadCloud,
  Download,
  Trash2,
  RefreshCw,
  Lock,
  Unlock,
  Percent,
  Hash
} from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const ResizeImage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resizedFile, setResizedFile] = useState(null);

  const [activeTab, setActiveTab] = useState("pixels");

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [originalDimensions, setOriginalDimensions] = useState({
    width: 0,
    height: 0
  });

  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [noEnlarge, setNoEnlarge] = useState(false);

  const handleUpload = (e) => {
    const selected = e.target.files[0];

    if (selected && selected.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          setDimensions({
            width: img.width,
            height: img.height
          });

          setOriginalDimensions({
            width: img.width,
            height: img.height
          });

          setPreview(event.target.result);
        };

        img.src = event.target.result;
      };

      reader.readAsDataURL(selected);

      setFile(selected);
      setResizedFile(null);
    }
  };

  const handlePercentageResize = (percent) => {
    const factor = percent / 100;

    setDimensions({
      width: Math.round(originalDimensions.width * factor),
      height: Math.round(originalDimensions.height * factor)
    });
  };

  const resizeImage = () => {
    if (!preview || dimensions.width <= 0 || dimensions.height <= 0) return;

    if (
      noEnlarge &&
      (dimensions.width > originalDimensions.width ||
        dimensions.height > originalDimensions.height)
    ) {
      alert("Enlarge is disabled.");
      return;
    }

    setLoading(true);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;

      ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

      const dataUrl = canvas.toDataURL(file.type, 0.9);

      setResizedFile(dataUrl);
      setLoading(false);
    };

    img.src = preview;
  };

  const resetImage = () => {
    setPreview(null);
    setFile(null);
    setResizedFile(null);
    setDimensions({ width: 0, height: 0 });
    setOriginalDimensions({ width: 0, height: 0 });
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-900">
        Resize Image
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">

        {/* Preview */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[450px]">

          {preview ? (
            <div className="relative">

              <img
                src={preview}
                alt="preview"
                className="max-h-[400px] rounded-xl shadow-lg border-4 border-white"
              />

              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                {originalDimensions.width}x{originalDimensions.height} →{" "}
                {dimensions.width}x{dimensions.height}
              </div>

              <button
                onClick={resetImage}
                className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ) : (
            <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">

              <UploadCloud size={50} className="text-gray-400 mb-4" />

              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />

              <span className="font-bold text-gray-600">
                Select Image
              </span>

            </label>
          )}
        </div>

        {/* Options */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-8">

          <h3 className="text-xl font-bold text-gray-800 border-b pb-4">
            Resize Options
          </h3>

          {/* Tabs */}

          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1.5 rounded-2xl">

            <button
              onClick={() => setActiveTab("pixels")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold ${
                activeTab === "pixels"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <Hash size={18} />
              By Pixels
            </button>

            <button
              onClick={() => setActiveTab("percentage")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold ${
                activeTab === "percentage"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <Percent size={18} />
              By Percentage
            </button>
          </div>

          {/* Pixel Resize */}

          {activeTab === "pixels" && (
            <div className="grid grid-cols-2 gap-4 relative">

              <input
                type="number"
                value={dimensions.width}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;

                  setDimensions({
                    width: val,
                    height: lockAspectRatio
                      ? Math.round(
                          (val / originalDimensions.width) *
                            originalDimensions.height
                        )
                      : dimensions.height
                  });
                }}
                className="p-4 bg-gray-50 rounded-xl font-bold"
                placeholder="Width"
              />

              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;

                  setDimensions({
                    height: val,
                    width: lockAspectRatio
                      ? Math.round(
                          (val / originalDimensions.height) *
                            originalDimensions.width
                        )
                      : dimensions.width
                  });
                }}
                className="p-4 bg-gray-50 rounded-xl font-bold"
                placeholder="Height"
              />

              <button
                onClick={() => setLockAspectRatio(!lockAspectRatio)}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 p-2 rounded-full border ${
                  lockAspectRatio
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-400"
                }`}
              >
                {lockAspectRatio ? <Lock size={14} /> : <Unlock size={14} />}
              </button>

            </div>
          )}

          {/* Percentage Resize */}

          {activeTab === "percentage" && (
            <div className="grid gap-3">

              {[25, 50, 75].map((pct) => (
                <button
                  key={pct}
                  onClick={() => handlePercentageResize(pct)}
                  className="w-full py-4 border rounded-2xl font-bold hover:bg-blue-50"
                >
                  {pct}% Size
                </button>
              ))}

            </div>
          )}

          {/* No Enlarge */}

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={noEnlarge}
              onChange={() => setNoEnlarge(!noEnlarge)}
            />

            <span className="text-sm">
              Do not enlarge if smaller
            </span>

          </label>

          {/* Resize Button */}

          <button
            onClick={resizeImage}
            disabled={!file || loading}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin" /> : "Resize Image"}
          </button>

          {/* Download */}

          {resizedFile && (
            <a
              href={resizedFile}
              download={`resized_${file.name}`}
              className="flex items-center justify-center gap-3 bg-green-600 text-white py-5 rounded-2xl w-full font-bold"
            >
              <Download size={22} />
              Download Image
            </a>
          )}

        </div>
      </div>

      <div className="mt-20">
        <RelatedTools categoryId="image" />
      </div>
    </div>
  );
};

export default ResizeImage;