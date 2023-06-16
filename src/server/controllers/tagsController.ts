import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import connectToDatabase from "../database/mongodb";

import { CommentType } from "../../client/types";

const tagsController = {
    createTag: async (req: Request, res: Response) => {
        const { tag } = req.body;
        try {
          const db = await connectToDatabase();
          const response = await db
            .collection("Tags")
            .insertOne({ value: tag.toLowercase(), description: "", recipes: [] });
          return res.json(response.insertedId);
        } catch (error) {
          console.error(`Error creating tag in createTag: ${error}`);
          throw error;
        }
      },
      getAllTags: async (req: Request, res: Response) => {
        try {
          const db = await connectToDatabase();
          const result = await db.collection("Tags").find().toArray();
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
          console.log(response);
          return res.json(response);
        } catch (error) {
          console.error(`Error adding recipe to tags in addRecipeToTags: ${error}`);
          throw error;
        }
      }
};

export default tagsController;
