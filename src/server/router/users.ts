import express, {Request, Response} from 'express';
import userController from '../controllers/userController';
import checkAuth from '../middleware/checkAuth';
import bcrypt from 'bcryptjs';

import multer from 'multer';
var upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.route('/').get(userController.getUser);


router.route('/create').post(upload.none(), hashPassword, userController.createUser);


async function hashPassword(req: Request, res: Response, next: any){
    let password = req.body['user-password'] as string;

    hashedPassword(password).then((hash) => {
        console.log("HASHED PASSWORD: " , hash);
        let data = {...req.body, "admin-status": 'false', "date-created": new Date().toISOString()};
        data["user-password"] = hash;
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