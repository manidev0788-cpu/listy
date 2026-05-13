import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI || process.env.MONGO_URL || process.env.DATABASE_URL;

const dbName = process.env.MONGODB_DB || "listfy";

/** Used by `/api/health` diagnostics (masked); same resolution as `uri`. */
export function resolveMongoConnectionUri() {
  return typeof uri === "string" ? uri.trim() : "";
}

if (!uri) {
  throw new Error("MongoDB URI is missing");
}

/**
 * Connection Pool Settings
 */
const options = {
  maxPoolSize: 10,
  minPoolSize: 0,
  maxIdleTimeMS: 60000,
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
};

let client;
let clientPromise;

/**
 * Global cache for hot reloads in development
 */
if (process.env.NODE_ENV === "development") {
  if (!global._mongo) {
    client = new MongoClient(uri, options);

    global._mongo = {
      client,
      promise: client.connect(),
    };
  }

  clientPromise = global._mongo.promise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Get Database
 */
export async function getDb() {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export default clientPromise;
