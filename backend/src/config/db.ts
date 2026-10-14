import mongoose from 'mongoose';
import { config } from './index.js';

export let isMongoConnected = false;

export async function connectDatabase(): Promise<boolean> {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error: any) {
    isMongoConnected = false;
    console.warn(`[Database] MongoDB connection unavailable (${error.message}).`);
    console.warn(`[Database] Operating in persistent in-memory repository fallback mode.`);
    return false;
  }
}
