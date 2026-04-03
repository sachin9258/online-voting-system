// backend/models/Admin.js

import mongoose from "mongoose";

/* ===================== ADMIN SCHEMA ===================== */
// This schema represents all administrative users. Currently focused on ECI Admin.
// Includes authentication, permissions, approval system, and activity logging.

const adminSchema = new mongoose.Schema({
  // Core credentials
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }, // hashed in pre-save hook
  role: { 
    type: String, 
    enum: ["ECI", "SDM", "BLO"], // Only ECI is active, others reserved for future
    required: true,
    default: "ECI"
  },
  name: { type: String, trim: true, default: "" },
  email: { type: String, lowercase: true, trim: true, default: "" },
  phone: { type: String, default: "" },
  constituency: { type: String, default: "" },

  /* ===================== APPROVAL SYSTEM ===================== */
  isApproved: { type: Boolean, default: true }, // ECI admin is auto-approved
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },

  /* ===================== SECURITY ===================== */
  isBlocked: { type: Boolean, default: false }, // For disabling login
  lastLogin: { type: Date }, // track last login
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },

  /* ===================== PERMISSIONS ===================== */
  permissions: {
    electionManagement: { type: Boolean, default: true }, // create/start/stop elections
    candidateManagement: { type: Boolean, default: true }, // approve/reject candidates
    voterManagement: { type: Boolean, default: true }, // approve/block voters
    complaintManagement: { type: Boolean, default: true }, // manage complaints
    resultManagement: { type: Boolean, default: true }, // view/generate results
    adminManagement: { type: Boolean, default: true } // manage other admins (optional)
  },

  /* ===================== ACTIVITY LOGS ===================== */
  activityLogs: [
    {
      action: String, // e.g., 'Created Election', 'Approved Candidate'
      ip: String,     // capture IP for security audit
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

// Create index on username for fast search
adminSchema.index({ username: 1 });

// Model export
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export default Admin;