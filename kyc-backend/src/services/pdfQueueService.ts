// src/services/pdfQueueService.ts
import { getRabbitChannel, QUEUE_NAME } from "../config/rabbit";

export async function enqueuePdfJob(kycId: string) {
  const channel = await getRabbitChannel();

  const msg = { kycId };
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(msg)), {
    persistent: true,
  });

  console.log("Enqueued PDF job for KYC:", kycId);
}
