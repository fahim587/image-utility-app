import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    Mail, RefreshCw, Copy, Inbox, Clock, 
    ShieldCheck, Check, ArrowLeft, User, HelpCircle, ChevronDown 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RelatedTools from '../../components/RelatedTools';

const BASE_URL = "https://api.mail.tm";

const TempEmail = () => {
    const [address, setAddress] = useState("");
    const [messages, setMessages] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [selectedMsg, setSelectedMsg] = useState(null);
    const [msgLoading, setMsgLoading] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const generateEmail = useCallback(async () => {
        setLoading(true);
        try {
            const domainRes = await axios.get(`${BASE_URL}/domains`);
            const domain = domainRes.data['hydra:member'][0].domain;
            const username = `user_${Math.random().toString(36).substring(7)}`;
            const password = "securepassword123";
            const email = `${username}@${domain}`;

            await axios.post(`${BASE_URL}/accounts`, { address: email, password });
            const tokenRes = await axios.post(`${BASE_URL}/token`, { address: email, password });
            
            setAddress(email);
            setToken(tokenRes.data.token);
            setMessages([]);
            setSelectedMsg(null);
        } catch (error) {
            console.error("Error:", error);
        }
        setLoading(false);
    }, []);

    const fetchMessages = useCallback(async () => {
        if (!token || selectedMsg) return;
        try {
            const res = await axios.get(`${BASE_URL}/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data['hydra:member']);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }, [token, selectedMsg]);

    useEffect(() => {
        // Fix for: Calling setState synchronously within an effect
        Promise.resolve().then(() => {
            generateEmail();
        });
    }, [generateEmail]);

    useEffect(() => {
        const interval = setInterval(fetchMessages, 10000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-4 md:p-6 pt-28 transition-colors">
            <div className="max-w-4xl mx-auto">
                
                {/* SEO Header */}
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-black text-emerald-500 dark:text-white mb-3 tracking-tight">
                        Temp<span className="text-emerald-500">Mail.</span>
                    </h1>
                    <p className="max-w-md mx-auto text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                        Protect your privacy and keep your real inbox clean from spam using our high-speed temporary email service.
                    </p>
                </header>

                {/* --- How to Use Dropdown --- */}
                <div className="mb-6">
                    <button 
                        onClick={() => setIsHelpOpen(!isHelpOpen)}
                        className="w-full flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm hover:border-emerald-500/50 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <HelpCircle size={20} className="text-emerald-500" />
                            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-tight">How to use this tool?</span>
                        </div>
                        <motion.div animate={{ rotate: isHelpOpen ? 180 : 0 }}>
                            <ChevronDown size={20} className="text-slate-400" />
                        </motion.div>
                    </button>
                    <AnimatePresence>
                        {isHelpOpen && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                                        <span className="text-emerald-600 block mb-1">Step 1</span>
                                        Copy the auto-generated email address below.
                                    </div>
                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                                        <span className="text-emerald-600 block mb-1">Step 2</span>
                                        Use it on any website for registration or verification.
                                    </div>
                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                                        <span className="text-emerald-600 block mb-1">Step 3</span>
                                        Check the Inbox section below for your incoming messages.
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Email Display Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-emerald-500/5 border border-slate-100 dark:border-slate-800 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-1 w-full">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block ml-1">Current Session Email</label>
                            <div className="relative group">
                                <input 
                                    readOnly 
                                    value={loading ? "Generating..." : address}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-base md:text-lg font-mono font-bold text-slate-700 dark:text-emerald-400/90 focus:outline-none focus:border-emerald-500/50 transition-all"
                                />
                                <button 
                                    onClick={copyToClipboard}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 text-white p-3 rounded-xl hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20 transition-all"
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className="w-full md:w-auto mt-2 md:mt-7">
                            <button 
                                onClick={generateEmail}
                                className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 dark:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-emerald-500/10"
                            >
                                <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Inbox Area */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-emerald-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden min-h-100">
                    <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-emerald-500/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                <Inbox size={20} />
                            </div>
                            <h2 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">Live Inbox</h2>
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                        </div>
                    </div>

                    <div className="relative">
                        <AnimatePresence mode="wait">
                            {selectedMsg ? (
                                <motion.div 
                                    key="detail"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-6 md:p-8 w-full overflow-hidden"
                                >
                                    <button 
                                        onClick={() => setSelectedMsg(null)}
                                        className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 font-bold text-xs uppercase tracking-widest mb-8 transition-colors"
                                    >
                                        <ArrowLeft size={16} /> Back
                                    </button>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 leading-tight wrap-break-word">{selectedMsg.subject}</h3>
                                    <div 
                                        className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 bg-emerald-50/20 dark:bg-emerald-950/10 p-4 md:p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 overflow-x-auto"
                                        style={{ wordBreak: 'break-word' }}
                                        dangerouslySetInnerHTML={{ __html: `
                                            <style>
                                                img { max-width: 100% !important; height: auto !important; border-radius: 12px; }
                                                table { width: 100% !important; table-layout: fixed !important; }
                                            </style>
                                            ${selectedMsg.html || selectedMsg.text}
                                        `}}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="list"
                                    className="divide-y divide-slate-50 dark:divide-slate-800"
                                >
                                    {messages.length === 0 ? (
                                        <div className="p-24 text-center">
                                            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/5 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-200 dark:text-emerald-900/30">
                                                <Clock size={40} />
                                            </div>
                                            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Listening for incoming signals...</p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div 
                                                key={msg.id} 
                                                onClick={() => {
                                                    setMsgLoading(true);
                                                    axios.get(`${BASE_URL}/messages/${msg.id}`, {
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    }).then(res => {
                                                        setSelectedMsg(res.data);
                                                        setMsgLoading(false);
                                                    });
                                                }}
                                                className="p-6 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5 cursor-pointer transition-all flex items-start gap-4 group"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                                    <Mail size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-black text-xs uppercase tracking-tighter text-slate-400 group-hover:text-emerald-500 transition-colors">
                                                            {msg.from.address.split('@')[0]}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400">
                                                            {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 line-clamp-1">{msg.subject}</p>
                                                    <p className="text-xs text-slate-500 line-clamp-1">{msg.intro}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {msgLoading && (
                            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-10">
                                <RefreshCw className="animate-spin text-emerald-500" size={32} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Section */}
                <footer className="mt-12 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
                        Self-Destructing Emails • End-to-End Privacy
                    </p>
                </footer>
                <RelatedTools categoryId='utility' />

            </div>
        </div>
    );
};

export default TempEmail;