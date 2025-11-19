// src/ai/llmFactory.ts
import { ENV } from "../config/env";
import { LlmAdapter } from "./LlmAdapter";
import { HuggingFaceLlmAdapter } from "./HuggingFaceLlmAdapter";
import { MockLlmAdapter } from "./MockLlmAdapter";

let cachedAdapter: LlmAdapter | null = null;

export function getLlmAdapter(): LlmAdapter {
  if (cachedAdapter) return cachedAdapter;

  switch (ENV.LLM_PROVIDER.toLowerCase()) {
    case "huggingface":
      console.log("[LLM] Using HuggingFace adapter");
      cachedAdapter = new HuggingFaceLlmAdapter();
      break;

    case "mock":
    default:
      console.log("[LLM] Using Mock adapter");
      cachedAdapter = new MockLlmAdapter();
      break;
  }

  return cachedAdapter;
}
