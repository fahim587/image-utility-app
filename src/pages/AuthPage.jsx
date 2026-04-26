import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Sparkles, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function AuthPage() {

  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);



  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) navigate("/dashboard");

  }, [navigate]);



  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!email || !password || (mode === "signup" && !name)) {
      toast.error("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      const url =
        mode === "login"
          ? `${API}/api/auth/login`
          : `${API}/api/auth/signup`;

      const payload =
        mode === "login"
          ? { email, password }
          : { name, email, password };

      const res = await axios.post(url, payload);

      if (res.data.token) {

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user._id);
        localStorage.setItem("plan", res.data.user.plan);

        axios.defaults.headers.common["Authorization"] =
          `Bearer ${res.data.token}`;

        toast.success(
          mode === "login"
            ? "Login successful"
            : "Account created"
        );

        setTimeout(() => {

          navigate("/dashboard");

        }, 1200);

      }

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Authentication failed"
      );

    } finally {

      setLoading(false);

    }

  };



  const toggleMode = () => {

    setMode(mode === "login" ? "signup" : "login");

  };



  return (

    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">

      <div className="w-[420px] bg-white p-10 rounded-3xl shadow-lg">

        <div className="text-center mb-8">

          <Sparkles className="mx-auto mb-4 text-blue-500" size={32} />

          <h2 className="text-3xl font-bold">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>

        </div>



        <form onSubmit={handleSubmit} className="space-y-4">

          <AnimatePresence>

            {mode === "signup" && (

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative"
              >

                <User className="absolute left-3 top-3 text-gray-400" size={18} />

                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border p-3 pl-10 rounded-xl"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

              </motion.div>

            )}

          </AnimatePresence>



          <div className="relative">

            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />

            <input
              type="email"
              placeholder="Email"
              className="w-full border p-3 pl-10 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>



          <div className="relative">

            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border p-3 pl-10 pr-10 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="absolute right-3 top-3"
              onClick={() => setShowPassword(!showPassword)}
            >

              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}

            </button>

          </div>



          {mode === "login" && (

            <div className="text-right text-sm">

              <button
                type="button"
                className="text-blue-500"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>

            </div>

          )}



          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-xl"
          >

            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}

          </motion.button>

        </form>



        <div className="text-center mt-6 text-sm">

          {mode === "login"
            ? "New here?"
            : "Already have account?"}

          <button
            onClick={toggleMode}
            className="text-blue-500 ml-2"
          >

            {mode === "login"
              ? "Create account"
              : "Sign in"}

          </button>

        </div>

      </div>

    </div>

  );

}