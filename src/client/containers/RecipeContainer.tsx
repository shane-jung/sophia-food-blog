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
    viewMode : _viewMode,
    recipe: Recipe,
}

import { CommentType } from '@/client/types';

export default function RecipeContainer({viewMode, recipe}: RecipeContainerProps) {
    return (
        <div className = "recipe-container">
            <SimpleTextRecipeComponent name="title" className = "recipe-title" value = {recipe.title} />
            <AuthorSnippet author = {recipe.author}/>
            <TitleID value = {recipe.titleID}/>
            <RecipeToolbar /> 
            <RichTextRecipeComponent name="background" className = "recipe-background" value = {recipe.background}/>
            <RecipeCard recipe = {recipe} /> 
        </div>
    );
}


                    