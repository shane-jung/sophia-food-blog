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
    const match = await bcrypt.compare(user.password, DBUser.password)
    if(match) {
      console.log("User successfully logged in, generating access token and refresh token.")
      const accessToken = jwt.sign(
        {
          email: DBUser.email,
          roles: DBUser.roles
        }, 
        process.env.ACCESS_TOKEN_SECRET!, 
        {expiresIn: '1h'}
      );
      const refreshToken = jwt.sign(
        { 
          email : DBUser.email ,
          roles : DBUser.roles
        }, 
        process.env.REFRESH_TOKEN_SECRET!,
        {
          expiresIn: '1d'
        }
      );
      res.cookie('jwt', refreshToken, { httpOnly: true, secure:true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000});
      DBUser["refresh-token"] = refreshToken;
      console.log(`Access Token: ${accessToken}`);
      console.log(`Refresh Token: ${refreshToken}`)
      console.log(`Storing refresh token in jwt cookie, saving to User profile.`);
      console.log("Returning access token in JSON");
      saveUser(DBUser);
      res.json({accessToken: accessToken, roles: DBUser.roles, email: DBUser.email}); 
    }
    else {
      res.status(401);
    }
  },
  handleLogout: async(req:Request, res:Response) =>{
    console.log(req.body);
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204);
    const jwt = cookies.jwt;
    res.clearCookie('jwt', {httpOnly:true})
    //req.clearC

    try {
      const db = await connectToDatabase();
      const result = await db.collection('Profiles').updateOne({'refresh-token': jwt}, { $set : {'refresh-token': ""}} );
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
    }

    // req.headers.authorization = "";
  }

  ,
  createUser: async (req: Request, res: Response) => {
    const user = res.locals.user;
    try{
        const db = await connectToDatabase();
        const result = await db.collection('Profiles').insertOne({ _id : new ObjectId(), roles : [1000], 
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
async function saveUser(user: any)  {

  try{
    const db = await connectToDatabase();
    const result = await db.collection('Profiles').updateOne({email: user.email}, {$set: user});
    console.log(result);
  } catch(error:any){ 
    console.error(`Error editing user in saveUser: ${error}`);
    throw error;
  }
}

export default userController;


