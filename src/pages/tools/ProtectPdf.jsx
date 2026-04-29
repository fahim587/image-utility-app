import React, { useState, useCallback } from "react";
import {
  UploadCloud,
  Lock,
  Eye,
  EyeOff,
  Download,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";
import RelatedTools from "../../components/RelatedTools";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProtectPdf = () => {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  /* ================= PDF THUMBNAIL ================= */

  const generateThumbnail = async (file) => {
    try {
      const reader = new FileReader();

      reader.onload = async function () {
        const typedArray = new Uint8Array(this.result);

        const pdf = await pdfjsLib.getDocument(typedArray).promise;

        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 0.6 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport
        }).promise;

        setThumbnail(canvas.toDataURL());
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("Thumbnail error:", err);
    }
  };

  /* ================= FILE UPLOAD ================= */

  const handleUpload = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }

    setError("");
    setDownloadUrl(null);
    setFile(selected);

    generateThumbnail(selected);
  };

  /* ================= PROTECT PDF ================= */

  const protectPdf = async () => {
    if (!file) return setError("Upload a PDF file first.");
    if (password.length < 4)
      return setError("Password must be at least 4 characters.");

    if (password !== confirm)
      return setError("Passwords do not match.");

    const formData = new FormData();

    formData.append("file", file);
    formData.append("password", password);

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/api/protect-pdf`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error("Failed to protect PDF");
      }

      const blob = await res.blob();

      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);

      const link = document.createElement("a");
      link.href = url;
      link.download = `protected_${file.name}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error(err);
      setError("Failed to protect PDF.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET ================= */

  const resetAll = useCallback(() => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);

    setFile(null);
    setThumbnail(null);
    setPassword("");
    setConfirm("");
    setDownloadUrl(null);
    setError("");
  }, [downloadUrl]);

  /* ================= UI ================= */

  return (
    <div className="max-w-6xl mx-auto pt-32 pb-16 px-4">

      {/* HEADER */}

      <header className="text-center mb-12">

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
          Protect <span className="text-rose-600">PDF</span> Online
        </h1>

        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Secure your PDF with password encryption instantly.
        </p>

      </header>

      <div className="grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE */}

        <div className="rounded-[32px] p-8 flex items-center justify-center bg-white border-2 border-dashed border-gray-200 min-h-[450px]">

          {downloadUrl ? (

            <div className="text-center">

              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={60} />
              </div>

              <h3 className="text-2xl font-bold">
                File Secured
              </h3>

              <button
                onClick={resetAll}
                className="mt-6 bg-rose-100 text-rose-600 px-6 py-2 rounded-full font-bold"
              >
                Protect Another
              </button>

            </div>

          ) : thumbnail ? (

            <div className="relative">

              <img
                src={thumbnail}
                className="max-h-[420px] rounded-xl shadow-xl"
              />

              <button
                onClick={resetAll}
                className="absolute -top-3 -right-3 bg-rose-500 text-white p-2 rounded-full"
              >
                <Trash2 size={18} />
              </button>

            </div>

          ) : (

            <label className="flex flex-col items-center cursor-pointer">

              <UploadCloud
                size={60}
                className="text-rose-500 mb-4"
              />

              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleUpload}
              />

              <span className="text-xl font-bold">
                Upload PDF
              </span>

            </label>

          )}

        </div>

        {/* RIGHT SIDE */}

        <div className="bg-white p-8 rounded-[32px] shadow-lg space-y-6">

          <div className="flex items-center gap-3 font-bold text-xl">
            <Lock size={20} className="text-rose-600" />
            Encryption Settings
          </div>

          {/* PASSWORD */}

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl border"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-4"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>

          </div>

          {/* CONFIRM */}

          <div className="relative">

            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full p-4 rounded-xl border"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirm(!showConfirm)
              }
              className="absolute right-4 top-4"
            >
              {showConfirm ? <EyeOff /> : <Eye />}
            </button>

          </div>

          {/* ERROR */}

          {error && (
            <div className="flex items-center gap-2 text-rose-600 text-sm">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {/* BUTTONS */}

          <button
            onClick={protectPdf}
            disabled={!file || loading}
            className="w-full bg-rose-600 text-white py-4 rounded-xl font-bold"
          >
            {loading ? "Encrypting..." : "Lock PDF"}
          </button>

          {downloadUrl && (

            <a
              href={downloadUrl}
              download={`protected_${file?.name}`}
              className="flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-xl font-bold"
            >
              <Download size={20} />
              Download
            </a>

          )}

        </div>

      </div>

      {/* GUIDE */}

      <section className="mt-20">

        <button
          onClick={() => setIsGuideOpen(!isGuideOpen)}
          className="flex items-center gap-2 font-bold"
        >
          Quick Guide
          {isGuideOpen ? <ChevronUp /> : <ChevronDown />}
        </button>

        {isGuideOpen && (

          <div className="mt-6 grid md:grid-cols-4 gap-6 text-center">

            {[
              "Upload PDF",
              "Enter Password",
              "Click Lock",
              "Download"
            ].map((text, i) => (

              <div key={i}>
                <div className="bg-rose-600 text-white w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  {i + 1}
                </div>

                <p className="text-sm">{text}</p>
              </div>

            ))}

          </div>

        )}

      </section>

      <div className="mt-20">
        <RelatedTools categoryId="pdf" />
      </div>

    </div>
  );
};

export default ProtectPdf;