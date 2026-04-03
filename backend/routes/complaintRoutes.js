// backend/routes/complaintRoutes.js
import express from "express";
import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // generic token with roles

const router = express.Router();

// ================= SUBMIT COMPLAINT =================
router.post("/submit", async (req, res) => {
  try {
    const { name, email, message, constituency } = req.body;

    if (!name || !email || !message || !constituency) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const complaint = new Complaint({ name, email, message, constituency });
    await complaint.save();

    res.json({ success: true, message: "Complaint Submitted Successfully" });
  } catch (err) {
    console.error("Complaint Submission Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ================= SDM VIEW COMPLAINTS =================
router.get("/sdm-complaints", verifyToken(["sdm"]), async (req, res) => {
  try {
    const sdmId = req.user.id; // from JWT token
    const sdm = await User.findById(sdmId);
    if (!sdm) return res.status(404).json({ success: false, message: "SDM not found" });

    const complaints = await Complaint.find({ constituency: sdm.constituency });

    res.json({ success: true, complaints });
  } catch (err) {
    console.error("Fetch Complaints Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;