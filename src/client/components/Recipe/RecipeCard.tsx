 
import DateComponent from "./DateComponent"
import SimpleTextRecipeComponent from "./SimpleTextRecipeComponent"
import RichTextRecipeComponent from "./RichTextRecipeComponent"
import Ingredients from "./Ingredients"

import { Recipe } from "@/client/types"

interface RecipeCardProps {
    recipe: Recipe;
  }

export default function RecipeCard(recipeProps:RecipeCardProps){
    const recipe = recipeProps.recipe;
    return (
        <div className="recipe-card"> 
            <SimpleTextRecipeComponent name="card-title" className = "recipe-title header" value = {recipe.title} />
            <DateComponent dateCreated = {recipe.dateCreated} dateEdited = {recipe.dateEdited}  />
            <RichTextRecipeComponent name="description" className = "recipe-description" value = {recipe.description}/>
            <Ingredients ingredients = {recipe.ingredients} />

            <RichTextRecipeComponent name="directions" className = "recipe-directions" value = {recipe.directions}/>
        </div>
      
    );
}