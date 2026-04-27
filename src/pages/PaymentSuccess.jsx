import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight, Sparkles, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        navigate("/dashboard");
        return;
      }

      try {
        // তোমার ব্যাকএন্ডের verify-payment রাউটে রিকোয়েস্ট পাঠানো হচ্ছে
        const res = await axios.post(`${import.meta.env.VITE_API_URL || "import.meta.env.VITE_API_URL"}/api/payment/verify-payment`, {
          sessionId,
        });

        if (res.data.success) {

  const plan = res.data.plan; // backend থেকে plan আসবে

  localStorage.setItem("plan", plan);

  toast.success("Payment Verified! Welcome to Pro 🚀");

  setLoading(false);
} else {
  toast.error("Payment verification failed. Please contact support.");
  navigate("/pricing");
}
      } catch (err) {
        console.error("Verification error:", err);
        toast.error("Something went wrong during verification.");
        navigate("/pricing");
      }
    };

    verifyPayment();
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"
        />
        <p className="text-gray-600 font-medium">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-[500px] w-full bg-white p-10 rounded-[40px] shadow-2xl shadow-blue-100 text-center border border-gray-100"
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="bg-green-100 p-5 rounded-full"
          >
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </motion.div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center justify-center gap-2">
          Payment Successful <PartyPopper className="text-yellow-500" />
        </h1>
        <p className="text-gray-500 font-medium mb-8">
          Thank you for your purchase! Your account has been upgraded, and all premium features are now unlocked.
        </p>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/dashboard")}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            Go to Dashboard <ArrowRight className="w-5 h-5" />
          </motion.button>
          
          <div className="flex items-center justify-center gap-2 text-sm text-blue-600 font-bold py-2">
            <Sparkles className="w-4 h-4" /> Enjoy your Pro access
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-50 text-xs text-gray-400">
          Order ID: {sessionId?.substring(0, 20)}...
        </div>
      </motion.div>
    </div>
  );
}