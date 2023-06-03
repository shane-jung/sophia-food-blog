import express, {Request, Response} from 'express';
import recipeController from '../controllers/recipeController';
import { verifyRoles } from '../middleware/checkAuth';
import checkAuth from  '../middleware/checkAuth';


const router = express.Router();

router.post('/create', checkAuth, verifyRoles(8012), recipeController.createRecipe);

router.post('/comment', recipeController.postComment)

router.route('/:titleID')
    .get(recipeController.getRecipeById)
    .post(checkAuth, verifyRoles(8012), recipeController.updateRecipe)
    .delete(checkAuth, verifyRoles(8012), recipeController.deleteRecipe);


router.route('/')
    .get(recipeController.getAllRecipes)
    .post(checkAuth, verifyRoles(8012), recipeController.createRecipe);
    
export default router; 