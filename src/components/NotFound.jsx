import { motion } from 'framer-motion';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Decorative Circles */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-50 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl opacity-50" />

            <div className="max-w-xl w-full text-center relative z-10">
                {/* Animated Icon */}
                <motion.div
                    animate={{ 
                        y: [0, -20, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                    className="flex justify-center mb-8"
                >
                    <div className="relative">
                        <Ghost size={120} className="text-blue-600/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-6xl font-black text-blue-600">404</span>
                        </div>
                    </div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Oops! Page Not Found
                    </h1>
                    <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                        The page you're looking for doesn't exist or has been moved. 
                        Don't worry, your edits are safe!
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link 
                        to="/"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>
                    
                    <button 
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-200 text-gray-600 hover:text-blue-600 px-8 py-3 rounded-2xl font-bold transition-all hover:bg-blue-50 w-full sm:w-auto justify-center"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;