import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import kycRoutes from "./routes/kycRoutes";
import authRoutes from "./routes/authRoutes";
import requestLogger from "./middleware/requestLogger"; // Import Middleware

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ✅ ADD: Request Logger (Before routes)
app.use(requestLogger);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/admin", authRoutes);
app.use("/api/kyc", kycRoutes);

export default app;