import { Recipe,EmptyRecipe } from '@/client/types'

import AuthorSnippet from '../components/Recipe/AuthorSnippet';

import SimpleTextRecipeComponent from '../components/Recipe/SimpleTextRecipeComponent';
import RichTextRecipeComponent from '../components/Recipe/RichTextRecipeComponent';

import { _viewMode } from '../enums';
import TitleId from '../components/Recipe/TitleID';

interface RecipeContainerProps{
    recipe: Recipe,
}

import RatingBar from '../components/Recipe/RatingBar';
import DateComponent from '../components/Recipe/DateComponent';
import { useSelector } from 'react-redux';
import ImageUpload from '../components/Recipe/ImageUpload';

export default function RecipeContainer() {
    const viewMode = useSelector((state: any) => state.user.viewMode);
    const recipe = useSelector((state: any) => state.recipe);
    // console.log(recipe.ingredients);
    return (
        <div className = "recipe-container">
            <ImageUpload />
            <SimpleTextRecipeComponent name="title" className = "recipe-title" value = {recipe.title} />
            <SimpleTextRecipeComponent name="subtitle" className = "recipe-subtitle" value = {recipe.subtitle} />

            {viewMode == "VIEWING" && 
                <>
                    <RatingBar/> 
                    <AuthorSnippet author = {recipe.author}/> 
                </>
            }
            
            {viewMode == "CREATING" && <TitleId value = {recipe.titleId}/>}
            <RichTextRecipeComponent name="background" className = "recipe-background" initialValue = {recipe.background}/>
            <div className="recipe-card"> 
                <SimpleTextRecipeComponent name="cardTitle" className = "recipe-title header" value = {recipe.cardTitle} />
                {viewMode == "VIEWING" && <DateComponent dateCreated = {recipe.dateCreated} dateEdited = {recipe.dateEdited}  /> }
                <RichTextRecipeComponent name="description" className = "recipe-description" initialValue = {recipe.description}/>
                <RichTextRecipeComponent name="ingredients" className = "recipe-ingredients" initialValue = {recipe.ingredients}/>
                <RichTextRecipeComponent name="directions" className = "recipe-directions" initialValue = {recipe.directions}/>
            </div>
        </div>
    );
}


                    