import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import connectToDatabase from "../database/mongodb";

import { CommentType } from "../../client/types";

const tagsController = {
    createTag: async (req: Request, res: Response) => {
      console.log(req.body);
      const {category, tag} = req.body;
      
        return;
        try {
          const db = await connectToDatabase();
          const highestVal = (await db.collection("Tags").find({category: category}).sort({order: -1}).limit(1).toArray())[0].order;
          const response = await db
            .collection("Tags")
            .insertOne({ value: tag.toLowerCase(), category, description: "", recipes: [] , order: highestVal + 1});
          return res.json(response.insertedId);
        } catch (error) {
          console.error(`Error creating tag in createTag: ${error}`);
          throw error;
        }
      },
      deleteTag: async (req: Request, res: Response) => {
        try {
          const db = await connectToDatabase();
          const response = await db
            .collection("Tags")
            .deleteOne({ _id: new ObjectId(req.params.tagId) });
          const test = await db
            .collection("Recipes")
            .updateMany({}, { $pull: { tags : new ObjectId(req.params.tagId)}  }, {multi: true});
          // console.log(test);
          return res.json(response);
        } catch (error) {
          console.error(`Error deleting tag in deleteTag: ${error}`);
          throw error;
        }
      },
      updateTag: async (req: Request, res: Response) => { 
        delete req.body._id;
        console.log(req.body);
        try{
          const db = await connectToDatabase(); 
          const response = await db.collection("Tags").updateOne({_id: new ObjectId(req.params.tagId)}, {$set: {...req.body, recipes: req.body.recipes?.map((recipe: any) => new ObjectId(recipe))}});
          console.log(response);
          return res.json(response);
        } catch (err) {
          console.error(`Error updating tag in updateTag: ${err}`);
          throw err;
        }

      },
      getAllTags: async (req: Request, res: Response) => {
        try {
          const db = await connectToDatabase();
          const result = await db.collection("Tags").find().sort({order:1}).toArray();
          return res.json(result);
        } catch (error) {
          console.error(`Error fetching tags in getTags: ${error}`);
          throw error;
        }
      },
      getTagById: async (req: Request, res: Response) => {
        try {
          const db = await connectToDatabase();
          const result = await db
            .collection("Tags")
            .findOne({ _id: new ObjectId(req.params.tagId) });
          return res.json(result);
        } catch (error) {}
      },
      getTagByValue: async (req: Request, res: Response) => {
        try {
          const db  = await connectToDatabase();
          const result = await db 
            .collection("Tags")
            .findOne({ value: req.params.tagValue });
          return res.json(result);
        } catch (error) {
          console.error(`Error fetching tag in getTagByValue: ${error}`);
          throw error;
        }
      },
      addRecipeToTags: async (req: Request, res: Response) => {
        const { recipeId, tagIds } = req.body;
        const tagIdsObjectIds = tagIds.map((tagId: string) => new ObjectId(tagId));
        try {
          const db = await connectToDatabase();
          const response = await db
            .collection("Tags")
            .updateMany(
              { _id: { $in: tagIdsObjectIds} },
              { $addToSet: { recipes: new ObjectId(recipeId) } }
            );
          // console.log(response);
          return res.json(response);
        } catch (error) {
          console.error(`Error adding recipe to tags in addRecipeToTags: ${error}`);
          throw error;
        }
      },

      removeRecipeFromTags: async (req: Request, res: Response) => {
        const { recipeId, tags } = req.body;
        const tagIdsObjectIds = tags.map((tag: any) => new ObjectId(tag));
        try {
          const db = await connectToDatabase();
          const response = await db
            .collection("Tags")
            .updateMany(
              { _id: { $in: tagIdsObjectIds} },
              { $pull: { recipes: new ObjectId(recipeId)} }
            );
          // console.log(response);
          return res.json(response);
        } catch (error) {
          console.error(`Error adding recipe to tags in addRecipeToTags: ${error}`);
          throw error;
        }
      },


      setTagOrder: async (req: Request, res: Response) => {
        const { newOrder } = req.body;
        try{
          const db = await connectToDatabase();
          newOrder.forEach(async (tagId: string, index: number) => {
            await db.collection("Tags").updateOne({_id: new ObjectId(tagId)}, {$set: {order: index}});
          });
          return res.status(200).json({success: true})
        } catch (err) {
          console.error(`Error setting tag order in setTagOrder: ${err}`);
          throw err;
        }
      }
};

export default tagsController;
