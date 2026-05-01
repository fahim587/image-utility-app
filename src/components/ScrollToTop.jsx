import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // পেজ পরিবর্তন হওয়ার সাথে সাথে স্ক্রল একদম ওপরে (0,0) নিয়ে যাবে
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;