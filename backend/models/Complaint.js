import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  candidateId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Candidate", 
    required: true 
  },
  candidateName: String, // Debugging ke liye asaan rehta hai
  email: String,
  constituency: String,
  violationType: { 
    type: String, 
    enum: ["MCC Violation", "Bribery", "Illegal Rally", "Hate Speech", "Other"],
    default: "MCC Violation"
  },
  description: { type: String, required: true },
  evidenceUrl: { type: String },
  location: { type: String },
  status: { 
    type: String, 
    enum: ["Pending", "Under Investigation", "Resolved", "Dismissed"], 
    default: "Pending" 
  },
  filedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Complaint = mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);
export default Complaint;