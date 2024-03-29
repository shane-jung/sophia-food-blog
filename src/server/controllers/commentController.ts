import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import connectToDatabase from "../database/mongodb";

import { CommentType } from "@/client/types";

const commentController = {
  getAllCommentsForRecipe: async (req: Request, res: Response) => {
    try {
      const db = await connectToDatabase();
      const comments = await db
        .collection("Comments")
        .find({ recipeId: new ObjectId(req.params.recipeId), hidden: false })
        .toArray();
      return res.json(comments);
    } catch (error) {
      console.error(
        `Error fetching comments in getAllCommentsForRecipe: ${error}`
      );
      throw error;
    }
  },
  getCommentById: async (req: Request, res: Response) => {
    const commentId = req.params.commentId;
    try {
      const db = await connectToDatabase();
      const comment = await db
        .collection("Comments")
        .findOne({ _id: new ObjectId(commentId) });
      if (!comment) {
        return res.status(500).json({ message: "Internal server error" });
      }
      const typedComment = comment as any as CommentType;
      if (typedComment._id != null)
        typedComment._id = typedComment._id.toString();
      return res.status(200).json(comment);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  postComment: async (req: Request, res: Response) => {
    const comment = req.body.comment;
    const reply = req.body.reply;
    const commentId = req.body.commentId;
    try {
      const db = await connectToDatabase();
      let result;
      if (reply) {
        result = await db.collection("Comments").findOneAndUpdate(
          { _id: new ObjectId(commentId) },
          {
            $push: {
              replies: {
                ...req.body.comment,
                _id: new ObjectId(),
                profileId: new ObjectId(comment.profileId),
                recipeId: new ObjectId(comment.recipeId),
              },
            },
          },
          { returnDocument: "after" }
        );
      } else {
        result = await db.collection("Comments").findOneAndUpdate(
          {
            _id: new ObjectId(),
            ...comment,
            profileId: new ObjectId(comment.profileId),
            recipeId: new ObjectId(comment.recipeId),
            replies: [],
          },
          { $set: {} },
          { upsert: true, returnDocument: "after" }
        );
      }

      return res.status(200).json(result.value);
    } catch (error) {
      console.error(`Error creating comment in postComment: ${error}`);
      throw error;
    }
  },

  deleteComment: async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const { parentId } = req.body;
    try {
      const db = await connectToDatabase();
      if (!parentId) {
        const result = await db
          .collection("Comments")
          .updateOne(
            { _id: new ObjectId(commentId) },
            { $set: { hidden: true } },
            { upsert: true }
          );
      } else {
        const result = await db.collection("Comments").updateOne(
          {
            _id: new ObjectId(parentId),
            replies: { $elemMatch: { _id: new ObjectId(commentId) } },
          },
          { $set: { "replies.$.hidden": true } }
        );
      }
      return res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (error) {
      console.error(`Error fetching recipe in deleteRecipe: ${error}`);
      throw error;
    }
  },
  handleLike: async (req: Request, res: Response) => {
    const commentId = req.body.commentId;
    const recipeId = req.body.recipeId;
    const profileId = req.body.profileId;
    const increment = req.body.inc;
    console.log(req.body);
    try {
      const db = await connectToDatabase();
      const commentUpdateResult = await db
        .collection("Comments")
        .findOneAndUpdate(
          { _id: new ObjectId(commentId) },
          { $inc: { likes: increment } },
          { returnDocument: "after" }
        );
      const profileFilter = { _id: new ObjectId(profileId) };
      const profileUpdate =
        increment < 0
          ? {
              $pull: {
                "likedComments.$[recipe].comments": new ObjectId(commentId),
              },
            }
          : {
              $push: {
                "likedComments.$[recipe].comments": new ObjectId(commentId),
              },
            };
      const profileUpdateResult = await db
        .collection("Profiles")
        .updateOne(profileFilter, profileUpdate, {
          arrayFilters: [{ "recipe.recipeId": new ObjectId(recipeId) }],
        });
      console.log("PROFILE UPDATE: ", profileUpdateResult);
      if (profileUpdateResult.modifiedCount === 0) {
        const newProfileUpdate = {
          $push: {
            likedComments: {
              recipeId: new ObjectId(recipeId),
              comments: [new ObjectId(commentId)],
            },
          },
        };
        const newProfileUpdateResult = await db
          .collection("Profiles")
          .updateOne({ _id: new ObjectId(profileId) }, newProfileUpdate);
      }

      return res.status(200).json(commentUpdateResult);
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};

export default commentController;
