import { Request, Response, NextFunction } from 'express'
import jwt from "jsonwebtoken";





const checkAuth = (req:Request, res:Response, next:any) => {
  //Extracting token from cookies
  const token = req.cookies.jwt;
  console.log(req.headers);
  //Checking if the token is null
  if (!token) {
    return res.status(401).json({message: "Authorization failed. No access token."});
  }

  //Verifying if the token is valid.
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err:any, user:any) => {
    if (err) {
      console.log(err);
      return res.status(403).json({message: "Could not verify token"});
    }
    res.locals.user = user;
    console.log(res.locals);
    next();
  });
};
 

export default checkAuth