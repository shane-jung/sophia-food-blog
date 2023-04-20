import React, { useEffect, useState } from 'react'; 
import { Link, useLoaderData } from 'react-router-dom';

import { Recipe } from '@/client/types'

import RecipeElement from '@/client/components/Recipe/RecipeElement';
import Title from '@/client/components/Recipe/Title';
import RecipeCard from '@/client/components/Recipe/RecipeCard';
import RecipeToolbar from '@/client/components/Recipe/RecipeToolbar'
import DeleteRecipe from '@/client/components/DeleteRecipe';
import EditRecipe from '@/client/components/EditRecipe';

export const RecipeContainer :React.FC = ()=> {

 
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const loaderRecipe = useLoaderData() as Recipe;
    useEffect(() =>{
        setRecipe(loaderRecipe);
    }, []);
    console.log()

    if(recipe == null) return <div>Recipe is null</div>;

    const isAuthorized = true;
    const text =  <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illo illum nihil earum sit veritatis,
    accusamus aliquid deserunt cum et voluptatibus aut, eos perferendis aliquam eaque ratione 
    asperiores culpa. Molestias, impedit.</p>;
    return (
        <div className = "recipe-container">
            <RecipeElement isAuthorized = { isAuthorized } children = { <Title title = {recipe.title} /> } />
            <RecipeElement isAuthorized = { isAuthorized } children = { <RecipeToolbar /> } />
            <RecipeElement isAuthorized = { isAuthorized } children = { text } />
            
           
            <RecipeElement isAuthorized = { isAuthorized } children = { <RecipeCard recipe = {recipe} /> } />
            <Link to='/recipes'>Back to Recipes</Link>
            <DeleteRecipe titleID = {recipe.titleID} />
            <EditRecipe titleID = {recipe.titleID} />
        </div>
    );
}