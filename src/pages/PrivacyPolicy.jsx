import React from "react";
import { Helmet } from "react-helmet-async";
import { ShieldCheck, EyeOff, Lock, Server, ArrowLeft, Globe, Database } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const lastUpdated = "April 5, 2026";

  const policies = [
    {
      icon: <EyeOff className="text-blue-600" size={24} />,
      title: "Data Collection",
      content: "We do not collect or store your personal files. Whether you are using our AI Content Writer or Image Compressor, your files are processed and never shared with third parties for marketing."
    },
    {
      icon: <Server className="text-blue-600" size={24} />,
      title: "Local Processing",
      content: "Most of our PDF and Image tools work directly in your browser. This means your sensitive documents never even leave your computer, ensuring 100% native privacy."
    },
    {
      icon: <Lock className="text-blue-600" size={24} />,
      title: "AI & Security",
      content: "For AI-based features like the PDF Summarizer or Image Explainer, data is encrypted during transit and immediately deleted from our processing buffers after the result is generated."
    },
    {
      icon: <Globe className="text-blue-600" size={24} />,
      title: "Cookies & Analytics",
      content: "We use minimal cookies only to improve site performance and remember your preferences. We do not track your identity or use invasive advertising cookies."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy | GOOGIZ - Your Data is Safe</title>
      </Helmet>

      <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6 font-sans">
        <div className="max-w-4xl mx-auto">
          
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 font-bold transition-all hover:-translate-x-1">
            <ArrowLeft size={18} /> Back to Home
          </Link>

          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-50">
                <ShieldCheck size={40} />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Privacy Policy</h1>
            <p className="text-gray-500 font-medium">Your privacy is our core mission. Last updated: {lastUpdated}</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="space-y-12">
              
              <div className="prose prose-blue max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How we handle your content</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  At <strong>GOOGIZ</strong>, we provide a wide range of AI, Image, PDF, and Video utility tools. 
                  Unlike other platforms, we prioritize <strong>client-side processing</strong>, meaning your 
                  data remains under your control.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {policies.map((item, index) => (
                  <div key={index} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      {item.icon}
                      <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-[#010326] rounded-[2rem] p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="text-blue-400" size={24} />
                    <h3 className="text-xl font-bold">Zero-Storage Policy</h3>
                  </div>
                  <p className="text-blue-100/80 leading-relaxed">
                    We do not maintain a database of the files you upload. Once you close your browser tab 
                    or the session expires, any temporary data used for tool processing is permanently wiped 
                    from our system.
                  </p>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              </div>

              <div className="text-center pt-6">
                <p className="text-gray-500 mb-6 font-medium">Have questions about your data security?</p>
                <Link to="/contact" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
                  Contact our Privacy Team →
                </Link>
              </div>

            </div>
          </div>

          <p className="text-center text-gray-400 mt-12 text-sm">
            © 2026 GOOGIZ. Developed with privacy by design.
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;