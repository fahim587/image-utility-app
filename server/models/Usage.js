// server/models/Usage.js
import mongoose from "mongoose";

const usageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tool: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Usage", usageSchema);