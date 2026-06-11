import { MongoClient, Db, Collection } from 'mongodb';
import type { CheckHistory } from '@/types';

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;
let historyCollection: Collection<any> | null = null;

/**
 * Initialize MongoDB connection
 * This is a backup database option - can be swapped with SQLite
 */
export async function initializeMongoDatabase(): Promise<Db> {
  if (mongoDb) return mongoDb;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();

  mongoDb = mongoClient.db('medsafe');
  historyCollection = mongoDb.collection('check_history');

  // Create indexes
  await historyCollection.createIndex({ userId: 1, createdAt: -1 });
  await historyCollection.createIndex({ createdAt: -1 });
  await historyCollection.createIndex({ userId: 1 });

  return mongoDb;
}

/**
 * Get MongoDB instance
 */
export async function getMongoDatabase(): Promise<Db> {
  if (!mongoDb) {
    await initializeMongoDatabase();
  }
  return mongoDb!;
}

/**
 * Get history collection
 */
async function getHistoryCollection(): Promise<Collection<any>> {
  if (!historyCollection) {
    const db = await getMongoDatabase();
    historyCollection = db.collection('check_history');
  }
  return historyCollection;
}

/**
 * Save check history to MongoDB
 */
export async function saveCheckHistoryMongo(
  history: Omit<CheckHistory, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CheckHistory> {
  const collection = await getHistoryCollection();
  const now = new Date();

  const result = await collection.insertOne({
    ...history,
    createdAt: now,
    updatedAt: now,
  });

  return {
    ...history,
    id: result.insertedId.toString(),
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Get user's check history from MongoDB
 */
export async function getUserCheckHistoryMongo(userId: string, limit: number = 50): Promise<CheckHistory[]> {
  const collection = await getHistoryCollection();

  const documents = await collection
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return documents.map((doc) => ({
    id: doc._id.toString(),
    userId: doc.userId,
    drugName: doc.drugName,
    foodName: doc.foodName,
    drugSmiles: doc.drugSmiles,
    foodSmiles: doc.foodSmiles,
    clinicalText: doc.clinicalText,
    result: doc.result,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }));
}

/**
 * Get specific check by ID from MongoDB
 */
export async function getCheckByIdMongo(id: string): Promise<CheckHistory | null> {
  const collection = await getHistoryCollection();

  const doc = await collection.findOne({ _id: { $oid: id } });

  if (!doc) return null;

  return {
    id: doc._id.toString(),
    userId: doc.userId,
    drugName: doc.drugName,
    foodName: doc.foodName,
    drugSmiles: doc.drugSmiles,
    foodSmiles: doc.foodSmiles,
    clinicalText: doc.clinicalText,
    result: doc.result,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

/**
 * Delete check history from MongoDB
 */
export async function deleteCheckHistoryMongo(id: string, userId: string): Promise<boolean> {
  const collection = await getHistoryCollection();

  const result = await collection.deleteOne({
    _id: { $oid: id },
    userId,
  });

  return result.deletedCount > 0;
}

/**
 * Clear all user history from MongoDB
 */
export async function clearUserHistoryMongo(userId: string): Promise<number> {
  const collection = await getHistoryCollection();

  const result = await collection.deleteMany({ userId });

  return result.deletedCount;
}

/**
 * Close MongoDB connection
 */
export async function closeMongoDatabase(): Promise<void> {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
    mongoDb = null;
    historyCollection = null;
  }
}
