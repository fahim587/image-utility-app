import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

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
const OrganizedPDF = lazy(() =>import("./pages/tools/OrganizedPDF"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0583F2]"></div>
  </div>
);

const Layout = () => (
  <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
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
      { index: true, element: <Home /> },
      { path: "dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: "pricing", element: <Pricing /> },
      { path: "subscribe", element: <Subscribe /> },
      { path: "payment-success", element: <PaymentSuccess /> },
      { path: "payment-cancel", element: <PaymentCancel /> },
      { path: "all-tools", element: <AllTools /> },
      
      // Category Landing Pages (যেগুলো ফুটার থেকে লিঙ্ক করা)
      { path: "ai-tools", element: <ProRoute><AIMagic /></ProRoute> },
      { path: "image-tools", element: <ImageTools /> },
      { path: "pdf-tools", element: <PdfTools /> },
      { path: "video-tools", element: <VideoTools /> },
      { path: "audio-tools", element: <AudioTools /> },
      { path: "utility-tools", element: <UtilityTools /> },

      // AI Tools
      { path: "ai-content-writer", element: <ProRoute><AIContentWriter /></ProRoute> },
      { path: "ai-video-script", element: <ProRoute><AIVideoScript /></ProRoute> },
      { path: "ai-image-explainer", element: <ProRoute><AIImageExplainer /></ProRoute> },
      { path: "ai-pdf-summarizer", element: <ProRoute><AIPdfSummarizer /></ProRoute> },

      // Image Tools
      { path: "compress", element: <CompressImage /> },
      { path: "resize", element: <ResizeImage /> },
      { path: "crop", element: <CropImage /> },
      { path: "convert", element: <ConvertFormat /> },
      { path: "rotate", element: <RotateImage /> },
      { path: "flip", element: <FlipImage /> },
      { path: "watermark", element: <AddWatermark /> },
      { path: "add-text", element: <AddText /> },
      { path: "blur", element: <BlurImage /> },
      { path: "filters", element: <ImageFilters /> },
      { path: "image-to-pdf", element: <ImageToPdf /> },
      { path: "remove-bg", element: <RemoveBg /> },
      { path: "heic-to-jpg", element: <HeicToJpg /> },
      { path: "svg-optimizer", element: <SvgOptimizer /> },
      { path: "image-to-text", element: <ImageToText /> },
      { path: "color-palette-generator", element: <ColorPaletteGenerator /> },

      // PDF Tools
      { path: "merge-pdf", element: <MergePdf /> },
      { path: "split-pdf", element: <SplitPdf /> },
      { path: "compress-pdf", element: <CompressPdf /> },
      { path: "rotate-pdf", element: <RotatePdf /> },
      { path: "pdf-to-jpg", element: <PdfToJpg /> },
      { path: "jpg-to-pdf", element: <JpgToPdf /> },
      { path: "watermark-pdf", element: <WatermarkPdf /> },
      { path: "protect-pdf", element: <ProtectPdf /> },
      { path: "add-page-numbers", element: <AddPageNumbers /> },
      { path: "remove-pdf-pages", element: <RemovePDFPages /> },
      { path: "unlock-pdf", element: <UnlockPDF /> },
      { path: "sign-pdf", element: <SignPdf /> },
      { path: "organized-pdf", element: <OrganizedPdf /> },
      { path: "metadata-editor", element: <MetadataEditor /> },
      { path: "html-to-pdf", element: <HtmlToPdf /> },
      { path: "edit-pdf", element: <EditPdf /> },

      // Video & Audio
      { path: "video-cutter", element: <VideoCutter /> },
      { path: "video-compress", element: <VideoCompress /> },
      { path: "video-convert", element: <VideoConvert /> },
      { path: "video-rotate", element: <VideoRotate /> },
      { path: "video-crop", element: <VideoCrop /> },
      { path: "video-to-gif", element: <VideoToGif /> },
      { path: "mp3-cutter", element: <Mp3Cutter /> },
      { path: "audio-convert", element: <AudioConvert /> },
      { path: "volume-booster", element: <VolumeBooster /> },
      { path: "audio-speed", element: <AudioSpeed /> },

      // Utility
      { path: "qr-generator", element: <QrGenerator /> },
      { path: "barcode", element: <Barcode /> },
      { path: "password-gen", element: <PasswordGen /> },
      { path: "base64-encode", element: <Base64Encode /> },
      { path: "base64-decode", element: <Base64Decode /> },
      { path: "url-encode", element: <UrlEncode /> },
      { path: "url-decode", element: <UrlDecode /> },
      { path: "case-converter", element: <CaseConverter /> },
      { path: "json-formatter", element: <JsonFormatter /> },
      { path: "color-picker", element: <ColorPicker /> },
      { path: "temp-email", element: <TempEmail /> },
      { path: "typing-test", element: <TypingTest /> },
      { path: "lorem-ipsum", element: <LoremIpsumGenerator /> },

      // Auth, Footer & Others
      { path: "login", element: <AuthPage /> },
      { path: "signup", element: <AuthPage /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
      { path: "privacy", element: <PrivacyPolicy /> },
      { path: "terms", element: <Terms /> },
      { path: "contact", element: <Contact /> },
      { path: "about", element: <AboutUs /> },
      { path: "blog", element: <Blog /> },
      { path: "blog/:slug", element: <BlogPost /> },

      // 404
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