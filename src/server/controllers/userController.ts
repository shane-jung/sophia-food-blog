import { Request, Response } from 'express';
import { MongoClient, ObjectId} from 'mongodb'
import connectToDatabase from '../database/mongodb';



const userController = {
  getUser: async (req: Request, res: Response) => {
    const email = req.params.email;
    try{
        const db = await connectToDatabase();
        const user = await db.collection('Users').findOne({'email':email});
        return res.json(user);
    } catch (error) {
        console.error(`Error fetching user in getUser: ${error}`);
        throw error;
    }
  },
  createUser: async (req: Request, res: Response) => {
    //return res.status(200).json({message:"Need to implement"});
    const user = res.locals.user;
    console.log("USER IN CREATE USER: " , user);
    try{
        const db = await connectToDatabase();
        const result = await db.collection('Profiles').insertOne({ _id : new ObjectId(), 
            ...user
        });
        console.log(result);
        return res.json({message: "User created successfully"});
    } catch (error) {
        console.error(`Error creating user in createUser: ${error}`);
        throw error;
    }
    return;
  },
};

export default userController;
