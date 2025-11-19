import app from "./app";
import { ENV } from "./config/env";
import { connectDB } from "./config/db";
import logger from "./config/logger"; // Import logger

async function start() {
  try {
    await connectDB();
    // ✅ Log DB Connection
    logger.info("MongoDB connected successfully");

    app.listen(ENV.PORT, () => {
      // ✅ Log Server Start
      logger.info(`Server running on port ${ENV.PORT}`);
    });
    
  } catch (error: any) {
    // ✅ Log Fatal Errors
    logger.error("Server failed to start", { error: error.message });
    process.exit(1);
  }
}

start();