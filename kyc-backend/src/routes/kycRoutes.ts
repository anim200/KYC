import express, { Request, Response } from "express";
import { KycRecord } from "../models/KycRecord";
import { generateAndAttachKycSummary } from "../services/kycSummaryService";
import logger from "../config/logger"; // Import logger

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const kycData = {
      ...req.body,
      rawData: req.body,
    };

    const kyc = new KycRecord(kycData);
    await kyc.save();

    // ✅ Log business logic info
    logger.info(`KYC Record created for: ${kyc.email}`);

    await generateAndAttachKycSummary(kyc);

    return res.status(201).json({ 
      id: kyc.id, 
      message: "KYC form submitted successfully" 
    });

  } catch (err: any) {
    // ✅ Handle Mongoose Validation Errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val: any) => val.message);
      
      // We usually don't log validation errors as "Errors" in the file 
      // because they are user mistakes, not server crashes. 
      // But we can log them as warnings if we want.
      logger.warn(`Validation Failed: ${messages.join(", ")}`);

      return res.status(400).json({ 
        message: "Validation failed", 
        errors: messages 
      });
    }

    // ✅ Log unexpected server errors to the file
    logger.error(`KYC Submit Error: ${err.message}`, { stack: err.stack });

    return res.status(500).json({ message: "Server error" });
  }
});

export default router;