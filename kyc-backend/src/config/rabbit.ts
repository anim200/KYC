// src/config/rabbit.ts
import amqplib from "amqplib";
import { ENV } from "./env";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let connection: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let channel: any = null;

const QUEUE_NAME = "kyc-pdf-jobs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getRabbitChannel(): Promise<any> {
  if (channel) return channel;

  connection = await amqplib.connect(ENV.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, {
    durable: true,
  });

  console.log("Connected to RabbitMQ, queue:", QUEUE_NAME);
  return channel;
}

export { QUEUE_NAME };
