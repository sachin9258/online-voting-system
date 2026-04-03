// services/livenessService.js
// Simple backend blink/liveness check template
// Currently JS-level mock (replace with MediaPipe / real AI)

export async function detectBlink(filePath) {
  // 1️⃣ Simulate blink detection
  // In real system, pass image/video frames to AI
  console.log("Checking liveness for:", filePath);

  // Mock: 90% chance of detecting blink
  const random = Math.random();
  if (random > 0.1) {
    console.log("Blink detected ✅");
    return true;
  } else {
    console.log("Blink NOT detected ❌");
    return false;
  }
}
