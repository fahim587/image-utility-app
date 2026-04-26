import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

// =============================
// TOKEN GENERATOR
// =============================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// =============================
// SIGNUP
// =============================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,

      // default values (match schema)
      plan: "free",
      isPro: false,
      subscriptionType: "free",

      usageCount: 0,
      usageLimit: 5,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        isPro: user.isPro,
        usageCount: user.usageCount,
        usageLimit: user.usageLimit,
      },
    });

  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ message: "Signup failed" });
  }
});

// =============================
// LOGIN
// =============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        isPro: user.isPro,
        usageCount: user.usageCount,
        usageLimit: user.usageLimit,
      },
    });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

// =============================
// PROFILE
// =============================
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// =============================
// FORGOT PASSWORD
// =============================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    const resetLink =
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${token}`;

    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      url: resetLink,
    });

    return res.json({ message: "Password reset link sent" });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ message: "Error sending reset link" });
  }
});

// =============================
// RESET PASSWORD
// =============================
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { password: hashed },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "Password updated successfully" });

  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
});

export default router;