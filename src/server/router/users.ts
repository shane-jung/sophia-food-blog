import express, {Request, Response} from 'express';
import userController from '../controllers/userController';
import checkAuth from '../middleware/checkAuth';

const router = express.Router();

router.route('/').get(userController.getUser);


router.route('/create').post(userController.createUser);



export default router; 