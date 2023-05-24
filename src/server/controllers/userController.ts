import { Request, Response } from 'express';
import { MongoClient, ObjectId} from 'mongodb'
import connectToDatabase from '../database/mongodb';
import jwt from "jsonwebtoken"; 
import bcrypt from 'bcryptjs';




const userController = {
  handleLogin: async (req: Request, res: Response, next: any) => {
    const user = req.body;
    console.log(user);
    const db = await connectToDatabase();
    const DBUser = await db.collection('Profiles').findOne({'email':user.email});
    console.log(DBUser);
    if(!DBUser) return res.sendStatus(401);
    console.log(DBUser.password, user.password);
    const match = await bcrypt.compare(user.password, DBUser.password)
    console.log("MATCH: ", match);
    if(match) {
      const accessToken = jwt.sign(
        {
          email: DBUser.email, 
          name: DBUser.name
        }, 
        process.env.SECRET_KEY as string, 
        {expiresIn: '1h'}
      );
      const refreshToken = jwt.sign(
        { 
          "email" : DBUser.email 
        }, 
        process.env.SECRET_KEY as string,
        {
          expiresIn: '1d'
        }
      );
      res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
      DBUser["refresh-token"] = refreshToken;
      res.json({accessToken: accessToken, roles: [1000]}); 
    }
    else {
      res.status(401);
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
// function verifyUserPassword(password: string, userPassword: string){
//   console.log(password, userPassword);
//     return new Promise((resolve, reject) => {
//         bcrypt.compare(userPassword, password, function(err, result) {
//             if(err) reject(err);
//             resolve(result);
//         });
//     });
// }

export default userController;


