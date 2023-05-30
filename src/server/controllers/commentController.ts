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
    const commentID = req.params.commentID;
    try{
        const db = await connectToDatabase();
        const comment = await db.collection('Comments').findOne({"_id" : new ObjectId(commentID)});
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
    const comment = req.body;
  
    try{
        const db = await connectToDatabase();
        const result = await db.collection('Comments').insertOne({_id: new ObjectId(), ...comment});

        return res.status(200).json(result);
    } catch (error) {
        console.error(`Error creating comment in postComment: ${error}`);
        throw error;
    }
  },

  deleteComment: async (req : Request, res: Response) => {
    try{
        const db = await connectToDatabase();
        const result = await db.collection('Comments').deleteOne({id: req.params.commentID});
        console.log(result);
        return res.status(200).json({message: "Recipe deleted successfully"});
    } catch (error) {
        console.error(`Error fetching recipe in deleteRecipe: ${error}`);
        throw error;
    }
  },
  updateLikes: async (req: Request, res: Response) => {
    try{
      const db = await connectToDatabase();
      const result = await db.collection('Comments').updateOne({id: req.params.commentID}, {$set: {likes: req.body.likes}});
      console.log(result);
      return res.status(200).json({message: "Recipe likes updated"});
    } catch (error) { 
      console.error(`Error fetching recipe in updateLikes: ${error}`);
      throw error;
    }
  },
};

export default commentController;
