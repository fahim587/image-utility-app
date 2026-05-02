import express from "express";
import Stripe from "stripe";
import User from "../models/User.js";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ================= CHECKOUT SESSION ================= */
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { plan, userId } = req.body;

    if (!plan || !userId) {
      return res.status(400).json({
        error: "Missing plan or userId",
      });
    }

    const amountMap = {
      pro: 700,
      lifetime: 3900,
    };

    const amount = amountMap[plan];

    if (!amount) {
      return res.status(400).json({
        error: "Invalid plan",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      client_reference_id: userId,
      metadata: {
        userId,
        plan,
      },

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.toUpperCase()} Plan`,
              description: `Access to ${plan} features`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Session Error:", err.message);
    res.status(500).json({ error: "Stripe session failed" });
  }
});

/* ================= WEBHOOK ================= */
/**
 * ⚠️ IMPORTANT:
 * server.js এ এই route এর আগে MUST থাকতে হবে:
 * app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
 */

router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error`);
  }

  /* ================= PAYMENT SUCCESS ================= */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata?.userId || session.client_reference_id;
    const plan = session.metadata?.plan;

    if (!userId || !plan) {
      console.error("Missing metadata in webhook");
      return res.json({ received: true });
    }

    try {
      await User.findByIdAndUpdate(userId, {
        plan,
        isPro: true,
        subscriptionType: plan,
        subscriptionDate: new Date(),
      });

      console.log(`✅ User ${userId} upgraded to ${plan}`);

    } catch (err) {
      console.error("DB Update Error:", err.message);
    }
  }

  res.json({ received: true });
});

/* ================= VERIFY PAYMENT (MANUAL) ================= */
router.post("/verify-payment", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        error: "Session ID required",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (!userId || !plan) {
      return res.status(400).json({
        error: "Missing metadata",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        plan,
        isPro: true,
        subscriptionType: plan,
        subscriptionDate: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });

  } catch (err) {
    console.error("Verify Payment Error:", err.message);
    res.status(500).json({
      error: "Verification failed",
    });
  }
});

export default router;