import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["staff", "management", "admin"],
    default: "staff"
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);