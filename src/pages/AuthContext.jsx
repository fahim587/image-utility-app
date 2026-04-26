import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // এটি টোকেন থেকে ডাটা বের করবে

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  // টোকেন যখনই পরিবর্তন হবে, ইউজার অবজেক্ট আপডেট হবে
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // নিশ্চিত করুন আপনার ব্যাকএন্ড টোকেনে 'plan' ফিল্ডটি পাঠাচ্ছে
        setUser(decoded); 
      } catch (error) {
        logout();
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, // এটিই প্রোটেক্টেড রাউটে চেক হবে
      login, 
      logout, 
      isAuthenticated: !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};