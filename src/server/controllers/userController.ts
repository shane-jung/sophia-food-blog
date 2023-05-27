import { Request, Response } from 'express';
import { MongoClient, ObjectId} from 'mongodb'
import connectToDatabase from '../database/mongodb';
import jwt from "jsonwebtoken"; 
import bcrypt from 'bcryptjs';




const userController = {
  findUser: async (req: Request, res: Response) => {
    const email = req.body.email;
    const db = await connectToDatabase();
    const user = await db.collection('Profiles').findOne({'email':email});
    if(user) return res.sendStatus(409);
  }, 
  handleLogin: async (req: Request, res: Response, next: any) => {
    const user = req.body;
    const db = await connectToDatabase();
    const DBUser = await db.collection('Profiles').findOne({'email':user.email});
    if(!DBUser) return res.sendStatus(401);
    console.log(DBUser.password, user.password);
    const match = await bcrypt.compare(user.password, DBUser.password)
    if(match) {
      const accessToken = jwt.sign(
        {
          email: DBUser.email,
          roles: DBUser.roles
        }, 
        process.env.ACCESS_TOKEN_SECRET as string, 
        {expiresIn: '1h'}
      );
      const refreshToken = jwt.sign(
        { 
          "email" : DBUser.email 
        }, 
        process.env.REFRESH_TOKEN_SECRET as string,
        {
          expiresIn: '1d'
        }
      );
      res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
      DBUser["refresh-token"] = refreshToken;
      saveUser(DBUser);
      res.json({accessToken: accessToken, roles: [1000], user: DBUser}); 
    }
    else {
      res.status(401);
    }
  },
  createUser: async (req: Request, res: Response) => {
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
async function saveUser(user: any)  {

  try{
    const db = await connectToDatabase();
    const result = await db.collection('Profiles').updateOne({email: user.email}, {$set: user});
  } catch(error:any){ 
    console.error(`Error editing user in saveUser: ${error}`);
    throw error;
  }
}

export default userController;


