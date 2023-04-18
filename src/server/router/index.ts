import express from 'express'
import recipeRouter from './recipes'

const router = express.Router();
router.use('/recipes', recipeRouter);
export default router;