import { Request, Response, NextFunction } from 'express'
import jwt from "jsonwebtoken";





const checkAuth = (req:Request, res:Response, next:any) => {
  //Extracting token from cookies
  const token = req.cookies.jwttoken;

  //Checking if the token is null
  if (!token) {
    return res.status(401).send("Authorization failed. No access token.");
  }

  //Verifying if the token is valid.
  jwt.verify(token, process.env.SECRET_KEY as string, (err:any, user:any) => {
    if (err) {
      console.log(err);
      return res.status(403).send("Could not verify token");
    }
    res.locals.user = user;
    console.log(res.locals);
    next();
  });
};
 

export default checkAuth