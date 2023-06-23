import { MongoClient, Db } from "mongodb";

let client: MongoClient;
let cachedDb: Db;

export default async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    console.log("Using cached DB Connection!")
    return cachedDb;
  }
  client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db : Db = client.db(process.env.DB_NAME as string);
  cachedDb = db;
  return db;
}
