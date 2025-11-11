import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:5173"], // Frontend URL
  credentials: true
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// --- MongoDB connection ---
const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI; // Use the correct env variable
  if (!mongoUri) {
    console.error("❌ MONGO_URI not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", (err as Error).message);
    process.exit(1);
  }
};

// --- Routes ---
app.get("/", (req: Request, res: Response) => {
  res.send("App is working");
});

// --- Start server ---
const startServer = async (): Promise<void> => {
  await connectDB(); // Connect to MongoDB first
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();


