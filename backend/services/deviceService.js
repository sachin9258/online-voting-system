// services/deviceService.js
// Gadget / device detection service
// Currently mock logic: no earphones, no sunglasses
// Can upgrade to real AI detection later

export async function detectGadgets(filePath) {
  console.log("Checking gadgets in photo:", filePath);

  // MOCK: random true/false for demonstration
  // true = gadgets detected (fail)
  // false = no gadgets detected (pass)
  const random = Math.random();

  // 80% chance no gadgets
  const hasGadgets = random < 0.2;

  console.log(hasGadgets ? "Gadgets detected ❌" : "No gadgets ✅");

  return !hasGadgets; // return true if clear
}
