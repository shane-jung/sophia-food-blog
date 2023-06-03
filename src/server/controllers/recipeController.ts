import { Request, Response } from 'express';
import { MongoClient, ObjectId} from 'mongodb'
import connectToDatabase from '../database/mongodb';

import {Recipe} from '../../client/types';
import { sampleRecipe } from '../seed';



const recipeController ={
  getAllRecipes: async (req: Request, res: Response) => {
    try{

        const db = await connectToDatabase();
        const recipes = await db.collection('Recipes').find().toArray();
        return res.status(200).json(recipes);
    } catch (error) {
        console.error(`Error fetching recipes in getAllRecipes: ${error}`);
        // return res.json(sampleRecipe);
        throw error;
    }
  },
  getRecipeById: async (req: Request, res: Response)=> {
    const Id = req.params.titleId;
    try{
        const db = await connectToDatabase();
        const recipe = await db.collection<Recipe>('Recipes').findOne({"titleId" : Id});
        if(!recipe){
            return res.status(500).json({ message: 'Internal server error' });
        }
        const typedRecipe = recipe as any as Recipe;
        if(typedRecipe._id!=null) typedRecipe._id= typedRecipe._id.toString();
        return res.status(200).json(recipe);
    }  catch(error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
  },
  createRecipe: async (req: Request, res: Response) => {
    const recipe = req.body;
    try{
        const db = await connectToDatabase();
        const result = await db.collection('Recipes').insertOne(recipe);
        await db.collection('Recipes').updateOne({_id:result.insertedId}, {$set:{'comments':[]}});
        
        return res.status(200).json({result: result, message: "Recipe created successfully"});
    } catch (error) {
        console.error(`Error creating recipe in createRecipe: ${error}`);
        throw error;
    }
    return;
  },
  updateRecipe: async (req: Request, res: Response) => {

    const recipe = req.body;
    // console.log(req.body);
    try{
        const db = await connectToDatabase();
        const result = await db.collection('Recipes').updateOne({'titleId': recipe.titleId}, {"$set": recipe});
        console.log(result);
        return res.status(200).json({message: "Recipe updated successfully"});
    } catch (error) {
        console.error(`Error fetching recipe in updateRecipe: ${error}`);
        throw error; 
    }
  },
  deleteRecipe: async (req : Request, res: Response) => {
    try{
        const db = await connectToDatabase();
        const result = await db.collection('Recipes').deleteOne({titleId: req.params.titleId});
        return res.status(200).json({message: "Recipe deleted successfully"});
    } catch (error) {
        console.error(`Error fetching recipe in deleteRecipe: ${error}`);
        throw error;
    }
  },
  postComment: async (req: Request, res: Response) => {
    const comment = req.body.comment;
    const reply = req.body.reply;
    const recipeId = req.body.recipeId;
    const commentId = req.body.commentId;
    // console.log(comment);
    try{
        const db = await connectToDatabase();
        if(!reply){
          const result = await db.collection('Recipes').updateOne({_id: new ObjectId(recipeId)}, {$push: {comments: {_id: new ObjectId(), ...comment, replies: [], profileId : new ObjectId(comment.profileId) }}});
          console.log(result);
        } else {
          console.log(req.body);
          const result = await db.collection('Recipes').updateOne(
            {
              _id: new ObjectId(recipeId), 
              'comments._id': new ObjectId(commentId)
            }, 
            { 
              $push: { 
                'comments.$[comment].replies': { 
                  _id: new ObjectId(), 
                  ...comment, 
                  profileId : new ObjectId(comment.profileId) 
                } 
              } 
            }, 
            { 
              arrayFilters: [
                { 
                  'comment._id': new ObjectId(commentId) 
                }
              ] 
            } 
          );
          console.log(result);
        }
        // if(comment.profileId) {
        //   const addToProfile = await db.collection('Profiles').updateOne({_id: new ObjectId(comment.profileId)}, {$push: {comments: new ObjectId(result.upsertedId)}});
        //   // console.log(addToProfile);
        // }
        return res.sendStatus(200);
    } catch (error) {
        console.error(`Error creating comment in postComment: ${error}`);
        throw error;
    }
  },
};

export default recipeController;
