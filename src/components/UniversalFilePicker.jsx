import React, { useState } from "react";
import useDrivePicker from "react-google-drive-picker";
import { HardDrive, Cloud, Link2, Box, Upload } from "lucide-react";
import axios from "axios";

const UniversalFilePicker = ({ onFileSelect }) => {
  const [openPicker] = useDrivePicker();
  const [isUrlOpen, setIsUrlOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // লোডিং স্টেট

  const API_URL = import.meta.env.VITE_API_URL || "import.meta.env.VITE_API_URL";

  // Google Drive Handler
  const handleGoogleDrive = () => {
    openPicker({
      clientId: import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID,
      developerKey: import.meta.env.VITE_GOOGLE_DRIVE_API_KEY,
      viewId: "DOCS",
      showUploadView: true,
      supportDrives: true,
      multiselect: false,
      callbackFunction: async (data) => {
        if (data.action === "picked") {
          setIsLoading(true);
          const file = data.docs[0];
          try {
            // ড্রাইভ আইডি দিয়ে ব্যাকএন্ড থেকে ডিরেক্ট লিংক আনা
            const res = await axios.post(`${API_URL}/api/google-drive-download`, { 
              fileId: file.id 
            });
            
            onFileSelect({
              source: "google-drive",
              data: res.data // { url, name, isGoogleDrive: true }
            });
          } catch (err) {
            alert("গুগল ড্রাইভ ফাইল অ্যাক্সেস করতে সমস্যা হচ্ছে।");
          } finally {
            setIsLoading(false);
          }
        }
      }
    });
  };

  // Dropbox Handler
  const handleDropbox = () => {
    const options = {
      success: (files) => {
        onFileSelect({
          source: "dropbox",
          data: files[0] // ড্রপবক্স সরাসরি direct link দেয়
        });
      },
      linkType: "direct",
      multiselect: false
    };

    if (window.Dropbox) {
      window.Dropbox.choose(options);
    } else {
      alert("Dropbox script not loaded!");
    }
  };

  // URL Import Handler
  const handleUrlSubmit = async () => {
    if (!url) return;
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/upload-url`, { url });
      onFileSelect({
        source: "url",
        data: res.data
      });
      setUrl("");
      setIsUrlOpen(false);
    } catch (err) {
      alert("ইনভ্যালিড ইউআরএল! দয়া করে সরাসরি ইমেজ লিংক দিন।");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect({
        source: "local",
        data: e.dataTransfer.files[0]
      });
    }
  };

  return (
    <div
      className={`w-full max-w-2xl mx-auto p-6 bg-white rounded-3xl border transition-all ${
        dragActive ? "border-blue-500 bg-blue-50" : "border-gray-200"
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      {/* Upload Area */}
      <div className="flex flex-col items-center justify-center gap-2 mb-6 text-gray-500">
        <Upload size={28} className={isLoading ? "animate-bounce" : ""} />
        <p className="text-sm">{isLoading ? "Processing..." : "Drag & Drop file here"}</p>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <label className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors">
          <input
            type="file"
            className="hidden"
            onChange={(e) => onFileSelect({ source: "local", data: e.target.files[0] })}
          />
          <HardDrive size={20} className="text-gray-700" />
          <span className="text-xs font-medium">Device</span>
        </label>

        <button onClick={handleGoogleDrive} className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-green-100 transition-colors">
          <Cloud size={20} className="text-green-600" />
          <span className="text-xs font-medium">Drive</span>
        </button>

        <button onClick={handleDropbox} className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-blue-100 transition-colors">
          <Box size={20} className="text-blue-600" />
          <span className="text-xs font-medium">Dropbox</span>
        </button>

        <button onClick={() => setIsUrlOpen(!isUrlOpen)} className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-orange-100 transition-colors">
          <Link2 size={20} className="text-orange-500" />
          <span className="text-xs font-medium">URL</span>
        </button>
      </div>

      {isUrlOpen && (
        <div className="mt-6 flex gap-2 animate-in fade-in slide-in-from-top-2">
          <input
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste direct file URL (e.g. .jpg, .png)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleUrlSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg text-sm font-medium transition-colors disabled:bg-gray-400"
          >
            {isLoading ? "Adding..." : "Add"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UniversalFilePicker;