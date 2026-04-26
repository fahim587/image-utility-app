import React, { useState, useEffect } from "react";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import SubscribeButton from "../components/SubscribeButton";
import axios from "axios";

export default function Pricing() {
  const [userPlan, setUserPlan] = useState("free");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // ইউজারের বর্তমান প্ল্যান ডাটাবেস থেকে চেক করা
  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!userId || !token) return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserPlan(res.data.plan || "free");
      } catch (err) {
        console.error("Error fetching plan:", err);
      }
    };
    fetchUserPlan();
  }, [userId, token]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">Pricing Plans</h2>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-950 mb-4">
            Ready to upgrade your workflow?
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
            Choose the perfect plan for your creative needs. Unlock powerful AI tools and priority processing.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gray-950">$0</span>
                <span className="text-gray-500 font-medium">/forever</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <FeatureItem text="20+ Essential Tools" />
              <FeatureItem text="5 AI conversions per day" />
              <FeatureItem text="Standard processing speed" />
              <FeatureItem text="Community support" />
            </ul>
            <button disabled className="w-full py-4 px-6 bg-gray-100 text-gray-400 font-bold rounded-2xl cursor-not-allowed">
              {userPlan === "free" ? "Current Plan" : "Basic Access"}
            </button>
          </div>

          {/* Pro Plan - Highlighted */}
          <div className="bg-white p-8 rounded-[32px] border-2 border-blue-600 shadow-xl shadow-blue-100/50 flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> MOST POPULAR
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                Pro <Crown className="w-5 h-5 text-yellow-500" />
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gray-950">$7</span>
                <span className="text-gray-500 font-medium">/month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <FeatureItem text="Unlimited AI access" isPro />
              <FeatureItem text="Everything in Free" isPro />
              <FeatureItem text="Batch processing" isPro />
              <FeatureItem text="Ad-free experience" isPro />
              <FeatureItem text="24/7 Priority support" isPro />
            </ul>
            {userPlan === "pro" ? (
              <button disabled className="w-full py-4 px-6 bg-green-50 text-green-600 font-bold rounded-2xl border border-green-200">
                Active Plan
              </button>
            ) : (
              <SubscribeButton plan="pro" />
            )}
          </div>

          {/* Lifetime Plan */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                Lifetime <Zap className="w-5 h-5 text-orange-500 shadow-sm" />
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gray-950">$39</span>
                <span className="text-gray-500 font-medium">/one-time</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <FeatureItem text="Lifetime access" />
              <FeatureItem text="All future AI tools" />
              <FeatureItem text="Exclusive beta features" />
              <FeatureItem text="Commercial usage" />
            </ul>
            {userPlan === "lifetime" ? (
              <button disabled className="w-full py-4 px-6 bg-orange-50 text-orange-600 font-bold rounded-2xl border border-orange-200">
                Lifetime Access
              </button>
            ) : (
              <SubscribeButton plan="lifetime" />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text, isPro = false }) {
  return (
    <li className="flex items-start gap-3">
      <div className={`mt-1 p-0.5 rounded-full ${isPro ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
        <Check className="w-3.5 h-3.5" />
      </div>
      <span className="text-gray-600 font-medium text-sm">{text}</span>
    </li>
  );
}