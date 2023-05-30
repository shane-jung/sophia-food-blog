 
import DateComponent from "./DateComponent"
import SimpleTextRecipeComponent from "./SimpleTextRecipeComponent"
import RichTextRecipeComponent from "./RichTextRecipeComponent"
import Ingredients from "./Ingredients"

import { Recipe } from "@/client/types"
import { _viewMode } from "@/client/enums"
import useViewMode from "@/client/utils/useViewMode"

interface RecipeCardProps {
    recipe: Recipe;
  }

export default function RecipeCard(recipeProps:RecipeCardProps){
    const recipe = recipeProps.recipe;
    const viewMode = useViewMode();
    return (
        <div className="recipe-card"> 
            <SimpleTextRecipeComponent name="card-title" className = "recipe-title header" value = {recipe.title} />
            { viewMode != _viewMode.CREATING &&  <DateComponent dateCreated = {recipe.dateCreated} dateEdited = {recipe.dateEdited}  /> }
            <RichTextRecipeComponent name="description" className = "recipe-description" value = {recipe.description}/>
            <Ingredients ingredients = {recipe.ingredients} />

            <RichTextRecipeComponent name="directions" className = "recipe-directions" value = {recipe.directions}/>
        </div>
      
    );
}