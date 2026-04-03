// backend/routes/monitorRoutes.js
import express from "express";
import { verifyAdminToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= MONITORING =================
router.get("/", verifyAdminToken, (req, res) => {
  res.json({ success: true, message: "Monitoring route working" });
});

export default router;