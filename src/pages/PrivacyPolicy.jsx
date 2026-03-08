import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white py-20 px-6 max-w-4xl mx-auto text-gray-800 leading-relaxed">
            <h1 className="text-4xl font-extrabold mb-8 text-gray-900">Privacy Policy</h1>
            <p className="mb-6">At <strong>PicEditly</strong>, we are committed to protecting your privacy. Our core philosophy is that your data belongs to you.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Local Processing</h2>
            <p className="mb-4">We do not upload your images to any server. All editing, compression, and resizing happen directly in your browser using client-side technology.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Data Collection</h2>
            <p className="mb-4">We do not collect personal identification information. We don't use tracking cookies that identify you personally.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Security</h2>
            <p className="mb-4">Since your files never leave your computer, they cannot be intercepted on our servers.</p>
            
            <div className="mt-10 pt-6 border-t border-gray-100">
                <Link to="/" className="text-blue-600 font-bold hover:underline">← Back to Home</Link>
            </div>
        </div>
    );
};

export default PrivacyPolicy;