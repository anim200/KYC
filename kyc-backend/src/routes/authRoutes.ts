// src/routes/authRoutes.ts
import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin";
import { ENV } from "../config/env";

const router = Router();

// POST /api/admin/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    console.log("router registered")
    console.log(req.body)
    const { email, password, registrationSecret } = req.body;
    

    if (registrationSecret !== ENV.ADMIN_REGISTRATION_SECRET) {
      return res.status(403).json({ message: "Not allowed to register." });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, passwordHash });

    return res.status(201).json({ id: admin.id, email: admin.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin.id }, ENV.JWT_SECRET, {
      expiresIn: "8h",
    });

    return res.json({ token, email: admin.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
