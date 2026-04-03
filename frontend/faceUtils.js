// frontend/faceUtils.js
async function generateFaceHashFromDataURL(dataUrl) {
  const base64 = dataUrl.split(",")[1];                  // Base64 string
  const buffer = new TextEncoder().encode(base64);       // UTF-8 bytes
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer); // SubtleCrypto
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
