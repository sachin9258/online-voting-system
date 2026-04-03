import express from "express";
import {
  registerCandidate,
  loginCandidate,
  getProfileById,    // Naya function: URL ID se profile laane ke liye
  updateProfile,     // Nomination details ke liye
  fileComplaint,     // MCC Violation ke liye
  myVotes,
  getAllCandidates,
} from "../controllers/candidateController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= PUBLIC ROUTES =================
router.get("/all", getAllCandidates);
// 1. Signup 
router.post("/register", registerCandidate);

// 2. Login 
router.post("/login", loginCandidate);

// 3. Get Profile by ID 
router.get("/profile-by-id", getProfileById);


// ================= SECURE / ACTION ROUTES =================

// 4. Update Profile 
router.put("/update-profile", updateProfile);

// 5. File Complaint 
router.post("/file-complaint", fileComplaint);

// 6. My Votes (Live counting updates)
router.get("/my-votes", myVotes);


export default router;