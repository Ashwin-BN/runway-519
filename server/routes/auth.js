import express from "express";
import User from "../models/User.js";
import { verifyUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", verifyUser, async (req, res) => {
  try {
    const { uid, email } = req.firebaseUser;

    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({
        uid,
        email,
        role: "staff"
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;