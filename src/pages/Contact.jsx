import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, ArrowLeft, Send } from "lucide-react";

const Contact = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-20 px-6 flex items-center justify-center">
            <div className="max-w-xl w-full bg-white p-8 md:p-12 rounded-[32px] shadow-2xl border border-gray-100 text-center">
                <h1 className="text-3xl font-black mb-4 text-gray-900">Contact Us</h1>
                <p className="text-gray-500 mb-10 leading-relaxed">Have a question or found a bug? Reach out to us and we will reply to your inbox!</p>
                
                {/* Web3Forms Contact Form */}
                <form action="https://api.web3forms.com/submit" method="POST" className="space-y-4 mb-10 text-left">
                    
                    {/* আপনার Access Key */}
                    <input type="hidden" name="access_key" value="38cc92f9-177d-4d50-a8dd-1845ae0c36f9" />

                    {/* এটি যোগ করলে Web3Forms-এর লোগো বা ব্র্যান্ডিং পেজ আর আসবে না */}
                    <input type="hidden" name="redirect" value="http://localhost:5173/contact" />
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Full Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            required 
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            required 
                            placeholder="example@gmail.com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Message</label>
                        <textarea 
                            name="message" 
                            required 
                            rows="4"
                            placeholder="Write your message here..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                        Send Message <Send size={18} />
                    </button>
                </form>

                <div className="h-px bg-gray-100 mb-8"></div>
                
                <div className="mt-6">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={16} /> Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Contact;