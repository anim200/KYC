// src/ai/MockLlmAdapter.ts
import { IKycRecord } from "../models/KycRecord";
import { LlmAdapter } from "./LlmAdapter";

export class MockLlmAdapter implements LlmAdapter {
  async generateKycSummary(kyc: IKycRecord): Promise<string> {
    // Very cheap, deterministic, and offline "summary" – good for dev/tests.
    return [
      `KYC record for ${kyc.fullName} (${kyc.email}, ${kyc.phone}).`,
      `Lives at: ${kyc.address}.`,
      `National ID: ${kyc.nationalId}.`,
      `DOB: ${kyc.dob?.toISOString().substring(0, 10) || "N/A"}.`,
    ].join(" ");
  }
}
