import express, { Request, Response } from "express";
import recipeController from "../controllers/recipeController";
import { verifyRoles } from "../middleware/checkAuth";
import checkAuth from "../middleware/checkAuth";
import AWS from "aws-sdk";
import commentController from "../controllers/commentController";

const router = express.Router();

// Route for generating a signed URL
router.get("/sign-s3", (req: Request, res: Response) => {
  // AWS S3 configuration
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
  const { fileName, fileType } = req.query;
  // Configure parameters for the signed URL
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
    Expires: 60, // URL expiration time in seconds (e.g., 1 minute)
  };

  // Generate the signed URL
  s3.getSignedUrl("putObject", s3Params, (err, signedUrl) => {
    if (err) {
      console.error("Error generating signed URL:", err);
      return res.status(500).json({ error: "Failed to generate signed URL" });
    }

    // Return the signed URL and the corresponding public URL
    const publicUrl = `https://${s3Params.Bucket}.s3.amazonaws.com/${fileName}`;
    res.json({ signedRequest: signedUrl, url: publicUrl });
  });
});

router.post(
  "/create",
  checkAuth,
  verifyRoles(8012),
  recipeController.createRecipe
);

router.post("/comment", recipeController.postComment);

router.route("/rating").post(recipeController.rateRecipe);

router.route("/tags").get(recipeController.getAllTags);
router.route("/tags/:tagId").get(recipeController.getTagById);

router.route("/tags/create").post(recipeController.createTag);

router.route("/titleId/:titleId").get(recipeController.getRecipeByTitleId);

router
  .route("/:recipeId/comments")
  .get(commentController.getAllCommentsForRecipe);
router.route("/:recipeId/tags").get(recipeController.getTags);

router
  .route("/:recipeId")
  .get(recipeController.getRecipeById)
  .put(checkAuth, verifyRoles(8012), recipeController.updateRecipe)
  .delete(checkAuth, verifyRoles(8012), recipeController.deleteRecipe);

router
  .route("/")
  .get(recipeController.getAllRecipes)
  .post(checkAuth, verifyRoles(8012), recipeController.createRecipe);

export default router;
