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
    const ID = req.params.titleID;
    try{
        const db = await connectToDatabase();
        const recipe = await db.collection<Recipe>('Recipes').findOne({"titleID" : ID});
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
        const result = await db.collection('Recipes').updateOne({'titleID': recipe.titleID}, {"$set": recipe});
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
        const result = await db.collection('Recipes').deleteOne({titleID: req.params.titleID});
        return res.status(200).json({message: "Recipe deleted successfully"});
    } catch (error) {
        console.error(`Error fetching recipe in deleteRecipe: ${error}`);
        throw error;
    }
  },
  addCommentToRecipe: async (req: Request, res: Response) => {
    const titleID = req.params.titleID;
    const commentID = req.body.commentId;
    console.log(titleID, commentID);
    const db = await connectToDatabase();

    const result = await db.collection('Recipes').updateOne({titleID:titleID} , {$push: { comments: new ObjectId(commentID)}} );
    return res.status(200).json(result);
    
  },
};

export default recipeController;
