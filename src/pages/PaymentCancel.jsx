import React from "react";
import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="payment-cancel-container">
      <h1>Payment Cancelled ❌</h1>
      <p>Your payment was not completed.</p>
      <Link to="/pricing">
        <button>Go Back to Pricing</button>
      </Link>
    </div>
  );
}