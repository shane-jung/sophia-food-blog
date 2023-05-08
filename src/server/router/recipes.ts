import express, {Request, Response} from 'express';
import recipeController from '../controllers/recipeController';
import checkAuth from '../middleware/checkAuth';

import multer from 'multer';
var upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/create', upload.none(), recipeController.createRecipe);

router.post('/:titleID/comment', upload.none(), recipeController.addCommentToRecipe)

router.route('/:titleID')
    .get(recipeController.getRecipeById)
    .post(upload.none(), recipeController.updateRecipe)
    .delete(recipeController.deleteRecipe);


router.route('/')
    .get(recipeController.getAllRecipes)
    .post(recipeController.createRecipe);
    
export default router; 