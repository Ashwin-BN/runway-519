import express from "express";
import User from "../models/User.js";
import { verifyUser } from "../middleware/auth.js";
import { isManagementOrAdmin, isAdmin } from "../middleware/admin.js";

const router = express.Router();

// test admin access
router.get("/dashboard", verifyUser, isManagementOrAdmin, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get("/users", async (req, res) => {
  console.log("Admin users route hit");
  try {
    const users = await User.find().select("_id uid email role");
    console.log("Found users:", users.length);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/users/:userId/role", verifyUser, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    console.log("Role update request - Admin:", req.user.role, "TargetUser:", userId, "NewRole:", role);

    if (!["user", "management", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Find the target user first to check their current role
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      console.log("User not found:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Target user current role:", targetUser.role);

    // Prevent changing admin roles
    if (targetUser.role === "admin") {
      console.log("Attempt to change admin user role blocked");
      return res.status(403).json({ error: "Admin roles cannot be changed" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("_id uid email role");

    console.log("User role updated successfully:", user.role);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;