import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
    return (
        <div className="min-h-screen bg-white py-20 px-6 max-w-4xl mx-auto text-gray-800">
            <h1 className="text-4xl font-extrabold mb-8 text-gray-900">Terms of Service</h1>
            <p className="mb-6 text-gray-500 italic">Last updated: February 2026</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">By using PicEditly, you agree to these terms. If you do not agree, please do not use our services.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Use License</h2>
            <p className="mb-4">You are free to use PicEditly for personal and commercial projects. As an open-source tool, you must respect the ISC License.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Limitation of Liability</h2>
            <p className="mb-4">We provide these tools "as is." We are not responsible for any data loss or issues caused by browser incompatibility.</p>
            
            <div className="mt-10 pt-6 border-t border-gray-100">
                <Link to="/" className="text-blue-600 font-bold hover:underline">← Back to Home</Link>
            </div>
        </div>
    );
};

export default Terms;