import express, {Request, Response} from 'express';
import userController from '../controllers/userController';
import bcrypt from 'bcryptjs';

import jwt from "jsonwebtoken";
import multer from 'multer';
import http from "http";


var upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.route('/').get(userController.handleLogin);

router.route('/login').post(userController.handleLogin);

async function generateToken(req:Request, res: Response, next:any){
    const email = req.body.email;
    const token = jwt.sign({email}, process.env.SECRET_KEY as string, { expiresIn: "1h" })
    res.cookie("jwttoken", token);

    return res.json({token: token}) 
    
    // http
    // .createServer(function (req, res) {
    //     res.writeHead(301, { Location: "/" });
    //     res.end();
    // })
    // .listen(8888);
}

router.route('/logout').get(userController.handleLogin);




router.route('/create').post(upload.none(), hashPassword, userController.createUser);


async function hashPassword(req: Request, res: Response, next: any){
    let password = req.body['password'] as string;
    console.log(req.body);

    hashedPassword(password).then((hash) => {
        console.log("HASHED PASSWORD: " , hash);
        let data = {...req.body, "admin-status": 'false', "date-created": new Date().toISOString()};
        data["password"] = hash;
        res.locals.user = data;
        next();
    }).catch((err) => {
        console.log("ERROR HASHING PASSWORD: " , err);
        res.status(500).json({message: "Error hashing password"});
    });

    
}

async function hashedPassword(password: string){
    const saltRounds = 10;
    console.log("PASSWORD: " , password);

    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    });
}

export default router; 

