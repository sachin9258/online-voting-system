// backend/routes/electionRoutes.js
import express from "express";
import mongoose from "mongoose";
import Vote from "../models/Vote.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // generic token with roles

const router = express.Router();

// ================= COUNT VOTES =================
// Only ECI or admin can access
router.get(
  "/count/:electionId",
  verifyToken(["ECI", "admin"]), // checks token + allowed roles
  async (req, res) => {
    try {
      const { electionId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(electionId)) {
        return res.status(400).json({ success: false, message: "Invalid election ID" });
      }

      const results = await Vote.aggregate([
        { $match: { election: new mongoose.Types.ObjectId(electionId) } },
        { $group: { _id: "$candidate", totalVotes: { $sum: 1 } } },
      ]);

      res.json({ success: true, results });
    } catch (error) {
      console.error("Vote Count Error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;