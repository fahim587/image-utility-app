import React from "react";
import { Helmet } from "react-helmet-async";
import { Scale, ShieldCheck, UserCheck, AlertTriangle, FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  const lastUpdated = "April 5, 2026";

  const sections = [
    {
      icon: <UserCheck className="text-blue-600" size={24} />,
      title: "Acceptance of Terms",
      content: "By accessing and using GOOGIZ, you agree to be bound by these terms. If you do not agree, please discontinue use of our AI tools immediately."
    },
    {
      icon: <ShieldCheck className="text-blue-600" size={24} />,
      title: "User Privacy & Data",
      content: "We prioritize your privacy. Most of our tools process data locally in your browser. Any data sent to our AI models is used only for generation and is not stored permanently."
    },
    {
      icon: <Scale className="text-blue-600" size={24} />,
      title: "Usage Policy",
      content: "You agree not to use our AI tools (Content Writer, PDF Summarizer, etc.) for generating illegal, harmful, or copyright-infringing content."
    },
    {
      icon: <AlertTriangle className="text-blue-600" size={24} />,
      title: "Limitation of Liability",
      content: "GOOGIZ is provided 'as is'. We are not responsible for any inaccuracies in AI-generated content or any data loss resulting from technical issues."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Terms & Conditions | GOOGIZ</title>
      </Helmet>

      <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6 font-sans">
        <div className="max-w-4xl mx-auto">
          
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 font-bold transition-all">
            <ArrowLeft size={18} /> Back to Home
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Terms & Conditions</h1>
            <p className="text-gray-500">Last Updated: {lastUpdated}</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="space-y-10">
              
              <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <FileText className="text-blue-600 shrink-0" size={28} />
                <p className="text-blue-900 font-medium leading-relaxed">
                  Please read these terms carefully. These govern your relationship with GOOGIZ and clarify your rights and obligations while using our platform.
                </p>
              </div>

              <div className="grid gap-8">
                {sections.map((section, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center gap-3 mb-3">
                      {section.icon}
                      <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed pl-9">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-gray-100 text-center">
                <p className="text-gray-500 text-sm mb-4">
                  Have questions about our terms? 
                </p>
                <Link to="/contact" className="bg-[#010326] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all inline-block">
                  Contact Support
                </Link>
              </div>

            </div>
          </div>

          <p className="text-center text-gray-400 mt-10 text-sm italic">
            © 2026 GOOGIZ - All Rights Reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;