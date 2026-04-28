import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import {
  Download,
  Trash2,
  Settings,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import RelatedTools from "../../components/RelatedTools";
import UniversalFilePicker from "../../components/UniversalFilePicker";

const CompressImage = () => {

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState(0.8);

  const [stats, setStats] = useState({
    oldSize: 0,
    newSize: 0,
    ratio: 0
  });

  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // cleanup memory
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      if (compressedFile) URL.revokeObjectURL(compressedFile);
    };
  }, [preview, compressedFile]);



  const handleFileSelect = async (fileInfo) => {
    try {

      let selectedFile = null;

      if (fileInfo.source === "local") {
        selectedFile = fileInfo.data;
      }

      else if (
        fileInfo.source === "google-drive" ||
        fileInfo.source === "dropbox"
      ) {

        const response = await fetch(
          fileInfo.data.downloadUrl || fileInfo.data.link
        );

        const blob = await response.blob();

        selectedFile = new File(
          [blob],
          fileInfo.data.name || "cloud-image.jpg",
          { type: blob.type }
        );
      }

      else if (fileInfo.source === "url") {

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/${fileInfo.data.filePath}`
        );

        const blob = await response.blob();

        selectedFile = new File(
          [blob],
          fileInfo.data.fileName,
          { type: blob.type }
        );
      }

      if (!selectedFile.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }

      setFile(selectedFile);

      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);

      setCompressedFile(null);

      setStats({
        oldSize: (selectedFile.size / 1024).toFixed(2),
        newSize: 0,
        ratio: 0
      });

    } catch (error) {
      console.error("File select error:", error);
      alert("Failed to load file.");
    }
  };



  const handleCompress = async () => {

    if (!file) return;

    setLoading(true);

    try {

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality
      };

      const compressedBlob = await imageCompression(file, options);

      const url = URL.createObjectURL(compressedBlob);

      const oldSize = parseFloat(stats.oldSize);
      const newSize = (compressedBlob.size / 1024).toFixed(2);

      const ratio =
        (((oldSize - newSize) / oldSize) * 100).toFixed(1);

      setCompressedFile(url);

      setStats({
        oldSize,
        newSize,
        ratio
      });

    } catch (error) {

      console.error("Compression error:", error);
      alert("Compression failed.");

    }

    setLoading(false);
  };



  const reset = () => {

    setFile(null);
    setPreview(null);
    setCompressedFile(null);

    setStats({
      oldSize: 0,
      newSize: 0,
      ratio: 0
    });
  };



  return (

    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-6">
          Compress <span className="text-blue-600">Image</span>
        </h1>

        <p className="text-center text-gray-500 mb-12">
          Reduce image size without losing quality. 100% secure & private.
        </p>



        <div className="grid lg:grid-cols-2 gap-10 items-start">


          {/* Upload Box */}
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-8 flex items-center justify-center min-h-[400px]">

            {preview ? (

              <div className="relative">

                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-[420px] object-contain rounded-xl shadow-xl"
                />

                <button
                  onClick={reset}
                  className="absolute -top-3 -right-3 bg-blue-600 text-white p-2 rounded-full"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            ) : (

              <UniversalFilePicker
                onFileSelect={handleFileSelect}
                allowedTypes="image/*"
              />

            )}

          </div>



          {/* Settings */}
          <div className="space-y-6 bg-white p-8 rounded-3xl shadow-sm border">

            <div className="flex items-center gap-3 text-xl font-bold">
              <Settings size={22} className="text-blue-600" />
              Compression Settings
            </div>


            <div>

              <div className="flex justify-between text-sm font-semibold mb-2">
                <span>Compression Level</span>
                <span>{Math.round((1 - quality) * 100)}%</span>
              </div>

              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.1"
                value={quality}
                onChange={(e) =>
                  setQuality(parseFloat(e.target.value))
                }
                className="w-full"
              />

            </div>



            {file && (

              <div className="grid grid-cols-2 gap-4">

                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-400">Original</p>
                  <p className="font-bold">{stats.oldSize} KB</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-xs text-blue-400">Compressed</p>
                  <p className="font-bold text-blue-600">
                    {stats.newSize || "---"} KB
                  </p>
                </div>

              </div>

            )}



            <button
              onClick={handleCompress}
              disabled={!file || loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold"
            >

              {loading ? "Processing..." : "Compress Image"}

            </button>



            {compressedFile && (

              <div className="text-center pt-4">

                <div className="flex justify-center items-center gap-2 text-green-600 font-semibold mb-4">
                  <CheckCircle size={18} />
                  Saved {stats.ratio}% size
                </div>

                <a
                  href={compressedFile}
                  download={`compressed_${file.name}`}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Image
                </a>

              </div>

            )}

          </div>

        </div>



        {/* Guide */}
        <section className="mt-20">

          <div className="border rounded-2xl bg-white">

            <button
              onClick={() => setIsGuideOpen(!isGuideOpen)}
              className="w-full flex justify-between p-6"
            >

              <h2 className="text-xl font-bold">
                How to use this tool?
              </h2>

              {isGuideOpen ? <ChevronUp /> : <ChevronDown />}

            </button>


            {isGuideOpen && (

              <div className="p-6 grid md:grid-cols-3 gap-6 text-center">

                <div>
                  <h3 className="font-bold mb-2">1. Upload</h3>
                  <p className="text-sm text-gray-500">
                    Select JPG, PNG or WEBP image
                  </p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">2. Adjust</h3>
                  <p className="text-sm text-gray-500">
                    Set compression level
                  </p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">3. Download</h3>
                  <p className="text-sm text-gray-500">
                    Save compressed image instantly
                  </p>
                </div>

              </div>

            )}

          </div>

        </section>



        <div className="mt-20">
          <RelatedTools categoryId="image" />
        </div>


      </div>

    </div>

  );
};

export default CompressImage;