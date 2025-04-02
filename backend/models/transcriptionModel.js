// backend/models/transcriptionModel.js
import { MongoClient, ObjectId } from "mongodb";
import { MONGO_URI } from "../config/index.js";

let db;
const client = new MongoClient(MONGO_URI);

export async function connectDB() {
  try {
    await client.connect();
    db = client.db("snellen_chart");
    console.log("✅ Connected to MongoDB");
    
    // Create collection if it doesn't exist
    const collections = await db.listCollections({ name: "transcriptions" }).toArray();
    if (collections.length === 0) {
      await db.createCollection("transcriptions");
      console.log("✅ Created transcriptions collection");
    }
    
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.log("⚠️ Continuing without database connection. Some features may not work.");
    // Don't throw the error to allow app to work without DB
  }
}

export function getDB() {
  if (!db) {
    console.warn("Database not connected. Some features may not work.");
    return {
      collection: () => ({
        insertOne: async () => ({ insertedId: "mock-id" }),
        find: () => ({
          sort: () => ({
            toArray: async () => [],
          }),
        }),
        findOne: async () => null,
      }),
    };
  }
  return db;
}

export async function saveTranscription({ text, score }) {
  try {
    const collection = getDB().collection("transcriptions");
    const result = await collection.insertOne({
      text,
      score,
      timestamp: new Date()
    });
    return result;
  } catch (error) {
    console.error("Error saving transcription:", error);
    return { insertedId: "mock-id" };
  }
}

export async function getTranscriptions() {
  try {
    return await getDB().collection("transcriptions").find().sort({ timestamp: -1 }).toArray();
  } catch (error) {
    console.error("Error getting transcriptions:", error);
    return [];
  }
}

export async function getTranscriptionById(id) {
  try {
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return null;
    }
    return await getDB().collection("transcriptions").findOne({ _id: objectId });
  } catch (error) {
    console.error("Error getting transcription by ID:", error);
    return null;
  }
}