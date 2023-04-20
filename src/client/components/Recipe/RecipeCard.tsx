 
import DateComponent from "./DateComponent"
import Description from "./Description"
import Directions from "./Directions"
import Title from "./Title"

import { Recipe } from "@/client/types"

interface RecipeCardProps {
    recipe: Recipe;
  }

export default function RecipeCard(recipeProps:RecipeCardProps){
    const recipe = recipeProps.recipe;
    return (
        <div className="recipe-card">
            <Title title = {recipe.title}/>
            <DateComponent dateCreated = {recipe.dateCreated} dateEdited = {recipe.dateEdited}  />
            <Description description = {recipe.description}/>
            <Directions directions = {recipe.directions}/>
        </div>
      
    );
}