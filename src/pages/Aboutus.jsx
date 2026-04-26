import React from 'react';
import { motion } from 'framer-motion';
import { 
    ShieldCheck, Zap, Heart, Globe, 
    Code2, Users, Sparkles, Lock 
} from 'lucide-react';

const AboutUs = () => {
    const stats = [
        { label: "Processing Speed", value: "< 1s", icon: <Zap className="text-amber-500" size={20} /> },
        { label: "User Privacy", value: "100%", icon: <Lock className="text-blue-500" size={20} /> },
        { label: "Free Tools", value: "40+", icon: <Sparkles className="text-purple-500" size={20} /> },
        { label: "Success Rate", value: "99.9%", icon: <ShieldCheck className="text-emerald-500" size={20} /> },
    ];

    const features = [
        {
            title: "Client-Side Processing",
            description: "Your files never leave your device. All processing happens locally in your browser, ensuring maximum security and data privacy.",
            icon: <ShieldCheck size={24} />
        },
        {
            title: "Lightning Fast Speed",
            description: "No server uploads mean no waiting. Experience instant results with our optimized WebAssembly-powered engines.",
            icon: <Zap size={24} />
        },
        {
            title: "Completely Free",
            description: "Access professional-grade tools for Image, PDF, and Media editing without any subscription or hidden costs.",
            icon: <Heart size={24} />
        }
    ];

    return (
        <div className="pt-24 pb-16 bg-white dark:bg-[#020617] font-sans">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 mb-6"
                    >
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Our Mission</span>
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        Redefining Web Utilities with <span className="text-blue-600">Privacy.</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        GOOGIZ is a comprehensive suite of online tools designed to make digital tasks simpler, faster, and more secure. We believe that powerful tools shouldn't come at the cost of your personal data.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    {stats.map((stat, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center hover:shadow-xl transition-all duration-300">
                            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Core Values Section */}
                <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Why Choose GOOGIZ?</h2>
                        <div className="space-y-8">
                            {features.map((feature, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="mt-1 w-12 h-12 shrink-0 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{feature.title}</h4>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-4xl flex items-center justify-center p-12 overflow-hidden shadow-2xl">
                             {/* Decorative Elements */}
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 opacity-20"
                            >
                                <Code2 className="absolute top-10 left-10 text-white" size={60} />
                                <Sparkles className="absolute bottom-20 right-10 text-white" size={80} />
                                <Globe className="absolute top-1/2 left-1/2 text-white" size={100} />
                            </motion.div>
                            <div className="relative z-10 text-center text-white">
                                <Users size={80} className="mx-auto mb-4" />
                                <h3 className="text-2xl font-bold">Trusted by Developers & Creators Worldwide</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Closing Statement */}
                <div className="p-12 rounded-[40px] bg-slate-900 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4 tracking-tight">Ready to start editing?</h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">Join thousands of users who process their files securely and efficiently every day with GOOGIZ.</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold transition-all transform active:scale-95 shadow-xl shadow-blue-500/20">
                        Explore All Tools
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AboutUs;