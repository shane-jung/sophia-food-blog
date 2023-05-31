import express from 'express'
import recipeRouter from './recipes'
import userRouter from './users'
import commentRouter from './comments'
import refreshTokenController from '../controllers/refreshTokenController';

const router = express.Router();
import checkAuth from '../middleware/checkAuth';


router.route('/auth').get(checkAuth);
router.route('/refresh').get(refreshTokenController.handleRefreshToken)

router.use('/recipes', recipeRouter);
router.use('/users', userRouter);
router.use('/comments', commentRouter);
export default router;