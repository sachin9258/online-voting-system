import mongoose from "mongoose";

const electionSchema = new mongoose.Schema({
  title: String,
  constituency: String,
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: false }
});

const Election = mongoose.models.Election || mongoose.model("Election", electionSchema);
export default Election;