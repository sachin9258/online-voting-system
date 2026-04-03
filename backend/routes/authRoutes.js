// backend/routes/authRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyECIToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= ECI ADMIN LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase(), role: "ECI" });

    if (!user)
      return res.status(401).json({ success: false, message: "ECI Admin not found" });

    if (user.isBlocked)
      return res.status(403).json({ success: false, message: "Account is blocked" });

    // Direct password check (no OTP, no SDM/BLO logic)
    if (user.password !== password)
      return res.status(401).json({ success: false, message: "Invalid password" });

    // JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "12h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "Login Successful",
    });

  } catch (err) {
    console.error("ECI Login Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/* ================= CREATE ECI ADMIN (PROTECTED) ================= */
router.post("/create-eci", verifyECIToken, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ success: false, message: "User already exists" });

    const eciAdmin = new User({
      name: name || "ECI Admin",
      email: email.toLowerCase(),
      password, // No hashing, as per your setup
      role: "ECI",
      isApproved: true,
      isBlocked: false,
    });

    await eciAdmin.save();

    res.json({ success: true, message: "ECI Admin Created Successfully" });

  } catch (err) {
    console.error("Create ECI Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;