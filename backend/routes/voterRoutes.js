import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import * as faceapi from "face-api.js";
import "@tensorflow/tfjs"; // 🔥 FAST (install required)
import canvas from "canvas";
import jwt from "jsonwebtoken";
import Voter from "../models/Voter.js";
import { verifyVoterToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= PATH =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ FIXED (NO DOUBLE backend issue)
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

console.log("📁 Upload Folder:", uploadDir);

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ================= FACE API =================
const { Canvas, Image, ImageData, loadImage } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// ================= MODEL PATH =================
const MODEL_PATHS = [
  path.join(__dirname, "../models-face"),
  path.join(__dirname, "../models/models-face"),
];

const MODEL_PATH = MODEL_PATHS.find(p => fs.existsSync(p));

if (!MODEL_PATH) {
  console.error("❌ models-face folder not found!");
  process.exit(1);
}

// ================= LOAD MODELS =================
async function loadModels() {
  console.log("⏳ Loading Models...");
  await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
  console.log("✅ Models Loaded");
}
await loadModels();

// ================= FACE LOGIC =================
async function getFaceDescriptor(filePath) {
  const img = await loadImage(filePath);

  const detection = await faceapi
    .detectSingleFace(
      img,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: 320,
        scoreThreshold: 0.5,
      })
    )
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) throw new Error("Face not detected");

  return Array.from(detection.descriptor);
}

function distance(a, b) {
  return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
}

// ================= REGISTER =================
router.post("/register", upload.single("photo"), async (req, res) => {
  try {
    const { name, aadhaarNumber, dob, mobile, address } = req.body;
    const photo = req.file;

    if (!name || !aadhaarNumber || !dob || !mobile || !address || !photo) {
      return res.status(400).json({ success: false, msg: "All fields required" });
    }

    // ✅ FIXED (no custom method dependency)
    const existing = await Voter.findOne({ aadhaarNumber });

    if (existing) {
      if (fs.existsSync(photo.path)) fs.unlinkSync(photo.path);
      return res.json({
        success: false,
        alreadyRegistered: true,
        voterId: existing.voterId,
      });
    }

    const descriptor = await getFaceDescriptor(photo.path);

    const voter = new Voter({
      name,
      aadhaarNumber,
      dob,
      mobile,
      address,
      photo: photo.filename,
      faceDescriptor: descriptor,
    });

    await voter.save();

    res.json({ success: true, voterId: voter.voterId });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ success: false, msg: err.message });
  }
});

// ================= LOGIN FACE =================
router.post("/login-face", upload.single("photo"), async (req, res) => {
  try {
    const photo = req.file;
    if (!photo) {
      return res.status(400).json({ success: false, msg: "Upload photo" });
    }

    const query = await getFaceDescriptor(photo.path);
    const voters = await Voter.find({ isBlocked: false });

    let best = null;
    let bestDist = Infinity;
    let secondBest = Infinity;

    for (const v of voters) {
      if (!v.faceDescriptor || v.faceDescriptor.length !== 128) continue;

      const dist = distance(query, v.faceDescriptor);

      if (dist < bestDist) {
        secondBest = bestDist;
        bestDist = dist;
        best = v;
      } else if (dist < secondBest) {
        secondBest = dist;
      }
    }

    const STRICT_THRESHOLD = 0.5;
    const GAP_THRESHOLD = 0.05;

    if (!best || bestDist > STRICT_THRESHOLD || (secondBest - bestDist < GAP_THRESHOLD)) {
      if (fs.existsSync(photo.path)) fs.unlinkSync(photo.path);
      return res.status(401).json({ success: false, msg: "Face not matched" });
    }

    if (fs.existsSync(photo.path)) fs.unlinkSync(photo.path);

    const token = jwt.sign(
      { id: best._id, role: "voter" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "12h" }
    );

    res.json({
      success: true,
      token,
      voter: {
        name: best.name,
        voterId: best.voterId,
        aadhaarNumber: best.aadhaarNumber,
        photo: best.photo,
        photoUrl: `http://localhost:5000/uploads/${best.photo}` // ✅ ready to use
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, msg: err.message });
  }
});

// ================= TRACK =================
router.get("/track/:aadhaar", async (req, res) => {
  try {
    const voter = await Voter.findOne({ aadhaarNumber: req.params.aadhaar });

    if (!voter) {
      return res.status(404).json({
        success: false,
        msg: "Voter not found"
      });
    }

    res.json({
      success: true,
      voter: {
        ...voter.toObject(),
        photoUrl: `http://localhost:5000/uploads/${voter.photo}`
      }
    });

  } catch (err) {
    console.error("TRACK ERROR:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ================= CURRENT =================
router.get("/current", verifyVoterToken, async (req, res) => {
  try {
    const voter = await Voter.findById(req.user.id);

    res.json({
      success: true,
      voter: {
        ...voter.toObject(),
        photoUrl: `http://localhost:5000/uploads/${voter.photo}`
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ================= VOTE =================
router.post("/vote", verifyVoterToken, async (req, res) => {
  try {
    const voter = await Voter.findById(req.user.id);

    if (!voter.canVote()) {
      return res.json({ success: false, msg: "already voted" });
    }

    voter.castVote(req.body.party);
    await voter.save();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

export default router;