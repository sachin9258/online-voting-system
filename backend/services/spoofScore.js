// services/spoofScore.js
// Simple spoof / gadget detection
// Mock logic: checks for sunglasses/earphone (random for demo)

export async function calculateSpoofScore(filePath) {
  console.log("Calculating spoof score for:", filePath);

  // Mock: 70-100 score
  const score = 70 + Math.floor(Math.random() * 31);
  console.log("Spoof score:", score);

  return score;
}
