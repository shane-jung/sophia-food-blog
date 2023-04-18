import React, { useEffect, useState } from 'react'; 
import { useLoaderData } from 'react-router-dom';

import { Recipe } from '@/client/types'


import Title from '@/client/components/Recipe/Title';
import Date from '@/client/components/Recipe/Date';
import Description from '@/client/components/Recipe/Description';
import Ingredients from '@/client/components/Recipe/Ingredients';
import Instructions from '@/client/components/Recipe/Instructions';
import DeleteRecipe from '@/client/components/DeleteRecipe';
import EditRecipe from '@/client/components/EditRecipe';

export const RecipeContainer :React.FC = ()=> {
    //const recipe = useLoaderData() as Recipe;

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const loaderRecipe = useLoaderData() as Recipe;
    useEffect(() =>{
        setRecipe(loaderRecipe);
    }, []);
    if(recipe == null) return <div>Recipe is null</div>

    const dates = { 
        dateEdited: recipe.dateEdited,
        dateCreated: recipe.dateCreated
    }
  
    return (
        <div>
            <DeleteRecipe titleID = {recipe.titleID} />
            <EditRecipe titleID = {recipe.titleID} />
            <Title title = {recipe.title} />
            <Date dates = { dates } />
            <Description description = {recipe.description}/>
            {/* <Ingredients ingredients = {recipe.ingredients}/>
            <Instructions instructions = {recipe.instructions}/> */}
        </div>
    );
}