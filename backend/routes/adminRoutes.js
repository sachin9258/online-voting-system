// backend/routes/adminRoutes.js
import express from "express";
import {
  getDashboardStats,
  getAllCandidates,
  approveCandidate,
  rejectCandidate,
  getAllVoters,
  approveVoter,
  blockVoter,
  getAllElections,
  createElection,
  startElection,
  stopElection,
  getAllComplaints,
  getLiveResults,
  getTurnout,
  getResults,
  getStateResults
} from "../controllers/adminController.js";

import { verifyECIToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= DASHBOARD ================= */
router.get("/dashboard", verifyECIToken, getDashboardStats);

/* ================= CANDIDATES ================= */
router.get("/candidates", verifyECIToken, getAllCandidates);
router.put("/approve-candidate/:id", verifyECIToken, approveCandidate);
router.delete("/reject-candidate/:id", verifyECIToken, rejectCandidate);

/* ================= VOTERS ================= */
router.get("/voters", verifyECIToken, getAllVoters);
router.put("/approve-voter/:id", verifyECIToken, approveVoter);
router.put("/block-voter/:id", verifyECIToken, blockVoter);

/* ================= ELECTIONS ================= */
router.get("/elections", verifyECIToken, getAllElections);
router.post("/create-election", verifyECIToken, createElection);
router.put("/start-election/:id", verifyECIToken, startElection);
router.put("/stop-election/:id", verifyECIToken, stopElection);

/* ================= COMPLAINTS ================= */
router.get("/complaints", verifyECIToken, getAllComplaints);

/* ================= ANALYTICS ================= */
router.get("/live-results", verifyECIToken, getLiveResults);
router.get("/turnout", verifyECIToken, getTurnout);
router.get("/results", verifyECIToken, getResults);
router.get("/state-results", verifyECIToken, getStateResults);

export default router;