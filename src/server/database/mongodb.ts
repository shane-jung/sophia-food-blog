import { MongoClient, Db } from "mongodb";

let client: MongoClient;
let cachedDb: Db;

export default async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    // console.log("Existing cached connection found!");
    return cachedDb;
  }
  // console.log("Aquiring new DB connection....");
  try {
    // Connect to our MongoDB database hosted on MongoDB Atlas
    client = await MongoClient.connect(process.env.MONGODB_URI as string);
    // Specify which database we want to use
    const db = client.db(process.env.DB_NAME as string);
    cachedDb = db;
    console.log("Aquired DB Connection!");
    return db;
  } catch (error) {
    console.log("ERROR aquiring DB Connection!");
    console.log(error);
    throw error;
  }
}
