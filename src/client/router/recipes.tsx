import { CommentType, EmptyRecipe, Recipe } from "../types";

async function recipeLoader ({request, params} :any){
    const recipe:Recipe = await fetch(
        `/api/recipes/titleId/${params.titleId}`)
        .then(response => response.json());

    
    return [recipe];
}




async function emptyRecipeLoader ({request, params} :any){
    // console.log("in empty recipe loader")
    return [EmptyRecipe, []];
}


export {recipeLoader, emptyRecipeLoader};