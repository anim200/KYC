// src/config/db.ts
import mongoose from "mongoose";

// src/config/db.ts
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Connected");
    return "MongoDB connected"; // <--- YOU NEED THIS LINE for your old test to pass
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
