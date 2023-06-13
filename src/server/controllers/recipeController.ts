import { Request, Response } from 'express';
import { MongoClient, ObjectId} from 'mongodb'
import connectToDatabase from '../database/mongodb';


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
    const recipeId = req.params.recipeId;
    try{
        const db = await connectToDatabase();
        const recipe = await db.collection('Recipes').findOne({ _id : new ObjectId(recipeId)});
        if(!recipe){
            return res.status(500).json({ message: 'Internal server error' });
        }

        return res.status(200).json(recipe);
    }  catch(error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
  },

  getRecipeByTitleId: async (req: Request, res: Response)=> {
    try{
        const db = await connectToDatabase();
        const recipe = await db.collection('Recipes').findOne({ titleId : req.params.titleId});
        if(!recipe){
            return res.status(500).json({ message: 'Internal server error' });
        }

        return res.status(200).json(recipe);
    }  catch(error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
  }

  ,
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
    const recipeId = req.params.recipeId;
    const tags = req.body.tags!=undefined ? JSON.parse(req.body.tags).map((tag: any) => new ObjectId(tag)) : [];
    try{
        const db = await connectToDatabase();
        const result = await db.collection('Recipes').updateOne({_id: new ObjectId(recipeId)}, {"$set": {...req.body, tags: tags}});
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
        const result = await db.collection('Recipes').deleteOne({_id: new ObjectId(req.params.recipeId) });
        return res.status(200).json({message: "Recipe deleted successfully"});
    } catch (error) {
        console.error(`Error fetching recipe in deleteRecipe: ${error}`);
        throw error;
    }
  },
  rateRecipe: async(req: Request, res: Response) => {
    console.log(req.body);
    const {userId, recipeId, rating, date} = req.body;
    try{
      const db = await connectToDatabase();
      const result = await db.collection('Recipes').updateOne({_id: new ObjectId(recipeId)}, {$set: {"ratings.$[element]": {rating, userId: new ObjectId(userId), date}}}, {arrayFilters: [{"element.userId": new ObjectId(userId)}]});
      const result2 = await db.collection('Profiles').updateOne({_id: new ObjectId(userId)}, {$set: {"ratings.$[element]": {rating, recipeId: new ObjectId(recipeId), date}}}, {arrayFilters: [{"element.recipeId": new ObjectId(recipeId)}]});
      console.log(result2);
      if(result.modifiedCount === 0){
        console.log("Didn't update, pushing new rating")
        const result = await db.collection('Recipes').updateOne({_id: new ObjectId(recipeId)}, {$push: { ratings: {rating, userId: new ObjectId(userId), date}}});
        const result2 = await db.collection('Profiles').updateOne({_id: new ObjectId(userId)}, {$push: { ratings: {rating, recipeId: new ObjectId(recipeId), date}}});
        console.log(result2);
      }
     
    }catch (error:any){
      console.log(error);
    }
  },
  postComment: async (req: Request, res: Response) => {
    const comment = req.body.comment;
    const reply = req.body.reply;
    const recipeId = req.body.comment.recipeId;
    const commentId = req.body.commentId;
    // console.log(comment);
    try{
        const db = await connectToDatabase();
        if(!reply){
          const result = await db.collection('Recipes').updateOne({_id: new ObjectId(recipeId)}, {$push: {comments: {_id: new ObjectId(), ...comment, replies: [], profileId : new ObjectId(comment.profileId) }}});
          // console.log(result);
        } else {
          // console.log(req.body);
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
          // console.log(result);
        }
        return res.sendStatus(200);
    } catch (error) {
        console.error(`Error creating comment in postComment: ${error}`);
        throw error;
    }
  }, 
  getComments: async (req: Request, res: Response) => {
    try {
        const db = await connectToDatabase();
        const result = await db.collection('Recipes').findOne({_id: new ObjectId(req.params.recipeId)});
        const commentIds = result?.comments;
        const comments = await Promise.all(commentIds.map(async (commentId: ObjectId) => {
          const comment = await db.collection('Comments').findOne({_id: commentId});
          
          const replies = await Promise.all(comment?.replies.map(async (replyId:ObjectId)=>{
            const reply = await db.collection('Comments').findOne({_id: replyId});
            return reply;
          }));
          return {comment, replies};
        }));
        return res.json(comments);
    } catch(error) {    
      console.error(`Error fetching comments in getComments: ${error}`);
      throw error;
    }
  },
  createTag: async (req: Request, res: Response) => {
      const { tag } = req.body;
      try{

        const db = await connectToDatabase();
        const response = await db.collection('Tags').insertOne({value: tag, recipes: [], description:""});
        return res.json(response.insertedId);
      } catch (error) {
        console.error(`Error creating tag in createTag: ${error}`);
        throw error;  
      }
  },
  getAllTags: async (req: Request, res: Response) => {
    try {
      const db = await connectToDatabase();
      const result = await db.collection('Tags').find().toArray();
      return res.json(result);
    } catch(error) {
      console.error(`Error fetching tags in getTags: ${error}`);
      throw error;
    }
  },
  getTags: async (req: Request, res: Response) => {
      try {
        const db = await connectToDatabase();
        const result = await db.collection('Recipes').findOne({_id: new ObjectId(req.params.recipeId)});
        const tagIds = result?.tags;
        const tags = await Promise.all(tagIds.map(async (tagId: ObjectId) => {
          const tag = await db.collection('Tags').findOne({_id: tagId});
          return tag;
        }));
        return res.json(tags);
    } catch(error) {    
      console.error(`Error fetching comments in getComments: ${error}`);
      throw error;
    }
  },

  getTagById: async (req: Request, res: Response) => {
    try {
      const db = await connectToDatabase();
      const result = await db.collection('Tags').findOne({_id: new ObjectId(req.params.tagId)});
      return res.json(result);
  } catch(error) {    
  }
}
};

export default recipeController;
