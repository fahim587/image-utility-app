import { 
  Download, FileDigit, Maximize, RefreshCw, RotateCw, Eraser, 
  FileText, Merge, Split, ShieldCheck, Video, Music, Settings,
  Type, Droplets, Image as ImageIcon, Scissors, Film, Languages,
  Lock, QrCode, Hash, Database, Link, Search, Palette, Wand2,
  FileUp, FileDown, Layers, Volume2, Activity, FlipHorizontal,Mail, Zap,
  FileX2, FileX, CaseUpper, ScanBarcode, Unlock, PenTool, LayoutGrid, Tag, Globe, Sparkles, Eye
} from "lucide-react";

export const toolCategories = [
  {
    id: "ai",
    name: "AI Magic",
    icon: <Sparkles size={24} />,
    items: [
      { name: "AI Content Writer", path: "/ai-content-writer", icon: <PenTool size={20} />, color: "bg-indigo-600" },
      { name: "AI Video Script", path: "/ai-video-script", icon: <Video size={20} />, color: "bg-violet-600" },
      { name: "AI Image Explainer", path: "/ai-image-explainer", icon: <Eye size={20} />, color: "bg-blue-600" },
      { name: "AI PDF Summary", path: "/ai-pdf-summarizer", icon: <Sparkles size={20} />, color: "bg-fuchsia-600" },
    ]
  },
  {
    id: "image",
    name: "Image Tools",
    icon: <ImageIcon size={24} />,
    items: [
      { name: "Compress Image", path: "/compress", icon: <Download size={20} />, color: "bg-blue-500" },
      { name: "Resize Image", path: "/resize", icon: <FileDigit size={20} />, color: "bg-green-500" },
      { name: "Crop Image", path: "/crop", icon: <Maximize size={20} />, color: "bg-purple-500" },
      { name: "Convert Format", path: "/convert", icon: <RefreshCw size={20} />, color: "bg-orange-500" },
      { name: "Rotate Image", path: "/rotate", icon: <RotateCw size={20} />, color: "bg-pink-500" },
      { name: "Flip Image", path: "/flip", icon: <FlipHorizontal size={20} />, color: "bg-cyan-500" },
      { name: "Add Watermark", path: "/watermark", icon: <ShieldCheck size={20} />, color: "bg-indigo-500" },
      { name: "Add Text", path: "/add-text", icon: <Type size={20} />, color: "bg-yellow-600" },
      { name: "Blur Image", path: "/blur", icon: <Droplets size={20} />, color: "bg-teal-500" },
      { name: "Image Filters", path: "/filters", icon: <Wand2 size={20} />, color: "bg-rose-500" },
      { name: "Image to PDF", path: "/image-to-pdf", icon: <FileUp size={20} />, color: "bg-red-500" },
      { name: "Remove Background", path: "/remove-bg", icon: <Eraser size={20} />, color: "bg-violet-600" },
      { name: "HEIC to JPG", path: "/heic-to-jpg", icon: <Languages size={20} />, color: "bg-slate-700" },
      { name: "SVG Optimizer", path: "/svg-optimizer", icon: <Layers size={20} />, color: "bg-gray-800" },
      { name: "Image to Text", path: "/image-to-text", icon: <Type size={20} />, color: "bg-blue-700" },
      { name: "Color Palette Generator", path: "/color-palette-generator", icon: <Palette size={20} />, color: "bg-green-700" },
    ]
  },
  {
    id: "pdf",
    name: "PDF Tools",
    icon: <FileText size={24} />,
    items: [
      { name: "Merge PDF", path: "/merge-pdf", icon: <Merge size={20} />, color: "bg-red-600" },
      { name: "Split PDF", path: "/split-pdf", icon: <Split size={20} />, color: "bg-red-400" },
      { name: "Compress PDF", path: "/compress-pdf", icon: <Download size={20} />, color: "bg-orange-600" },
      { name: "Rotate PDF", path: "/rotate-pdf", icon: <RotateCw size={20} />, color: "bg-yellow-500" },
      { name: "PDF to JPG", path: "/pdf-to-jpg", icon: <ImageIcon size={20} />, color: "bg-blue-600" },
      { name: "JPG to PDF", path: "/jpg-to-pdf", icon: <FileUp size={20} />, color: "bg-green-600" },
      { name: "Add Watermark PDF", path: "/watermark-pdf", icon: <ShieldCheck size={20} />, color: "bg-indigo-600" },
      { name: "Protect PDF", path: "/protect-pdf", icon: <Lock size={20} />, color: "bg-slate-700" },
      { name: "Add Page Numbers", path: "/add-page-numbers", icon: <Hash size={20} />, color: "bg-slate-700" },
      { name: "Remove PDF Pages", path: "/remove-pdf-pages", icon: <FileX2 size={20} />, color: "bg-slate-700" },
      { name: "Unlock PDF", path: "/unlock-pdf", icon: <Unlock size={20} />, color: "bg-slate-700" },
      { name: "Sign PDF", path: "/sign-pdf", icon: <FileText size={20} />, color: "bg-rose-500" },
      { name: "Organized PDF", path: "/organized-pdf", icon: <FileText size={20} />, color: "bg-rose-500" },
      { name: "Metadata Editor", path: "/metadata-editor", icon: <FileText size={20} />, color: "bg-rose-500" },
    ]
  },
  {
    id: "video",
    name: "Video Tools",
    icon: <Video size={24} />,
    items: [
      { name: "Video Cutter", path: "/video-cutter", icon: <Scissors size={20} />, color: "bg-pink-600" },
      { name: "Video Compressor", path: "/video-compress", icon: <Download size={20} />, color: "bg-purple-600" },
      { name: "Video Converter", path: "/video-convert", icon: <RefreshCw size={20} />, color: "bg-blue-500" },
      { name: "Video Rotate", path: "/video-rotate", icon: <RotateCw size={20} />, color: "bg-indigo-500" },
      { name: "Video Crop", path: "/video-crop", icon: <Maximize size={20} />, color: "bg-cyan-600" },
      { name: "Video to GIF", path: "/video-to-gif", icon: <Film size={20} />, color: "bg-orange-500" },
    ]
  },
  {
    id: "audio",
    name: "Audio Tools",
    icon: <Music size={24} />,
    items: [
      { name: "MP3 Cutter", path: "/mp3-cutter", icon: <Scissors size={20} />, color: "bg-rose-500" },
      { name: "Audio Converter", path: "/audio-convert", icon: <RefreshCw size={20} />, color: "bg-emerald-500" },
      { name: "Volume Booster", path: "/volume-booster", icon: <Volume2 size={20} />, color: "bg-amber-500" },
      { name: "Audio Speed", path: "/audio-speed", icon: <Activity size={20} />, color: "bg-blue-400" },
    ]
  },
  {
    id: "utility",
    name: "Utility Tools",
    icon: <Settings size={24} />,
    items: [
      { name: "QR Generator", path: "/qr-generator", icon: <QrCode size={20} />, color: "bg-slate-800" },
      { name: "Barcode Generator", path: "/barcode", icon: <Hash size={20} />, color: "bg-black" },
      { name: "Password Gen", path: "/password-gen", icon: <Lock size={20} />, color: "bg-green-700" },
      { name: "Base64 Encoder", path: "/base64-encode", icon: <Database size={20} />, color: "bg-indigo-700" },
      { name: "Base64 Decoder", path: "/base64-decode", icon: <FileDown size={20} />, color: "bg-indigo-400" },
      { name: "URL Encoder", path: "/url-encode", icon: <Link size={20} />, color: "bg-blue-700" },
      { name: "URL Decoder", path: "/url-decode", icon: <Search size={20} />, color: "bg-blue-400" },
      { name: "Case Converter", path: "/case-converter", icon: <Type size={20} />, color: "bg-orange-700" },
      { name: "JSON Formatter", path: "/json-formatter", icon: <Layers size={20} />, color: "bg-gray-600" },
      { name: "Color Picker", path: "/color-picker", icon: <Palette size={20} />, color: "bg-fuchsia-600" },
      { name: "Temp Email", path: "/temp-email", icon: <Mail size={20} />, color: "bg-emerald-700" },
      { name: "Typing Test", path: "/typing-test", icon: <Activity size={20} />, color: "bg-emerald-400" },
      { name: "Lorem Ipsum", path: "/lorem-ipsum", icon: <FileText size={20} />, color: "bg-emerald-400" },
      { name: "HTML to PDF", path: "/html-to-pdf", icon: <Globe size={20} />, color: "bg-blue-400" },
    ]
  }
];