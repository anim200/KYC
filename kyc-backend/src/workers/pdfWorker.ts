// src/workers/pdfWorker.ts
import "../config/env"; // to load dotenv
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { ENV } from "../config/env";
import { KycRecord } from "../models/KycRecord";
import amqplib, { ConsumeMessage } from "amqplib";
import { QUEUE_NAME } from "../config/rabbit";

async function startWorker() {
  // 1. Connect to Mongo
  await mongoose.connect(ENV.MONGO_URI || "mongodb://root:example@localhost:27017/kyc_db?authSource=admin");
  console.log("PDF Worker connected to MongoDB");

  // 2. Ensure PDF directory exists
  if (!fs.existsSync(ENV.PDF_BASE_PATH)) {
    fs.mkdirSync(ENV.PDF_BASE_PATH, { recursive: true });
  }

  // 3. Connect to RabbitMQ
  const connection = await amqplib.connect(ENV.RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  console.log("PDF Worker listening on queue:", QUEUE_NAME);

  channel.consume(
    QUEUE_NAME,
    async (msg: ConsumeMessage | null) => {
      if (!msg) return;

      const content = msg.content.toString();
      console.log("Received job:", content);

      try {
        const { kycId } = JSON.parse(content) as { kycId: string };
        const kyc = await KycRecord.findById(kycId);

        if (!kyc) {
          console.warn("KYC not found for job:", kycId);
          channel.ack(msg);
          return;
        }

        // Generate PDF
        const pdfFilename = `kyc_${kycId}.pdf`;
        const pdfPath = path.join(ENV.PDF_BASE_PATH, pdfFilename);

        await generateKycPdf(kyc, pdfPath);

        kyc.pdfStatus = "ready";
        kyc.pdfPath = pdfPath;
        await kyc.save();

        console.log("PDF generated:", pdfPath);
        channel.ack(msg);
      } catch (err) {
        console.error("Error processing PDF job:", err);
        // Optionally: set status to "error"
        try {
          const parsed = JSON.parse(msg.content.toString());
          if (parsed.kycId) {
            const kyc = await KycRecord.findById(parsed.kycId);
            if (kyc) {
              kyc.pdfStatus = "error";
              await kyc.save();
            }
          }
        } catch (_) {
          // ignore
        }

        // ack to avoid infinite retry; or use dead-letter queue in real systems
        channel.ack(msg);
      }
    },
    { noAck: false }
  );
}

async function generateKycPdf(kyc: any, pdfPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });

    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.fontSize(20).text("KYC Record", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Full Name: ${kyc.fullName}`);
    doc.text(`Email: ${kyc.email}`);
    doc.text(`Phone: ${kyc.phone}`);
    doc.text(`National ID: ${kyc.nationalId}`);
    doc.text(
      `Date of Birth: ${
        kyc.dob ? new Date(kyc.dob).toLocaleDateString() : "-"
      }`
    );
    doc.moveDown();
    doc.text("Address:");
    doc.text(kyc.address);
    doc.moveDown();
    doc.text("Created At: " + new Date(kyc.createdAt).toLocaleString());
    doc.text("Updated At: " + new Date(kyc.updatedAt).toLocaleString());

    doc.end();

    stream.on("finish", () => resolve());
    stream.on("error", (err) => reject(err));
  });
}

// Start worker
startWorker().catch((err) => {
  console.error("PDF Worker fatal error:", err);
  process.exit(1);
});
