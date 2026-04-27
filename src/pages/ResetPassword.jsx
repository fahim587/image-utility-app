import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams(); 
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }

    try {
      setLoading(true);

      // Sending token in URL and password in body as required by your backend
      const response = await axios.post(
        `import.meta.env.VITE_API_URL/api/auth/reset-password/${token}`, 
        { password } 
      );

  // ResetPassword.jsx এর ভেতর
toast.success("Password updated! Please login with your new password.");
setTimeout(() => {
  navigate("/login"); // ইউজারকে লগইন পেজে পাঠিয়ে দাও
}, 2000);

    } catch (err) {
      // Dynamic error handling for international users
      const errorMsg = err.response?.data?.message || "Invalid or expired link.";
      toast.error(errorMsg);
      console.error("Reset Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-[400px]">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
          Reset Password
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Please enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white p-3 rounded-lg font-semibold transition-all ${
              loading 
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </div>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate("/login")}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}