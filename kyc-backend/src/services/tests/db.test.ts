import mongoose from "mongoose";
import { connectDB } from "../../config/db"; // Adjust path to where your db.ts is

// 1. Mock Mongoose so we don't actually connect to the internet
jest.mock("mongoose");

describe("Database Connection", () => {
  let consoleSpy: jest.SpyInstance;
  let exitSpy: jest.SpyInstance;

  beforeAll(() => {
    // Suppress console logs during test to keep output clean
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    console.error = jest.fn(); 
  });

  beforeEach(() => {
    // 2. Mock process.exit so it doesn't kill the test runner if it fails
    exitSpy = jest.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`process.exit: ${code}`);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it("should connect to MongoDB successfully", async () => {
    // Mock mongoose.connect to resolve successfully
    (mongoose.connect as jest.Mock).mockResolvedValueOnce("Connected");

    await connectDB();

    // Expect mongoose.connect to have been called
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    
    // NOTE: We removed the expect(response).toBe("MongoDB connected")
    // because your function returns void. We check if the function finished.
  });

  it("should exit process with failure if connection fails", async () => {
    // Mock mongoose.connect to REJECT (simulate DB error)
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));

    // We expect the function to throw an error because we mocked process.exit to throw
    await expect(connectDB()).rejects.toThrow("process.exit: 1");

    // Verify process.exit was called with 1
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});