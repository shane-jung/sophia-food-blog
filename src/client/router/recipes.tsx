
import { CommentType, EmptyRecipe, Recipe } from "../types";
async function recipeLoader ({request, params} :any){
    const recipe:Recipe = await fetch(
        `/api/recipes/${params.titleID}`)
        .then(response => response.json());
    
    const comments = recipe.comments.map == undefined? [] :  await Promise.all(recipe.comments.map(async commentID=>{
        const resp = await fetch(`/api/comments/${commentID}`);
        return resp.json();
    }));

    console.log(comments);
    return [recipe, comments];
}




async function emptyRecipeLoader ({request, params} :any){
    // console.log("in empty recipe loader")
    return [EmptyRecipe, []];
}


export {recipeLoader, emptyRecipeLoader};