import { Router } from "express";
import tagsController from "../controllers/tagsController";

const router = Router();

router.route("/").get(tagsController.getAllTags);
// router.route("/id/:tagId").get(tagsController.getTagById);

router.route("/create").post(tagsController.createTag);
router.route("/reorder").post(tagsController.setTagOrder);
router.route("/addRecipeToTags").post(tagsController.addRecipeToTags)
router.route("/removeRecipeFromTags").post(tagsController.removeRecipeFromTags)

router.route("/id/:tagId").get(tagsController.getTagById);
router.route("/:tagId").put(tagsController.updateTag);
router.route("/:tagValue").get(tagsController.getTagByValue);




export default router;
