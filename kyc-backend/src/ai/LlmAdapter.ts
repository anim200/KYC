// src/ai/LlmAdapter.ts
import { IKycRecord } from "../models/KycRecord";

export interface LlmAdapter {
  /**
   * Given a KYC record, return a concise textual summary.
   * Implementations must NOT throw for normal errors; they should
   * log and return "" when summarization fails.
   */
  generateKycSummary(kyc: IKycRecord): Promise<string>;
}
