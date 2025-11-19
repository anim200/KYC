// src/types.ts

export interface KycRecord {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  nationalId: string;
  dob: string; // if backend sends this as ISO string
  createdAt: string;
  updatedAt: string;
  // PDF status managed by backend: none | pending | ready | error
  pdfStatus?: "none" | "pending" | "ready" | "error";
  // optional URL if PDF is ready
  pdfUrl?: string;
  summary?: string;
}
