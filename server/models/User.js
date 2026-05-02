import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  plan: {
    type: String,
    enum: ["free", "pro", "lifetime"],
    default: "free",
  },

  isPro: { type: Boolean, default: false },
  
  // এই ফিল্ডগুলো আপনার auth.js এ আছে, তাই এখানেও থাকতে হবে
  usageCount: { type: Number, default: 0 },
  usageLimit: { type: Number, default: 5 },

  aiUsageToday: { type: Number, default: 0 },
  lastUsageDate: { type: Date, default: Date.now },

  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;