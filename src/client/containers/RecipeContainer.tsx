import { useEffect, useState } from 'react'; 
import { Link, useLoaderData } from 'react-router-dom';

import { Recipe,EmptyRecipe } from '@/client/types'

import RecipeCard from '@/client/components/Recipe/RecipeCard';
import RecipeToolbar from '@/client/components/Recipe/RecipeToolbar'
import Comments from '@/client/components/other/Comments'
import AuthorSnippet from '../components/Recipe/AuthorSnippet';

import SimpleTextRecipeComponent from '../components/Recipe/SimpleTextRecipeComponent';
import RichTextRecipeComponent from '../components/Recipe/RichTextRecipeComponent';

import { _viewMode } from '../enums';
import TitleID from '../components/Recipe/TitleID';

interface RecipeContainerProps{
    recipe: Recipe,
}

import { CommentType } from '@/client/types';
import RatingBar from '../components/Recipe/RatingBar';
import DateComponent from '../components/Recipe/DateComponent';
import Ingredients from '../components/Recipe/Ingredients';

export default function RecipeContainer({recipe}: RecipeContainerProps) {
    return (
        <div className = "recipe-container">
            <SimpleTextRecipeComponent name="title" className = "recipe-title" value = {recipe.title} />
            <RatingBar/>
            <AuthorSnippet author = {recipe.author}/>
            <TitleID value = {recipe.titleID}/>
            <RecipeToolbar /> 
            <RichTextRecipeComponent name="background" className = "recipe-background" value = {recipe.background}/>
            <div className="recipe-card"> 
                <SimpleTextRecipeComponent name="card-title" className = "recipe-title header" value = {recipe.title} />
                <DateComponent dateCreated = {recipe.dateCreated} dateEdited = {recipe.dateEdited}  />
                <RichTextRecipeComponent name="description" className = "recipe-description" value = {recipe.description}/>
                <Ingredients ingredients = {recipe.ingredients} />
                <RichTextRecipeComponent name="directions" className = "recipe-directions" value = {recipe.directions}/>
            </div>
        </div>
    );
}


                    