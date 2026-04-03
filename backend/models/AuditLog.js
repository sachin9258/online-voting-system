// backend/models/AuditLog.js

import mongoose from "mongoose";

/* ===================== AUDIT LOG SCHEMA ===================== */
// Logs all admin actions for security and auditing purposes.
// Ideal for tracking ECI Admin operations such as login, elections, approvals, etc.

const auditSchema = new mongoose.Schema({
  action: { 
    type: String, 
    required: true, 
    trim: true 
    // e.g., 'Created Election', 'Approved Candidate', 'Blocked Voter'
  },
  performedBy: { 
    type: String, 
    required: true, 
    trim: true 
    // Store username or admin ID for reference
  },
  ip: { 
    type: String, 
    default: "0.0.0.0" 
    // IP address of admin performing the action
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  } // Automatic timestamp
}, { timestamps: true });

// Index for fast querying by performedBy or timestamp
auditSchema.index({ performedBy: 1, timestamp: -1 });

// Model export
const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditSchema);
export default AuditLog;