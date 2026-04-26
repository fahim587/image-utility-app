import express from "express";
import Stripe from "stripe";
import User from "../models/User.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ১. CHECKOUT SESSION তৈরি (client_reference_id সহ)
router.post("/create-checkout-session", async (req, res) => {
  const { plan, userId } = req.body;
  let amount = plan === "pro" ? 700 : plan === "lifetime" ? 3900 : null;

  if (!amount || !userId) {
    return res.status(400).json({ error: "Missing plan or userId" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      // Webhook এর জন্য client_reference_id এবং metadata দুটোই রাখা ভালো
      client_reference_id: userId, 
      metadata: { userId, plan },
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { 
            name: plan.toUpperCase() + " Plan",
            description: `Access to all ${plan} features`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Session Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ২. STRIPE WEBHOOK (অটোমেটিক ডাটাবেস আপডেট করার জন্য)
// মনে রাখবে: এই রাউটটি server.js এ express.raw() দিয়ে সেটআপ করতে হবে (নিচে বুঝিয়ে দিচ্ছি)
router.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // পেমেন্ট সফল হলে এই ইভেন্টটি ট্রিগার হবে
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id; // আমরা সেশনে যা পাঠিয়েছিলাম
    const plan = session.metadata.plan;

    try {
      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            plan: plan,
            isPro: true,
            subscriptionDate: new Date()
          }
        }
      );
      console.log(`Success: User ${userId} upgraded to ${plan}`);
    } catch (err) {
      console.error("Database Update Error in Webhook:", err.message);
    }
  }

  res.json({ received: true });
});

// ৩. ম্যানুয়াল ভেরিফিকেশন (তুমি যা আগে লিখেছিলে)
router.post("/verify-payment", async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: "No session ID" });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const { userId, plan } = session.metadata;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            plan: plan,
            isPro: true,
            subscriptionDate: new Date()
          }
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, user: updatedUser });
    } else {
      res.status(400).json({ success: false, message: "Payment not paid" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;