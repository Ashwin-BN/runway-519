import express from "express";
import User from "../models/User.js";
import { verifyUser } from "../middleware/auth.js";
import { isManagementOrAdmin, isAdmin } from "../middleware/admin.js";

const router = express.Router();

// Dashboard test endpoint
router.get("/dashboard", verifyUser, isManagementOrAdmin, (req, res) => {
  res.json({ 
    message: "Welcome to Admin Dashboard",
    user: req.user.role,
  });
});

// Get all users (admin/management only)
router.get("/users", verifyUser, isManagementOrAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select("_id uid email role createdAt")
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Update user role (admin only)
router.put("/users/:userId/role", verifyUser, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate userId is valid MongoDB ID
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Validate role
    if (!["staff", "management", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be: staff, management, or admin" });
    }

    // Find and validate target user
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent changing existing admin roles unless explicitly allowed
    if (targetUser.role === "admin" && role !== "admin") {
      return res.status(403).json({ error: "Cannot downgrade admin users" });
    }

    // Update user role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("_id uid email role");

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ error: "Failed to update user role" });
  }
});

export default router;