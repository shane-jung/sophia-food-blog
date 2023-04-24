import express from 'express'
import recipeRouter from './recipes'
import userRouter from './users'
import commentRouter from './comments'

const router = express.Router();
router.use('/recipes', recipeRouter);
router.use('/users', userRouter);
router.use('/comments', commentRouter);
export default router;