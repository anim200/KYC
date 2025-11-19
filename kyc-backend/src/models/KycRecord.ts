import mongoose, { Schema, Document } from "mongoose";

export interface IKycRecord extends Document {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  nationalId: string;
  dob: Date;
  rawData: any;
  pdfStatus: "none" | "pending" | "ready" | "error";
  pdfPath?: string;
  summary?: string;
}

const KycRecordSchema = new Schema<IKycRecord>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    nationalId: { type: String, required: true },
    dob: { type: Date, required: true },
    rawData: { type: Schema.Types.Mixed, required: true },

    pdfStatus: {
      type: String,
      enum: ["none", "pending", "ready", "error"],
      default: "none",
    },
    pdfPath: { type: String },
    summary: { type: String },
  },
  { timestamps: true }
);

export const KycRecord = mongoose.model<IKycRecord>(
  "KycRecord",
  KycRecordSchema
);
