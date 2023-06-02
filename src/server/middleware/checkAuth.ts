import { Request, Response, NextFunction } from 'express'
import jwt from "jsonwebtoken";





const checkAuth = (req:any, res:Response, next:NextFunction) => {
  //Extracting token from authorization header
  const token = req.headers.authorization?.split(' ')[1];
  //Checking if the token is null
  if (!token) {
    return res.status(401).json({message: "Authorization failed. No access token."});
  }

  //Verifying if the token is valid.
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err:any, decoded:any) => {
    // console.log(res.locals);
    res.locals.roles = decoded.user.roles;
    if (err) {
      console.log(err);
      return res.status(403).json({message: "Could not verify token"});
    }
    next();
  });
};


export const verifyRoles = (...allowedRoles: number[]) => {
  return (req: any, res:Response, next:NextFunction) => {
    // console.log(res.locals);
   if(!res.locals.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles]
    const result = res.locals.roles.map((role: any) => rolesArray.includes(role)).find((val: any)=> val === true)
    if(!result) return res.sendStatus(401);
    next();
  }
};
 

export default checkAuth