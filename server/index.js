import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import itemsRoutes from "./routes/items.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Test route first
app.get("/test", (req, res) => {
  console.log("Test route hit");
  res.json({ message: "Test route works" });
});

app.use("/auth", authRoutes);
console.log("Auth routes mounted");
app.use("/admin", adminRoutes);
console.log("Admin routes mounted");
app.use("/items", itemsRoutes);
console.log("Items routes mounted");

console.log("About to start server...");
app.listen(5000, () => console.log("Server running on 5000"));