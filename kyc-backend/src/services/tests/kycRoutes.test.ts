// src/services/tests/kycRoutes.test.ts
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
// CHANGE THIS IMPORT: Point to app.ts, NOT index.ts
import app from "../../app"; 

let mongoServer: MongoMemoryServer;

describe("KYC Routes", () => {
  
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  it("should submit KYC form and return ID", async () => {
    const response = await request(app).post("/api/kyc").send({
      fullName: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      address: "123 Main St",
      nationalId: "AB1234567",
      dob: "1990-01-01",
    });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });

  it("should return a 400 if the KYC form is invalid", async () => {
    const response = await request(app).post("/api/kyc").send({
      fullName: "", 
      email: "invalid-email",
    });

    expect(response.status).toBe(400); 
  });
});