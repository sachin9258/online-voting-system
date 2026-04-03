import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  // --- Basic Info (Signup waali) ---
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  aadhaar: { type: String, required: true, unique: true },
  dob: { type: Date },
  mobile: { type: String },
  party: { type: String, required: true },
  constituency: { type: String, required: true },
  password: { type: String, required: true },
  
  // --- Nomination Services (New Fields) ---
  education: { type: String, default: "" },
  assets: { type: Number, default: 0 },
  liabilities: { type: Number, default: 0 },
  manifesto: { type: String, default: "" },
  criminalRecords: { type: String, default: "None" },
  
  // --- Expenditure & Finance ---
  electionAccountNo: { type: String },
  totalExpenses: { type: Number, default: 0 },
  
  // --- System Fields ---
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true }); // Isse updatedAt automatically manage hoga

const Candidate = mongoose.models.Candidate || mongoose.model("Candidate", candidateSchema);
export default Candidate;