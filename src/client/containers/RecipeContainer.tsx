import { Recipe,EmptyRecipe } from '@/client/types'

import RecipeToolbar from '@/client/components/Recipe/RecipeToolbar'
import AuthorSnippet from '../components/Recipe/AuthorSnippet';

import SimpleTextRecipeComponent from '../components/Recipe/SimpleTextRecipeComponent';
import RichTextRecipeComponent from '../components/Recipe/RichTextRecipeComponent';

import { _viewMode } from '../enums';
import TitleId from '../components/Recipe/TitleID';

interface RecipeContainerProps{
    recipe: Recipe,
}

import { CommentType } from '@/client/types';
import RatingBar from '../components/Recipe/RatingBar';
import DateComponent from '../components/Recipe/DateComponent';
import Ingredients from '../components/Recipe/Ingredients';
import useViewMode from '../utils/useViewMode';

export default function RecipeContainer({recipe}: RecipeContainerProps) {
    const { viewMode } = useViewMode();
    return (
        <div className = "recipe-container">
            <SimpleTextRecipeComponent name="title" className = "recipe-title" value = {recipe.title} />
            {viewMode == _viewMode.VIEWING && <RatingBar/> }
            <AuthorSnippet author = {recipe.author}/>
            <TitleId value = {recipe.titleId}/>
            <RecipeToolbar /> 
            <RichTextRecipeComponent name="background" className = "recipe-background" value = {recipe.background}/>
            <div className="recipe-card"> 
                <SimpleTextRecipeComponent name="card-title" className = "recipe-title header" value = {recipe.title} />
                {viewMode == _viewMode.VIEWING && <DateComponent dateCreated = {recipe.dateCreated} dateEdited = {recipe.dateEdited}  /> }
                <RichTextRecipeComponent name="description" className = "recipe-description" value = {recipe.description}/>
                <RichTextRecipeComponent name="ingredients" className = "recipe-ingredients" value = {recipe.ingredients}/>
                <RichTextRecipeComponent name="directions" className = "recipe-directions" value = {recipe.directions}/>
            </div>
        </div>
    );
}


                    