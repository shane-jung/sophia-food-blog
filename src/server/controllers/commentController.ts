import { Request, Response } from 'express';
import { MongoClient, ObjectId} from 'mongodb'
import connectToDatabase from '../database/mongodb';

import {CommentType} from '../../client/types';

import { sampleRecipe } from '../seed';


  
const commentController ={
  getAllCommentsForRecipe: async (req: Request, res: Response) => {
    try{
        const db = await connectToDatabase();
        const comments = await db.collection('Comments').find().toArray();
        return res.json(comments);
    } catch (error) {
        console.error(`Error fetching comments in getAllCommentsForRecipe: ${error}`);
        throw error;
    }
  },
  getCommentById: async (req: Request, res: Response)=> {
    const commentId = req.params.commentId;
    try{
        const db = await connectToDatabase();
        const comment = await db.collection('Comments').findOne({"_id" : new ObjectId(commentId)});
        if(!comment){
            return res.status(500).json({ message: 'Internal server error' });
        }
        const typedComment = comment as any as CommentType;
        if(typedComment._id!=null) typedComment._id= typedComment._id.toString();
        return res.status(200).json(comment);
    }  catch(error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
  },
  postComment: async (req: Request, res: Response) => {
    const comment = req.body.comment;
    const reply = req.body.reply;
    const commentId = req.body.commentId;
    console.log(req.body);
    console.log("REPLYING TO COMMENT ? ", reply);
    try{
        const db = await connectToDatabase();
        let result
        if(reply) {
          result = await db.collection('Comments').insertOne({_id: new ObjectId(), ...comment, profileId: new ObjectId(comment.profileId), recipeId: new ObjectId(comment.recipeId)});
          await db.collection('Comments').updateOne({_id: new ObjectId(commentId)}, {$push: {replies: new ObjectId(result.insertedId)}});

        } else  { 
          result = await db.collection('Comments').insertOne({_id: new ObjectId(), ...comment, profileId: new ObjectId(comment.profileId), recipeId: new ObjectId(comment.recipeId), replies: []});
          const addToRecipe = await db.collection('Recipes').updateOne({_id: new ObjectId(comment.recipeId)}, {$push: {comments: new ObjectId(result.insertedId)}});
          console.log(addToRecipe);
        }

        if(comment.profileId) {
          const addToProfile = await db.collection('Profiles').updateOne({_id: new ObjectId(comment.profileId)}, {$push: {comments: new ObjectId(result.insertedId)}});
          // console.log(addToProfile);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error(`Error creating comment in postComment: ${error}`);
        throw error;
    }
  },

  deleteComment: async (req : Request, res: Response) => {
    const commentId = req.params.commentId;
    console.log(commentId);
    try{
        const db = await connectToDatabase();
        const result = await db.collection('Comments').updateOne({_id: new ObjectId(commentId)}, {$set:{'hidden': true}}, {upsert: true});
        console.log(result);
        return res.status(200).json({message: "Recipe deleted successfully"});
    } catch (error) {
        console.error(`Error fetching recipe in deleteRecipe: ${error}`);
        throw error;
    }
  },
  handleLike: async (req: Request, res:Response) => {
    const commentId = req.body.commentId;
    const commentIndex = req.body.commentIndex
    const recipeId = req.body.recipeId;
    const profileId = req.body.profileId;
    const increment = req.body.inc; 
    try{
      const db = await connectToDatabase();
      const commentUpdateResult = await db.collection('Comments').updateOne({_id: new ObjectId(commentId) }, { $inc: {likes: increment}})
      // console.log(result);
      // const anotha = await db.collection('Profiles').updateOne({'email': req.body.email}, {$set : {'comment-likes': {}}})
      // const result2 = await db.collection('Profiles').updateOne( {'email': req.body.email}, { $set : { 'comment-likes.$.liked': req.body.inc > 0 ? 'true' : 'false'} }, {upsert:true})
      const profileFilter = {_id: new ObjectId(profileId), 'likedComments.recipeId' : new ObjectId(recipeId)}

      const profileUpdate = increment < 0 ? {$pull : {'likedComments.$.comments': commentIndex}} : {$push : {'likedComments.$.comments': commentIndex}}
      const profileUpdateResult = await db.collection('Profiles').updateOne(profileFilter, profileUpdate)
      if(profileUpdateResult.modifiedCount === 0){
        const newProfileUpdate = {$push : {'likedComments': {recipeId : new ObjectId(recipeId), comments: [commentIndex]}}}
        const newProfileUpdateResult = await db.collection('Profiles').updateOne({_id: new ObjectId(profileId)}, newProfileUpdate)
      }
      
      return res.sendStatus(200);
    } catch (err) {
      console.log(err);
    throw err;
    }
  }
};

export default commentController;
