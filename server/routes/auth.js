import express from "express";
import User from "../models/User.js";
import { verifyUser } from "../middleware/auth.js";

const router = express.Router();

// Login endpoint
router.post("/login", verifyUser, async (req, res) => {
  try {
    const { uid, email } = req.firebaseUser;

    if (!uid || !email) {
      return res.status(400).json({ error: "Missing user information" });
    }

    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({
        uid,
        email: email.toLowerCase(),
        role: "staff"
      });
    }

    res.status(200).json({
      _id: user._id,
      uid: user.uid,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Logout endpoint (client-side, but useful for audit)
router.post("/logout", verifyUser, async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
});

// Get current user
router.get("/me", verifyUser, async (req, res) => {
  try {
    res.status(200).json({
      _id: req.user._id,
      uid: req.user.uid,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;