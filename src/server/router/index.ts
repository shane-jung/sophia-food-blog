import express from 'express'
import recipeRouter from './recipes'
import userRouter from './users'
import commentRouter from './comments'

const router = express.Router();
import checkAuth from '../middleware/checkAuth';
router.route('/auth').get(checkAuth, (req, res) => { res.json({message: "success"})});

router.use('/recipes', recipeRouter);
router.use('/users', userRouter);
router.use('/comments', commentRouter);
export default router;