import { Navigate } from "react-router-dom";

const ProRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const plan = localStorage.getItem("plan");

  // login না থাকলে login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // free user হলে pricing page
  if (plan === "free" || !plan) {
    return <Navigate to="/pricing" replace />;
  }

  // pro বা lifetime হলে access
  return children;
};

export default ProRoute;