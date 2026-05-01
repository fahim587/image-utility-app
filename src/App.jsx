import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import SeoManager from "./components/SeoManager";
import ScrollToTop from "./components/ScrollToTop"; // ইমপোর্ট করা হয়েছে

// Static Imports
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Pricing from "./pages/Pricing";
import Subscribe from "./pages/Subscribe";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import SubscribeButton from "./components/SubscribeButton";
import UniversalFilePicker from "./components/UniversalFilePicker";
import ProRoute from "./components/ProRoute";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// Lazy Loading Pages
const Home = lazy(() => import("./pages/Home"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const AllTools = lazy(() => import("./pages/AllTools"));
const AIMagic = lazy(() => import("./pages/AIMagic"));

// Category Pages
const ImageTools = lazy(() => import("./pages/ImageTools"));
const PdfTools = lazy(() => import("./pages/PdfTools"));
const VideoTools = lazy(() => import("./pages/VideoTools"));
const AudioTools = lazy(() => import("./pages/AudioTools"));
const UtilityTools = lazy(() => import("./pages/UtilityTools"));

// Tools (AI, Image, PDF, etc.) - Dynamic Imports
const AIContentWriter = lazy(() => import("./pages/tools/AIContentWriter"));
const AIVideoScript = lazy(() => import("./pages/tools/AIVideoScript"));
const AIImageExplainer = lazy(() => import("./pages/tools/AIImageExplainer"));
const AIPdfSummarizer = lazy(() => import("./pages/tools/AIPdfSummarizer"));
const CompressImage = lazy(() => import("./pages/tools/CompressImage"));
const ResizeImage = lazy(() => import("./pages/tools/ResizeImage"));
const CropImage = lazy(() => import("./pages/tools/CropImage"));
const ConvertFormat = lazy(() => import("./pages/tools/ConvertFormat"));
const RotateImage = lazy(() => import("./pages/tools/RotateImage"));
const FlipImage = lazy(() => import("./pages/tools/FlipImage"));
const AddWatermark = lazy(() => import("./pages/tools/AddWatermark"));
const AddText = lazy(() => import("./pages/tools/AddText"));
const BlurImage = lazy(() => import("./pages/tools/BlurImage"));
const ImageFilters = lazy(() => import("./pages/tools/ImageFilters"));
const ImageToPdf = lazy(() => import("./pages/tools/ImageToPdf"));
const RemoveBg = lazy(() => import("./pages/tools/RemoveBg"));
const HeicToJpg = lazy(() => import("./pages/tools/HeicToJpg"));
const SvgOptimizer = lazy(() => import("./pages/tools/SvgOptimizer"));
const ImageToText = lazy(() => import('./pages/tools/ImageToText'));
const ColorPaletteGenerator = lazy(() => import('./pages/tools/ColorPaletteGenerator'));
const MergePdf = lazy(() => import("./pages/tools/MergePdf"));
const SplitPdf = lazy(() => import("./pages/tools/SplitPdf"));
const CompressPdf = lazy(() => import("./pages/tools/CompressPdf"));
const RotatePdf = lazy(() => import("./pages/tools/RotatePdf"));
const PdfToJpg = lazy(() => import("./pages/tools/PdfToJpg"));
const JpgToPdf = lazy(() => import("./pages/tools/JpgToPdf"));
const WatermarkPdf = lazy(() => import("./pages/tools/WatermarkPdf"));
const ProtectPdf = lazy(() => import("./pages/tools/ProtectPdf"));
const AddPageNumbers = lazy(() => import("./pages/tools/AddPageNumbers"));
const RemovePDFPages = lazy(() => import("./pages/tools/RemovePDFPages"));
const UnlockPDF = lazy(() => import("./pages/tools/UnlockPDF"));
const SignPdf = lazy(() => import("./pages/tools/SignPdf"));
const MetadataEditor = lazy(() => import("./pages/tools/MetadataEditor"));
const HtmlToPdf = lazy(() => import("./pages/tools/HtmlToPdf"));
const EditPdf = lazy(() => import("./pages/tools/EditPdf"));
const VideoCutter = lazy(() => import("./pages/tools/VideoCutter"));
const VideoCompress = lazy(() => import("./pages/tools/VideoCompress"));
const VideoConvert = lazy(() => import("./pages/tools/VideoConvert"));
const VideoRotate = lazy(() => import("./pages/tools/VideoRotate"));
const VideoCrop = lazy(() => import("./pages/tools/VideoCrop"));
const VideoToGif = lazy(() => import("./pages/tools/VideoToGif"));
const Mp3Cutter = lazy(() => import("./pages/tools/Mp3Cutter"));
const AudioConvert = lazy(() => import("./pages/tools/AudioConvert"));
const VolumeBooster = lazy(() => import("./pages/tools/VolumeBooster"));
const AudioSpeed = lazy(() => import("./pages/tools/AudioSpeed"));
const QrGenerator = lazy(() => import("./pages/tools/QrGenerator"));
const Barcode = lazy(() => import("./pages/tools/Barcode"));
const PasswordGen = lazy(() => import("./pages/tools/PasswordGen"));
const Base64Encode = lazy(() => import("./pages/tools/Base64Encode"));
const Base64Decode = lazy(() => import("./pages/tools/Base64Decode"));
const UrlEncode = lazy(() => import("./pages/tools/UrlEncode"));
const UrlDecode = lazy(() => import("./pages/tools/UrlDecode"));
const CaseConverter = lazy(() => import("./pages/tools/CaseConverter"));
const JsonFormatter = lazy(() => import("./pages/tools/JsonFormatter"));
const ColorPicker = lazy(() => import("./pages/tools/ColorPicker"));
const TempEmail = lazy(() => import("./pages/tools/TempEmail"));
const TypingTest = lazy(() => import("./pages/tools/TypingTest"));
const LoremIpsumGenerator = lazy(() => import("./pages/tools/LoremIpsumGenerator"));
const OrganizedPdf = lazy(() => import("./pages/tools/OrganizedPDF"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0583F2]"></div>
  </div>
);

// Layout কম্পোনেন্টে ScrollToTop যুক্ত করা হয়েছে
const Layout = () => (
  <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
    <ScrollToTop /> {/* এখানে বসানো হয়েছে */}
    <Navbar />
    <main className="flex-grow pt-20">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true,element: (<><SeoManager toolName="Googiz | AI Powered Tools" /><Home /></>) },
      { path: "dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: "pricing", element: <Pricing /> },
      { path: "subscribe", element: <Subscribe /> },
      { path: "payment-success", element: <PaymentSuccess /> },
      { path: "payment-cancel", element: <PaymentCancel /> },
      { path: "all-tools", element: <AllTools /> },
      
      // Category Landing Pages
      { path: "ai-tools", element: <ProRoute><><SeoManager toolName="AI Magic Tools" /><AIMagic /></></ProRoute> },
      { path: "image-tools", element: <><SeoManager toolName="Image Editing Tools" /><ImageTools /></> },
      { path: "pdf-tools", element: <><SeoManager toolName="PDF Management Tools" /><PdfTools /></> },
      { path: "video-tools", element: <><SeoManager toolName="Video Editing Tools" /><VideoTools /></> },
      { path: "audio-tools", element: <><SeoManager toolName="Audio Editing Tools" /><AudioTools /></> },
      { path: "utility-tools", element: <><SeoManager toolName="Utility Tools" /><UtilityTools /></> },
      // AI Tools
      { path: "ai-content-writer", element: <ProRoute><><SeoManager toolName="AI Content Writer" /><AIContentWriter /></></ProRoute> },
      { path: "ai-video-script", element: <ProRoute><><SeoManager toolName="AI Video Script" /><AIVideoScript /></></ProRoute> },
      { path: "ai-image-explainer", element: <ProRoute><><SeoManager toolName="AI Image Explainer" /><AIImageExplainer /></></ProRoute> },
      { path: "ai-pdf-summarizer", element: <ProRoute><><SeoManager toolName="AI PDF Summary" /><AIPdfSummarizer /></></ProRoute> },

      // Image Tools
      { path: "compress", element: <><SeoManager toolName="Compress Image" /><CompressImage /></> },
      { path: "resize", element: <><SeoManager toolName="Resize Image" /><ResizeImage /></> },
      { path: "crop", element: <><SeoManager toolName="Crop Image" /><CropImage /></> },
      { path: "convert", element: <><SeoManager toolName="Convert Format" /><ConvertFormat /></> },
      { path: "rotate", element: <><SeoManager toolName="Rotate Image" /><RotateImage /></> },
      { path: "flip", element: <><SeoManager toolName="Flip Image" /><FlipImage /></> },
      { path: "watermark", element: <><SeoManager toolName="Add Watermark" /><AddWatermark /></> },
      { path: "add-text", element: <><SeoManager toolName="Add Text to Image" /><AddText /></> },
      { path: "blur", element: <><SeoManager toolName="Blur Image" /><BlurImage /></> },
      { path: "filters", element: <><SeoManager toolName="Image Filters" /><ImageFilters /></> },
      { path: "image-to-pdf", element: <><SeoManager toolName="Image to PDF" /><ImageToPdf /></> },
      { path: "remove-bg", element: <><SeoManager toolName="Remove Background" /><RemoveBg /></> },
      { path: "heic-to-jpg", element: <><SeoManager toolName="HEIC to JPG" /><HeicToJpg /></> },
      { path: "svg-optimizer", element: <><SeoManager toolName="SVG Optimizer" /><SvgOptimizer /></> },
      { path: "image-to-text", element: <><SeoManager toolName="Image to Text (OCR)" /><ImageToText /></> },
      { path: "color-palette-generator", element: <><SeoManager toolName="Color Palette Generator" /><ColorPaletteGenerator /></> },

      // PDF Tools
      { path: "merge-pdf", element: <><SeoManager toolName="Merge PDF" /><MergePdf /></> },
      { path: "split-pdf", element: <><SeoManager toolName="Split PDF" /><SplitPdf /></> },
      { path: "compress-pdf", element: <><SeoManager toolName="Compress PDF" /><CompressPdf /></> },
      { path: "rotate-pdf", element: <><SeoManager toolName="Rotate PDF" /><RotatePdf /></> },
      { path: "pdf-to-jpg", element: <><SeoManager toolName="PDF to JPG" /><PdfToJpg /></> },
      { path: "jpg-to-pdf", element: <><SeoManager toolName="JPG to PDF" /><JpgToPdf /></> },
      { path: "watermark-pdf", element: <><SeoManager toolName="Add Watermark to PDF" /><WatermarkPdf /></> },
      { path: "protect-pdf", element: <><SeoManager toolName="Protect PDF" /><ProtectPdf /></> },
      { path: "add-page-numbers", element: <><SeoManager toolName="Add Page Numbers to PDF" /><AddPageNumbers /></> },
      { path: "remove-pdf-pages", element: <><SeoManager toolName="Remove PDF Pages" /><RemovePDFPages /></> },
      { path: "unlock-pdf", element: <><SeoManager toolName="Unlock PDF" /><UnlockPDF /></> },
      { path: "sign-pdf", element: <><SeoManager toolName="Sign PDF" /><SignPdf /></> },
      { path: "organized-pdf", element: <><SeoManager toolName="Organized PDF" /><OrganizedPdf /></> },
      { path: "metadata-editor", element: <><SeoManager toolName="PDF Metadata Editor" /><MetadataEditor /></> },
      { path: "html-to-pdf", element: <><SeoManager toolName="HTML to PDF" /><HtmlToPdf /></> },
      { path: "edit-pdf", element: <><SeoManager toolName="Edit PDF" /><EditPdf /></> },

      // Video & Audio
      { path: "video-cutter", element: <><SeoManager toolName="Video Cutter" /><VideoCutter /></> },
      { path: "video-compress", element: <><SeoManager toolName="Video Compressor" /><VideoCompress /></> },
      { path: "video-convert", element: <><SeoManager toolName="Video Converter" /><VideoConvert /></> },
      { path: "video-rotate", element: <><SeoManager toolName="Video Rotate" /><VideoRotate /></> },
      { path: "video-crop", element: <><SeoManager toolName="Video Crop" /><VideoCrop /></> },
      { path: "video-to-gif", element: <><SeoManager toolName="Video to GIF" /><VideoToGif /></> },
      { path: "mp3-cutter", element: <><SeoManager toolName="MP3 Cutter" /><Mp3Cutter /></> },
      { path: "audio-convert", element: <><SeoManager toolName="Audio Converter" /><AudioConvert /></> },
      { path: "volume-booster", element: <><SeoManager toolName="Volume Booster" /><VolumeBooster /></> },
      { path: "audio-speed", element: <><SeoManager toolName="Audio Speed Changer" /><AudioSpeed /></> },

      // Utility
      { path: "qr-generator", element: <><SeoManager toolName="QR Code Generator" /><QrGenerator /></> },
      { path: "barcode", element: <><SeoManager toolName="Barcode Generator" /><Barcode /></> },
      { path: "password-gen", element: <><SeoManager toolName="Password Generator" /><PasswordGen /></> },
      { path: "base64-encode", element: <><SeoManager toolName="Base64 Encoder" /><Base64Encode /></> },
      { path: "base64-decode", element: <><SeoManager toolName="Base64 Decoder" /><Base64Decode /></> },
      { path: "url-encode", element: <><SeoManager toolName="URL Encoder" /><UrlEncode /></> },
      { path: "url-decode", element: <><SeoManager toolName="URL Decoder" /><UrlDecode /></> },
      { path: "case-converter", element: <><SeoManager toolName="Case Converter" /><CaseConverter /></> },
      { path: "json-formatter", element: <><SeoManager toolName="JSON Formatter" /><JsonFormatter /></> },
      { path: "color-picker", element: <><SeoManager toolName="Online Color Picker" /><ColorPicker /></> },
      { path: "temp-email", element: <><SeoManager toolName="Temporary Email Service" /><TempEmail /></> },
      { path: "typing-test", element: <><SeoManager toolName="Online Typing Test" /><TypingTest /></> },
      { path: "lorem-ipsum", element: <><SeoManager toolName="Lorem Ipsum Generator" /><LoremIpsumGenerator /></> },

      // Auth & Others
      { path: "login", element: <AuthPage /> },
      { path: "signup", element: <AuthPage /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
      { path: "privacy", element: <><SeoManager toolName="Privacy Policy" /><PrivacyPolicy /></> },
      { path: "terms", element: <><SeoManager toolName="Terms and Conditions" /><Terms /></> },
      { path: "contact", element: <><SeoManager toolName="Contact Us" /><Contact /></> },
      { path: "about", element: <><SeoManager toolName="About Us" /><AboutUs /></> },
      { path: "blog", element: <Blog /> },
      { path: "blog/:slug", element: <BlogPost /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <HelmetProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}

export default App;