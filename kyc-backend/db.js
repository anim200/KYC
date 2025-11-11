require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI || process.env.MONGO_URL;
if (!uri) {
  throw new Error('Missing MONGO_URI (or MONGO_URL) in environment');
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // You can add poolSize, socketTimeoutMS, tls, etc. for production tuning
});

let cachedDb = null;

async function connect() {
  if (cachedDb) return cachedDb;
  await client.connect();
  const dbName = process.env.MONGO_DB_NAME || 'kyc';
  cachedDb = client.db(dbName);
  console.log(`MongoDB connected to database: ${dbName}`);
  return cachedDb;
}

async function getCollection(name) {
  const db = await connect();
  return db.collection(name);
}

function getClient() {
  return client;
}

async function close() {
  await client.close();
  cachedDb = null;
}

module.exports = {
  connect,
  getCollection,
  getClient,
  close,
};
