import admin from "firebase-admin";
import fs from "fs";

// Initialize Firebase Admin SDK from environment variable or local file.
// In production, set FIREBASE_ADMIN_CREDENTIALS to the JSON string of the service account.
let serviceAccount;

if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
  } catch (err) {
    console.error("Failed to parse FIREBASE_ADMIN_CREDENTIALS:", err.message);
    throw err;
  }
} else {
  // Fallback to local file if present (development only)
  try {
    const raw = fs.readFileSync("./firebase-admin.json", "utf8");
    serviceAccount = JSON.parse(raw);
  } catch (err) {
    console.error("Firebase service account not found. Set FIREBASE_ADMIN_CREDENTIALS env var or provide firebase-admin.json file.");
    throw err;
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;