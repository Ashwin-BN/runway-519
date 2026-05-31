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
    console.warn("Firebase service account file not found. Using default Firebase initialization.");
  }
}

// Initialize Firebase Admin SDK only once
if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  // Use default Firebase initialization without service account
  admin.initializeApp();
}

export default admin;