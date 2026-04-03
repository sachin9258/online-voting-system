// ================= IMPORTS =================
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

// ================= ROUTES =================
import authRoutes from "./routes/authRoutes.js";
import voterRoutes from "./routes/voterRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import electionRoutes from "./routes/electionRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

// ================= MODELS =================
import Vote from "./models/Vote.js";
import Voter from "./models/Voter.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ================= PATH FIX =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 PROJECT ROOT (VERY IMPORTANT)
const ROOT_DIR = path.resolve(__dirname, "..");

// ================= CORS =================
app.use(cors({
  origin: "http://localhost:5500",
  credentials: true
}));

// ================= BODY =================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ================= SESSION =================
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 4
  }
}));

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ DB Error:", err);
    process.exit(1);
  });


// ================= STATIC FILES =================

// 🔥 uploads (backend/uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔥 frontend (root/frontend)
app.use(express.static(path.join(ROOT_DIR, "frontend")));


// ================= QUICK ADMIN =================
app.get("/api/admin/quick-stats", async (req, res) => {
  try {
    const allVoters = await Voter.find();
    const votedUsers = allVoters.filter(v => v.hasVoted);

    res.json({
      success: true,
      totalRegistered: allVoters.length,
      totalVotes: votedUsers.length,
      turnout: allVoters.length
        ? ((votedUsers.length / allVoters.length) * 100).toFixed(2)
        : 0,
      recentVotes: votedUsers.slice(-10).reverse().map(v => ({
        name: v.name,
        voterId: v.voterId,
        votedParty: v.votedParty,
        voteTime: v.voteTime || "LIVE",
        constituency: v.constituency || "General"
      }))
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ================= ELECTION CONTROL =================
let electionState = { isPaused: false };

app.post("/api/admin/quick-control", (req, res) => {
  const { action } = req.body;
  electionState.isPaused = action === "pause";
  console.log(`🚨 Election ${action}`);
  res.json({ success: true, status: electionState });
});

app.get("/api/admin/check-status", (req, res) => {
  res.json(electionState);
});


// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/voter", voterRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/election", electionRoutes);
app.use("/api/complaints", complaintRoutes);


// ================= SOCKET =================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5500",
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("⚡ Admin connected");

  socket.on("voteCast", async () => {
    try {
      const results = await Voter.aggregate([
        { $match: { hasVoted: true } },
        { $group: { _id: "$votedParty", count: { $sum: 1 } } }
      ]);

      io.emit("voteUpdate", results);

    } catch (err) {
      console.error("❌ voteCast error:", err);
    }
  });

  socket.on("disconnect", () => console.log("❌ Admin disconnected"));
});


// ================= SPA FALLBACK =================
app.get("*", (req, res) => {

  if (req.url.startsWith("/api")) {
    return res.status(404).json({ message: "API not found" });
  }

  res.sendFile(path.join(ROOT_DIR, "frontend/index.html"));
});


// ================= START =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});