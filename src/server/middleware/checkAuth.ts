import { Request, Response, NextFunction } from 'express'
import jwt from "jsonwebtoken";





const checkAuth = (req:any, res:Response, next:NextFunction) => {
  //Extracting token from authorization header
  const token = req.headers.authorization?.split(' ')[1];
  //Checking if the token is null
  if (!token) {
    console.log('here');
    return res.status(401).json({message: "Authorization failed. No access token."});
  }

  //Verifying if the token is valid.
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err:any, user:any) => {
    if (err) {
      console.log(err);
      return res.status(403).json({message: "Could not verify token"});
    }
    // res.locals.user = user;
    req.roles = user.roles
    // console.log(res.locals);
    next();
  });
};


export const verifyRoles = (...allowedRoles: number[]) => {
  return (req: any, res:Response, next:NextFunction) => {
    if(!req.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles]
    const result = req.roles.map((role: any) => rolesArray.includes(role)).find((val: any)=> val === true)
    if(!result) return res.sendStatus(401);
    next();
  }
};
 

export default checkAuth