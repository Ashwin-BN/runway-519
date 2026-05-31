import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import itemsRoutes from "./routes/items.js";

dotenv.config();

// Basic environment validation
const requiredEnvs = [
  "MONGO_URI",
];

const missing = requiredEnvs.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// MongoDB Connection with error handling
mongoose.connect(process.env.MONGO_URI, {
  retryWrites: true,
  w: "majority",
})
  .then(() => {
    console.log(`[${new Date().toISOString()}] MongoDB connected to database: ${mongoose.connection.name}`);
  })
  .catch(err => {
    console.error("[MongoDB Error]:", err.message);
    process.exit(1);
  });

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/items", itemsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[Error] ${err.message}`);
  
  // Don't expose sensitive errors in production
  const message = NODE_ENV === "production" 
    ? "Internal server error" 
    : err.message;
  
  res.status(err.status || 500).json({ error: message });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${PORT} (${NODE_ENV})`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing server gracefully...");
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});