import React, { useState, useEffect, useRef } from "react";
// mousePointer2 কে সরিয়ে MousePointer2 করা হয়েছে
import { RefreshCw, Zap, Target, Trophy, Keyboard, Timer, MousePointer2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RelatedTools from '../../components/RelatedTools';

const aiSentences = [
    "The concept of sustainable development relies on the integration of environmental protection, economic growth, and social equity to ensure that future generations can meet their own needs.",
    "Effective leadership in the workplace requires a combination of emotional intelligence, strategic thinking, and the ability to inspire and motivate diverse teams.",
    "Software engineering is more than just writing lines of code; it is a discipline that involves problem-solving, architectural design, and continuous learning.",
    "Digital marketing has become an essential component of any successful business strategy, leveraging data analytics and social media to reach targeted audiences."
];

const ProTypingTest = () => {
    const [text, setText] = useState("");
    const [input, setInput] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [timerMode, setTimerMode] = useState(30);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [errors, setErrors] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [bestWpm, setBestWpm] = useState(parseInt(localStorage.getItem("bestWpm")) || 0);

    const inputRef = useRef(null);

    const loadNewText = () => {
        const randomIndex = Math.floor(Math.random() * aiSentences.length);
        setText(aiSentences[randomIndex]);
        setInput("");
        setStartTime(null);
        setTimeLeft(timerMode);
        setWpm(0);
        setAccuracy(100);
        setErrors(0);
        setIsFinished(false);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    useEffect(() => { loadNewText(); }, [timerMode]);

    useEffect(() => {
        let interval;
        if (startTime && !isFinished && timerMode !== 0 && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) { setIsFinished(true); return 0; }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [startTime, isFinished, timerMode, timeLeft]);

    const handleChange = (e) => {
        const value = e.target.value;
        if (isFinished) return;
        if (!startTime) setStartTime(Date.now());
        setInput(value);

        let errCount = 0;
        value.split("").forEach((char, i) => {
            if (char !== text[i]) errCount++;
        });

        setErrors(errCount);
        setAccuracy(value.length ? Math.round(((value.length - errCount) / value.length) * 100) : 100);
        
        const timePassed = (Date.now() - startTime) / 60000;
        if (timePassed > 0) setWpm(Math.round((value.length / 5) / timePassed));
        if (value.length === text.length) setIsFinished(true);
    };

    return (
        <main className="min-h-screen bg-white text-slate-800 font-sans selection:bg-emerald-100">
            <div className="max-w-5xl mx-auto p-6 md:p-12">
                
                {/* Header */}
                <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Keyboard className="text-emerald-600" size={20} />
                            <span className="text-emerald-600 font-bold tracking-widest text-[10px] uppercase">Pro Typing</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            SiteNexa <span className="text-emerald-600">Type</span>
                        </h1>
                    </div>
                    
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                        {[15, 30, 60, 0].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTimerMode(t)}
                                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${timerMode === t ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-900'}`}
                            >
                                {t === 0 ? "∞" : `${t}s`}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Dashboard Area */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-slate-50 bg-slate-50/30">
                        <QuickStat label="Speed" value={wpm} unit="wpm" color="text-emerald-600" icon={<Zap size={14}/>} />
                        <QuickStat label="Accuracy" value={accuracy} unit="%" color="text-blue-600" icon={<Target size={14}/>} />
                        <QuickStat label="Time" value={timerMode === 0 ? "∞" : timeLeft} unit="s" color="text-orange-600" icon={<Timer size={14}/>} />
                        <QuickStat label="Best Score" value={bestWpm} unit="wpm" color="text-slate-900" icon={<Trophy size={14}/>} />
                    </div>

                    <div className="p-8 md:p-16 relative">
                        {/* Interactive Text Display */}
                        <div className="relative min-h-[180px] font-mono text-2xl md:text-3xl leading-relaxed tracking-tight select-none mb-12">
                            <div className="flex flex-wrap gap-x-[0.15em]">
                                {text.split("").map((char, i) => {
                                    let color = "text-slate-300";
                                    let isCurrent = i === input.length;
                                    
                                    if (i < input.length) {
                                        color = input[i] === char ? "text-slate-800" : "text-red-500 bg-red-50 rounded px-0.5";
                                    }

                                    return (
                                        <span key={i} className={`relative transition-colors duration-75 ${color}`}>
                                            {isCurrent && !isFinished && (
                                                <motion.span 
                                                    layoutId="caret"
                                                    className="absolute -left-[1px] top-[15%] w-[2px] h-[70%] bg-emerald-500"
                                                    animate={{ opacity: [1, 0, 1] }}
                                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                                />
                                            )}
                                            {char}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Hidden Input Layer */}
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={handleChange}
                            disabled={isFinished}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-default"
                            autoFocus
                            spellCheck="false"
                        />

                        {/* Focus/Action Overlay */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-10">
                            <button 
                                onClick={loadNewText}
                                className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold text-sm rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                            >
                                <RefreshCw size={18} />
                                New Challenge
                            </button>
                            <div className="flex items-center gap-3 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                                <MousePointer2 size={14} className="text-emerald-500" />
                                Click anywhere to focus
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {isFinished && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/5 backdrop-blur-md"
                        >
                            <motion.div 
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                                className="bg-white p-12 rounded-[3rem] text-center max-w-sm w-full shadow-2xl border border-slate-100"
                            >
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Trophy className="text-emerald-600" size={40} />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 mb-2">Well Done, {wpm} WPM!</h2>
                                <p className="text-slate-500 text-sm mb-10 leading-relaxed">Your accuracy was {accuracy}%. Keep practicing to break your best record!</p>
                                
                                <button 
                                    onClick={loadNewText}
                                    className="w-full py-5 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
                                >
                                    Play Again
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-28">
                    <RelatedTools categoryId='utility'/>
                </div>
            </div>
        </main>
    );
};

const QuickStat = ({ label, value, unit, color, icon }) => (
    <div className="p-8 text-center border-r last:border-r-0 border-slate-100/50">
        <div className="flex items-center justify-center gap-2 text-slate-400 mb-2">
            {icon}
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
        </div>
        <div className={`text-4xl font-black tracking-tighter ${color}`}>
            {value}<span className="text-xs ml-1 text-slate-300 font-bold uppercase">{unit}</span>
        </div>
    </div>
);

export default ProTypingTest;