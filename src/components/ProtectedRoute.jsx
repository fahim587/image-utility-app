import { Navigate, useLocation } from "react-router-dom";

// এখানে 'requirePro' নামক একটি প্রপস যোগ করেছি যাতে একই কম্পোনেন্ট দিয়ে সব কাজ হয়
export default function ProtectedRoute({ children, user, requirePro = false }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // ১. যদি ইউজার লগইন না থাকে (টোকেন নেই)
  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // ২. যদি ইউজার ডেটা এখনো লোড না হয় (Loading state handle করার জন্য)
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ৩. যদি এটি একটি প্রো-টুল হয় এবং ইউজারের প্ল্যান ফ্রি হয়
  // আপনার ইউজারের ডাটাবেসে 'plan' ফিল্ডটি "pro" বা "lifetime" কি না তা চেক করছি
  const hasAccess = user.plan === "pro" || user.plan === "lifetime";

  if (requirePro && !hasAccess) {
    return <Navigate to="/pricing" replace />;
  }

  return children;
}