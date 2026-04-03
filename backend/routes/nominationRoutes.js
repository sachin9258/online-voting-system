// backend/routes/nominationRoutes.js
import express from "express";
import Nomination from "../models/Nomination.js";
import PDFDocument from "pdfkit";
import Candidate from "../models/Candidate.js";
import { verifyCandidateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= APPLY FOR NOMINATION =================
router.post("/apply", verifyCandidateToken, async (req, res) => {
  try {
    const candidateId = req.candidate.id; // from token
    const ticketId = "ECI-" + Date.now();

    const nomination = await Nomination.create({
      candidateId,
      ticketId
    });

    res.json({ success: true, message: "Application Submitted", nomination });
  } catch (err) {
    console.error("Nomination Apply Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ================= GENERATE TICKET PDF =================
router.get("/ticket/:id", async (req, res) => {
  try {
    const nomination = await Nomination.findById(req.params.id).populate({
      path: "candidateId",
      select: "-password" // exclude password
    });

    if (!nomination)
      return res.status(404).json({ success: false, message: "Nomination not found" });

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    doc.fontSize(20).text("Election Commission Ticket", { align: "center" });
    doc.moveDown();
    doc.text("Ticket ID: " + nomination.ticketId);
    doc.text("Candidate: " + nomination.candidateId.name);
    doc.text("Constituency: " + nomination.candidateId.constituency);
    doc.text("Party: " + nomination.candidateId.party);

    doc.end();
  } catch (err) {
    console.error("Generate Ticket Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;