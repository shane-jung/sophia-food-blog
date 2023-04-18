import { MongoClient, Db} from 'mongodb';

const MONGODB_URI = "mongodb+srv://shanejung12:d2qRcdc7rTHsauWK@recipes.lcbomjg.mongodb.net/?retryWrites=true&w=majority";
const DB_NAME = "SophiaRecipeBlog";
let client: MongoClient;
let cachedDb: Db;

export default async function connectToDatabase(): Promise<Db>{
  
  if (cachedDb) {
    console.log("Existing cached connection found!");
    return cachedDb;
  }
  console.log("Aquiring new DB connection....");
  try {
    // Connect to our MongoDB database hosted on MongoDB Atlas

    client = await MongoClient.connect(MONGODB_URI);
    // Specify which database we want to use
    const db = client.db(DB_NAME);

    cachedDb = db;
    console.log("Aquired DB Connection!");
    return db;
  } catch (error) {
    console.log("ERROR aquiring DB Connection!");
    console.log(error);
    throw error;
  }
};