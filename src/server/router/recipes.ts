import express, {Request, Response} from 'express';
import recipeController from '../controllers/recipeController';
import { verifyRoles } from '../middleware/checkAuth';
import checkAuth from  '../middleware/checkAuth';
import multer from 'multer';


import AWS from 'aws-sdk';
const router = express.Router();

// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: 'AKIAV54HMTSXUR4OFDF6',
  secretAccessKey: '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',
  region: "us-east-1",
});

// Route for generating a signed URL
router.get('/sign-s3', (req, res) => {
  console.log(req);
  const { fileName, fileType } = req.query;
  console.log(fileName, '|' + fileType + '|');
  // Configure parameters for the signed URL
  const s3Params = {
    Bucket: 'recipe-blog-data', 
    Key: fileName,
    ContentType: fileType,
    Expires: 60 // URL expiration time in seconds (e.g., 1 minute)
  };

  // Generate the signed URL
  s3.getSignedUrl('putObject', s3Params, (err, signedUrl) => {
    if (err) {
      console.error('Error generating signed URL:', err);
      return res.status(500).json({ error: 'Failed to generate signed URL' });
    }

    // Return the signed URL and the corresponding public URL
    const publicUrl = `https://${s3Params.Bucket}.s3.amazonaws.com/${fileName}`;
    res.json({ signedRequest: signedUrl, url: publicUrl });
  });
});

router.post('/create', checkAuth, verifyRoles(8012), recipeController.createRecipe);

router.post('/comment', recipeController.postComment);

router.route('/rating').post(recipeController.rateRecipe);
 

router.route('/titleId/:titleId').get(recipeController.getRecipeByTitleId);

router.route('/:recipeId/comments').get(recipeController.getComments);



router.route('/:recipeId')
    .get(recipeController.getRecipeById)
    .put(checkAuth, verifyRoles(8012), recipeController.updateRecipe)
    .delete(checkAuth, verifyRoles(8012), recipeController.deleteRecipe);


router.route('/')
    .get(recipeController.getAllRecipes)
    .post(checkAuth, verifyRoles(8012), recipeController.createRecipe);
    
export default router; 


