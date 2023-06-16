import { Router } from "express";
import tagsController from "../controllers/tagsController";

const router = Router();

router.route("/").get(tagsController.getAllTags);
// router.route("/id/:tagId").get(tagsController.getTagById);
router.route("/create").post(tagsController.createTag);
router.route("/addRecipeToTags").post(tagsController.addRecipeToTags)
router.route("/:tagValue").get(tagsController.getTagByValue);




export default router;
