import mongoose from "mongoose";

const failedSchema = new mongoose.Schema({
  voterId: String,
  reason: String,
  ip: String,
  time: { type: Date, default: Date.now }
});

export default mongoose.model("FailedFaceLog", failedSchema);