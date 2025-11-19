// src/services/kycSummaryService.ts
import { IKycRecord } from "../models/KycRecord";
import { getLlmAdapter } from "../ai/llmFactory";

export async function generateAndAttachKycSummary(
  kyc: IKycRecord
): Promise<void> {
  const adapter = getLlmAdapter();
  const summary = await adapter.generateKycSummary(kyc);
  console.log("Generated summary:", summary);

  if (summary && summary.trim().length > 0) {
    kyc.summary = summary.trim();
    await kyc.save();
  }
}
