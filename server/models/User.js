import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  plan: {
    type: String,
    enum: ["free", "pro", "lifetime"], // শুধু lowercase allowed
    default: "free",
  },

  isPro: { type: Boolean, default: false },
  subscriptionType: { type: String, default: "free" },

  aiUsageToday: { type: Number, default: 0 },
  lastUsageDate: { type: Date, default: Date.now },

  createdAt: { type: Date, default: Date.now },
});

// 🔥 IMPORTANT FIX (overwrite error solve)
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;