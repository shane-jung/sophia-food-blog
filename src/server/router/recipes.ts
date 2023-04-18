import express, {Request, Response} from 'express';
import recipeController from '../controllers/recipeController';
import checkAuth from '../middleware/checkAuth';

import multer from 'multer';
var upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.route('/:titleID')
    .get(recipeController.getRecipeById)
    .put(checkAuth, recipeController.updateRecipe)
    .delete(recipeController.deleteRecipe);


router.route('/')
    .get(recipeController.getAllRecipes)
    .post(recipeController.createRecipe);

router.post('/create', upload.none(), recipeController.createRecipe);


router.route('/:titleID/edit')
    .put(recipeController.updateRecipe);

export default router; 