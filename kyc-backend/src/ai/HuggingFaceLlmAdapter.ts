// src/ai/HuggingFaceLlmAdapter.ts
import axios from "axios";
import { IKycRecord } from "../models/KycRecord";
import { ENV } from "../config/env";
import { LlmAdapter } from "./LlmAdapter";

function buildKycPrompt(kyc: IKycRecord): string {
  return `
Summarize the following KYC customer profile in 3–5 sentences.
Use neutral, formal language and highlight identity, contact details,
and any risk-relevant aspects. Do NOT add extra information.

Full Name: ${kyc.fullName}
Email: ${kyc.email}
Phone: ${kyc.phone}
Address: ${kyc.address}
National ID: ${kyc.nationalId}
Date of Birth: ${kyc.dob?.toISOString().substring(0, 10)}

Raw Data:
${JSON.stringify(kyc.rawData, null, 2)}
`;
}

export class HuggingFaceLlmAdapter implements LlmAdapter {
  async generateKycSummary(kyc: IKycRecord): Promise<string> {
    if (!ENV.HUGGINGFACE_API_KEY) {
      console.warn("[HF LLM] Missing HUGGINGFACE_API_KEY");
      return "";
    }

    try {
      const res = await axios.post(
        "https://router.huggingface.co/v1/chat/completions",
        {
          model: "mistralai/Mistral-7B-Instruct-v0.3",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that summarizes KYC profiles.",
            },
            {
              role: "user",
              content: buildKycPrompt(kyc),
            },
          ],
          max_tokens: 200,
          temperature: 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${ENV.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 60000,
        }
      );

      const summary = res.data?.choices?.[0]?.message?.content || "";
      return summary.trim();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("[HF LLM] Router API Error:", err.response?.data || err.message);
      } else if (err instanceof Error) {
        console.error("[HF LLM] Router API Error:", err.message);
      } else {
        console.error("[HF LLM] Router API Error:", err);
      }
      return "";
    }
  }
}
