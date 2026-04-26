import axios from "axios";

export default function SubscribeButton({ plan }) {
  const handlePayment = async () => {
    try {
      // 1. Get userId from LocalStorage
      const userId = localStorage.getItem("userId"); 
      
      // Console logs for debugging
      console.log("Sending Plan:", plan);
      console.log("Found User ID:", userId);

      if (!userId) {
        // Changed this line to English
        alert("User ID not found! Please login first.");
        return;
      }

      // 2. Request to create payment session
      const res = await axios.post("http://localhost:5000/api/payment/create-checkout-session", {
        plan,
        userId,
      });

      // 3. Redirect to Stripe Checkout
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      // Backend error message or fallback
      alert("Error: " + (err.response?.data?.error || "Something went wrong"));
    }
  };

  return (
    <button 
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      onClick={handlePayment}
    >
      Buy Now
    </button>
  );
}