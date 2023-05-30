import express, {Request, Response} from 'express';
import recipeController from '../controllers/recipeController';
import checkAuth from '../middleware/checkAuth';

import multer from 'multer';
var upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/create', checkAuth, recipeController.createRecipe);

router.post('/:titleID/comment', recipeController.addCommentToRecipe)

router.route('/:titleID')
    .get(recipeController.getRecipeById)
    .post(checkAuth, recipeController.updateRecipe)
    .delete(checkAuth, recipeController.deleteRecipe);


router.route('/')
    .get(recipeController.getAllRecipes)
    .post(checkAuth, recipeController.createRecipe);
    
export default router; 