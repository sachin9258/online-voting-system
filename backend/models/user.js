// backend/models/User.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* ===================== USER SCHEMA ===================== */
// Covers ECI Admin, Voter, BLO (optional), with security, OTP, and face recognition support

const userSchema = new mongoose.Schema(
  {
    // ------------------- BASIC INFO -------------------
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["ECI", "VOTER"], default: "VOTER" },

    // ------------------- LOCATION INFO -------------------
    ward: { type: String, default: "" },
    panchayat: { type: String, default: "" },
    district: { type: String, default: "" },
    state: { type: String, default: "" },
    constituency: { type: String, default: "" },

    // ------------------- OTP FOR FUTURE 2FA -------------------
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },

    // ------------------- FACE RECOGNITION -------------------
    faceDescriptor: { type: [Number], default: [] },

    // ------------------- SECURITY & ACCESS -------------------
    isApproved: { type: Boolean, default: true }, // ECI Admins are approved manually in DB
    isBlocked: { type: Boolean, default: false },
    hasVoted: { type: Boolean, default: false },

    // ------------------- TRACKING -------------------
    lastLogin: { type: Date, default: null },
    failedLoginAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/* ===================== PASSWORD HASHING ===================== */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* ===================== INSTANCE METHODS ===================== */

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Voting eligibility check
userSchema.methods.canVote = function () {
  return this.isApproved && !this.hasVoted && !this.isBlocked;
};

// OTP management (for future use)
userSchema.methods.setOTP = function (otp, expiryMinutes = 5) {
  this.otp = otp;
  this.otpExpiry = new Date(Date.now() + expiryMinutes * 60000);
};

userSchema.methods.clearOTP = function () {
  this.otp = null;
  this.otpExpiry = null;
};

// Remove sensitive info from JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.otpExpiry;
  return obj;
};

/* ===================== EXPORT ===================== */
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;