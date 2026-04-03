import * as faceapi from "face-api.js";
import * as tf from "@tensorflow/tfjs";
import canvas from "canvas";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ================= CANVAS SETUP =================
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// ================= PATH SETUP =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👉 IMPORTANT: folder name exactly same hona chahiye
const MODEL_PATH = path.join(__dirname, "../models-face");

// ================= LOAD MODELS =================
export async function loadModels() {
  try {
    console.log("⏳ Loading Face-API Models...");

    // check folder exists
    if (!fs.existsSync(MODEL_PATH)) {
      throw new Error(`❌ Models folder not found: ${MODEL_PATH}`);
    }

    await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);

    console.log("✅ All Models Loaded Successfully");
  } catch (err) {
    console.error("❌ Model Loading Failed:", err.message);
    process.exit(1);
  }
}

// ================= GET FACE DESCRIPTOR =================
export async function getFaceDescriptor(imagePath) {
  try {
    // check file exists
    if (!fs.existsSync(imagePath)) {
      console.log("❌ Image not found:", imagePath);
      return null;
    }

    const img = await canvas.loadImage(imagePath);

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

    if (!detection) {
      console.log("❌ No face detected in image");
      return null;
    }

    return Array.from(detection.descriptor);
  } catch (err) {
    console.error("❌ Descriptor Error:", err.message);
    return null;
  }
}

// ================= COMPARE FACES =================
export function compareDescriptors(desc1, desc2) {
  if (!desc1 || !desc2) return Infinity;

  if (desc1.length !== 128 || desc2.length !== 128) {
    return Infinity;
  }

  let sum = 0;
  for (let i = 0; i < 128; i++) {
    sum += Math.pow(desc1[i] - desc2[i], 2);
  }

  return Math.sqrt(sum);
}

// ================= MATCH CHECK =================
export function isFaceMatch(desc1, desc2, threshold = 0.5) {
  const distance = compareDescriptors(desc1, desc2);

  console.log("📏 Face Distance:", distance);

  return distance < threshold;
}