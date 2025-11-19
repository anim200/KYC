// src/config/env.ts
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY || "",
  LLM_PROVIDER: process.env.LLM_PROVIDER || "mock",
  ADMIN_REGISTRATION_SECRET: process.env.ADMIN_REGISTRATION_SECRET || "",
  RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://localhost",
  PDF_BASE_PATH: process.env.PDF_BASE_PATH || "./pdfs",
};
