import admin from "../firebaseAdmin.js";
import User from "../models/User.js";

export const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decoded;

    let user = await User.findOne({ uid: decoded.uid });
    if (!user) {
      user = await User.create({
        uid: decoded.uid,
        email: decoded.email,
        role: "staff",
      });
    }
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};