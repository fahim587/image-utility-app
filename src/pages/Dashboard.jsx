import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  LogOut,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  LayoutDashboard,
  Lock,
  Crown,
  Wand2,
  Wrench,
  Menu,
  X
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // মোবাইল মেনুর জন্য স্টেট

  const isPro = user?.plan === "pro" || user?.plan === "lifetime" || user?.isPro;

  const colors = {
    primary: '#0583F2',
    dark: '#010326',
    white: '#FFFFFF'
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
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
    navigate("/login");
  };

  const handleToolClick = (toolPath, isPremium) => {
    if (isPremium && !isPro) {
      alert("This is a Pro feature! Please upgrade your plan.");
      navigate("/pricing");
    } else {
      navigate(toolPath);
    }
    setIsSidebarOpen(false); // মোবাইল মেনু বন্ধ করা
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colors.primary }}></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r p-6 shadow-xl lg:shadow-sm flex flex-col z-50 transition-transform duration-300 transform
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:block
      `}>
        <div className="mb-10 flex items-center justify-between lg:justify-start gap-2 px-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary }}>
              <Sparkles size={20} className="text-white fill-white" />
            </div>
            <span className="text-xl font-black tracking-tight" style={{ color: colors.dark }}>GOOGIZ</span>
          </div>
          {/* Close button for mobile */}
          <button className="lg:hidden p-1 text-gray-500" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active colors={colors} onClick={() => {navigate("/dashboard"); setIsSidebarOpen(false);}} />
          <NavItem icon={<Wand2 size={20} />} label="AI Magic" colors={colors} isPremium={!isPro} onClick={() => handleToolClick("/ai-tools", true)} />
          <NavItem icon={<ImageIcon size={20} />} label="Image Tools" colors={colors} onClick={() => handleToolClick("/image-tools", false)} />
          <NavItem icon={<FileText size={20} />} label="PDF Tools" colors={colors} onClick={() => handleToolClick("/pdf-tools", false)} />
          <NavItem icon={<Video size={20} />} label="Video Tools" colors={colors} onClick={() => handleToolClick("/video-tools", false)} />
          <NavItem icon={<Music size={20} />} label="Audio Tools" colors={colors} onClick={() => handleToolClick("/audio-tools", false)} />
          <NavItem icon={<Wrench size={20} />} label="Utility" colors={colors} onClick={() => handleToolClick("/utility-tools", false)} />
        </nav>
        
        {/* Mobile Logout (Sidebar এর নিচে) */}
        <button 
          onClick={logout}
          className="mt-4 lg:hidden flex items-center gap-3 p-3 rounded-xl text-red-500 font-bold hover:bg-red-50"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full overflow-x-hidden min-h-screen">
        {/* Mobile Header / Top Bar */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-30">
          <div className="flex items-center gap-2">
             <div className="p-1.5 rounded-md" style={{ backgroundColor: colors.primary }}>
                <Sparkles size={16} className="text-white fill-white" />
             </div>
             <span className="font-bold tracking-tight">GOOGIZ</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600 bg-gray-100 rounded-lg">
            <Menu size={24} />
          </button>
        </div>

        <div className="p-4 md:p-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2" style={{ color: colors.dark }}>
                Welcome {user?.name || "User"}
                {isPro && <Crown className="text-yellow-500 w-6 h-6 md:w-7 md:h-7" />}
              </h2>
              <p className="text-gray-500 text-sm md:text-base">Manage your projects and smart tools</p>
            </div>
            <button 
              onClick={logout} 
              className="hidden md:flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:opacity-90"
              style={{ backgroundColor: '#EF4444' }}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>

          {/* Account Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-10">
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.dark }}>Account Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-50 pb-2 overflow-hidden">
                  <span className="text-gray-500 shrink-0">Email</span>
                  <span className="font-medium truncate ml-4" style={{ color: colors.dark }}>{user?.email}</span>
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
              <div className="p-5 md:p-6 rounded-2xl shadow-lg text-white flex justify-between items-center relative overflow-hidden transition-transform hover:scale-[1.01]"
                   style={{ backgroundColor: colors.dark }}>
                <div className="relative z-10">
                  <h3 className="text-lg md:text-xl font-bold mb-1">Upgrade to Pro</h3>
                  <p className="text-blue-100 text-xs md:text-sm opacity-80">Access premium tools & support</p>
                </div>
                <Link to="/pricing" 
                      className="bg-white px-4 md:px-6 py-2 rounded-xl font-bold transition-all shadow-md relative z-10 hover:bg-gray-100 text-sm md:text-base"
                      style={{ color: colors.dark }}>
                  Upgrade
                </Link>
                <Wand2 className="absolute -right-4 -bottom-4 w-20 h-20 md:w-24 md:h-24 text-white/5 rotate-12" />
              </div>
            )}
          </div>

          {/* Main Tool Grid */}
          <h3 className="text-xl md:text-2xl font-bold mb-6" style={{ color: colors.dark }}>Available Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <ToolCard icon={<Wand2 className="text-purple-500" />} title="AI Magic" desc="Explore all AI power tools in one place" isPremium={!isPro} colors={colors} onClick={() => handleToolClick("/ai-tools", true)} />
            <ToolCard icon={<ImageIcon style={{ color: colors.primary }} />} title="Image Tools" desc="Compress, Resize, Remove BG and more" colors={colors} onClick={() => handleToolClick("/image-tools", false)} />
            <ToolCard icon={<FileText className="text-blue-400" />} title="PDF Tools" desc="Merge, Split, Protect & Edit PDFs" colors={colors} onClick={() => handleToolClick("/pdf-tools", false)} />
            <ToolCard icon={<Video className="text-rose-500" />} title="Video Tools" desc="Cutter, Convert & Video to GIF" colors={colors} onClick={() => handleToolClick("/video-tools", false)} />
            <ToolCard icon={<Music className="text-orange-500" />} title="Audio Tools" desc="Trim, Merge, MP3 Converter & More" colors={colors} onClick={() => handleToolClick("/audio-tools", false)} />
            <ToolCard icon={<Wrench className="text-cyan-600" />} title="Utility" desc="Unit converters, calculators, and helpers" colors={colors} onClick={() => handleToolClick("/utility-tools", false)} />
          </div>
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
      className="flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all group"
      style={{ 
        backgroundColor: active ? colors.primary : 'transparent',
        color: active ? 'white' : '#64748B'
      }}
    >
      <div className="flex items-center gap-3 font-semibold text-sm">
        {icon} {label}
      </div>
      {isPremium && <Lock size={14} className={active ? "text-white" : "opacity-40 group-hover:opacity-100"} />}
    </div>
  );
}

// Tool Card Component
function ToolCard({ icon, title, desc, isPremium, onClick, colors }) {
  return (
    <div 
      onClick={onClick} 
      className="bg-white p-6 md:p-7 rounded-2xl shadow-sm cursor-pointer relative overflow-hidden border border-gray-100 transition-all active:scale-[0.98] lg:hover:-translate-y-1 lg:hover:shadow-md"
    >
      {isPremium && (
        <div className="absolute top-4 right-4 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
          <Lock size={14} className="text-gray-400" />
        </div>
      )}
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: '#F8FAFC' }}>
        {icon}
      </div>
      <h4 className="font-bold text-lg mb-2" style={{ color: colors.dark }}>{title}</h4>
      <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-6">{desc}</p>
      
      <div 
        className="py-2.5 px-4 rounded-xl text-sm font-bold text-center transition-all flex items-center justify-center gap-2"
        style={{ backgroundColor: '#F1F5F9', color: colors.dark }}
      >
        Open Tool
      </div>
    </div>
  );
}