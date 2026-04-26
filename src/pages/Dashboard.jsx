import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  LogOut,
  Sparkles,
  Image as ImageIcon, // Image component conflict এড়াতে renaming
  FileText,
  Video,
  Music,
  LayoutDashboard,
  Lock,
  Crown,
  Wand2,
  Wrench
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ইউজার প্রো চেক লজিক (plan বা isPro যেকোনোটি থাকলে)
  const isPro = user?.plan === "pro" || user?.plan === "lifetime" || user?.isPro;

  const colors = {
    primary: '#0583F2',
    dark: '#010326',
    white: '#FFFFFF'
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // ১. টোকেন না থাকলে সরাসরি লগইন পেজে পাঠান
    if (!token) {
      navigate("/login"); 
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        // ২. টোকেন ইনভ্যালিড হলে লোকাল স্টোরেজ ক্লিয়ার করে লগইন পেজে পাঠান
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    // ৩. লগ আউট এর পর সাইন-ইন পেজে রিডাইরেক্ট
    navigate("/login"); 
  };

  const handleToolClick = (toolPath, isPremium) => {
    if (isPremium && !isPro) {
      alert("This is a Pro feature! Please upgrade your plan.");
      navigate("/pricing");
    } else {
      navigate(toolPath);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{borderColor: colors.primary}}></div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Sidebar - Fixed for better UX */}
    <div className="w-64 bg-white border-r p-6 shadow-sm flex flex-col min-h-screen">
        <div className="mb-10 flex items-center gap-2 px-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary }}>
            <Sparkles size={20} className="text-white fill-white" />
          </div>
          <span className="text-xl font-black tracking-tight" style={{ color: colors.dark }}>GOOGIZ</span>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active colors={colors} onClick={() => navigate("/dashboard")} />
          <NavItem icon={<Wand2 size={20} />} label="AI Magic" colors={colors} isPremium={!isPro} onClick={() => handleToolClick("/ai-tools", true)} />
          <NavItem icon={<ImageIcon size={20} />} label="Image Tools" colors={colors} onClick={() => handleToolClick("/image-tools", false)} />
          <NavItem icon={<FileText size={20} />} label="PDF Tools" colors={colors} onClick={() => handleToolClick("/pdf-tools", false)} />
          <NavItem icon={<Video size={20} />} label="Video Tools" colors={colors} onClick={() => handleToolClick("/video-tools", false)} />
          <NavItem icon={<Music size={20} />} label="Audio Tools" colors={colors} onClick={() => handleToolClick("/audio-tools", false)} />
          <NavItem icon={<Wrench size={20} />} label="Utility" colors={colors} onClick={() => handleToolClick("/utility-tools", false)} />
        </nav>
      </div>

      {/* Main Content - Added margin-left to offset fixed sidebar */}
     <div className="flex-1 p-10 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2" style={{ color: colors.dark }}>
              Welcome {user?.name || "User"}
              {isPro && <Crown className="text-yellow-500 w-7 h-7" />}
            </h2>
            <p className="text-gray-500">Manage your projects and smart tools</p>
          </div>
          <button 
            onClick={logout} 
            className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:opacity-90 active:scale-95"
            style={{ backgroundColor: '#EF4444' }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Account Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4" style={{ color: colors.dark }}>Account Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-0 pb-2">
                <span className="text-gray-500">Email</span>
                <span className="font-medium" style={{ color: colors.dark }}>{user?.email}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500">Active Plan</span>
                <span className="font-bold uppercase" style={{ color: isPro ? colors.primary : '#94A3B8' }}>
                  {user?.plan || "FREE"}
                </span>
              </div>
            </div>
          </div>
          
          {!isPro && (
            <div className="p-6 rounded-2xl shadow-lg text-white flex justify-between items-center relative overflow-hidden transition-transform hover:scale-[1.01]"
                 style={{ backgroundColor: colors.dark }}>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-1">Upgrade to Pro</h3>
                <p className="text-blue-100 text-sm opacity-80">Access premium AI Magic & Priority support</p>
              </div>
              <Link to="/pricing" 
                    className="bg-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md relative z-10 hover:bg-gray-100"
                    style={{ color: colors.dark }}>
                Upgrade
              </Link>
              <Wand2 className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-12" />
            </div>
          )}
        </div>

        {/* Main Tool Grid */}
        <h3 className="text-2xl font-bold mb-8" style={{ color: colors.dark }}>Available Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ToolCard icon={<Wand2 className="text-purple-500" />} title="AI Magic" desc="Explore all AI power tools in one place" isPremium={!isPro} colors={colors} onClick={() => handleToolClick("/ai-tools", true)} />
          <ToolCard icon={<ImageIcon style={{ color: colors.primary }} />} title="Image Tools" desc="Compress, Resize, Remove BG and more" colors={colors} onClick={() => handleToolClick("/image-tools", false)} />
          <ToolCard icon={<FileText className="text-blue-400" />} title="PDF Tools" desc="Merge, Split, Protect & Edit PDFs" colors={colors} onClick={() => handleToolClick("/pdf-tools", false)} />
          <ToolCard icon={<Video className="text-rose-500" />} title="Video Tools" desc="Cutter, Convert & Video to GIF" colors={colors} onClick={() => handleToolClick("/video-tools", false)} />
          <ToolCard icon={<Music className="text-orange-500" />} title="Audio Tools" desc="Trim, Merge, MP3 Converter & More" colors={colors} onClick={() => handleToolClick("/audio-tools", false)} />
          <ToolCard icon={<Wrench className="text-cyan-600" />} title="Utility" desc="Unit converters, calculators, and helpers" colors={colors} onClick={() => handleToolClick("/utility-tools", false)} />
        </div>
      </div>
    </div>
  );
}

// Sidebar Item Component
function NavItem({ icon, label, active, colors, isPremium, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group"
      style={{ 
        backgroundColor: active ? colors.primary : 'transparent',
        color: active ? 'white' : '#64748B'
      }}
    >
      <div className="flex items-center gap-3 font-medium">
        {icon} {label}
      </div>
      {isPremium && <Lock size={14} className="opacity-40 group-hover:opacity-100" />}
    </div>
  );
}

// Tool Card Component
function ToolCard({ icon, title, desc, isPremium, onClick, colors }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onClick={onClick} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white p-7 rounded-2xl shadow-sm cursor-pointer relative overflow-hidden border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
    >
      {isPremium && (
        <div className="absolute top-4 right-4 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
          <Lock size={14} className="text-gray-400" />
        </div>
      )}
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: '#F8FAFC' }}>
        {icon}
      </div>
      <h4 className="font-bold text-lg mb-2" style={{ color: colors.dark }}>{title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">{desc}</p>
      
      <div 
        className="py-2 px-4 rounded-lg text-sm font-bold text-center transition-all flex items-center justify-center gap-2"
        style={{ 
          backgroundColor: isHovered ? colors.dark : '#F1F5F9',
          color: isHovered ? 'white' : colors.dark
        }}
      >
        Open Tool
      </div>
    </div>
  );
}