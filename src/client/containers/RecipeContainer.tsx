import { Recipe, EmptyRecipe } from "@/client/types";
import AuthorSnippet from "../components/Recipe/AuthorSnippet";
import SimpleTextRecipeComponent from "../components/Recipe/Form/SimpleTextRecipeComponent";
import RichTextRecipeComponent from "../components/Recipe/Form/RichTextRecipeComponent";

import { _viewMode } from "../enums";
import TitleId from "../components/Recipe/Form/TitleID";

interface RecipeContainerProps {
  recipe: Recipe;
}

import RatingBar, { StaticRatingBar } from "../components/Recipe/RatingBar";
import DateComponent from "../components/Recipe/DateComponent";
import { useSelector } from "react-redux";
import ImageUpload from "../components/Recipe/ImageUpload";
import Tags from "../components/Recipe/Tags";
import RecipeToolbar from "../components/Recipe/Form/RecipeToolbar";

export default function RecipeContainer() {
  const viewMode = useSelector((state: any) => state.user.viewMode);
  const recipe = useSelector((state: any) => state.recipe);
  // console.log(recipe.ingredients);
  return (
    <div className="recipe-container">
      <div className="recipe-header">
        <ImageUpload />
        <SimpleTextRecipeComponent
          name="title"
          className="recipe-title"
          initialValue={recipe.title}
        />

        {viewMode == "VIEWING" && (
          <>
            <AuthorSnippet author={recipe.author} />
            <StaticRatingBar />
            <a className="page-link" href="#comments">
              {recipe.comments?.length || 0} comments
            </a>
            <a className="page-link" href="#recipe">
              Jump to Recipe
            </a>
          </>
        )}
        <Tags />
      </div>
      {/* <SimpleTextRecipeComponent name="subtitle" className = "recipe-subtitle" initialValue = {recipe.subtitle} /> */}

      {viewMode == "CREATING" && <TitleId value={recipe.titleId} />}
      <RichTextRecipeComponent
        name="background"
        className="recipe-background"
        initialValue={recipe.background}
      />
      <div id="recipe" className="recipe-card">
        <div className="header">
          <SimpleTextRecipeComponent
            name="cardTitle"
            className="recipe-card-title"
            initialValue={recipe.cardTitle}
          />
          {viewMode == "VIEWING" && (
            <DateComponent
              dateCreated={recipe.dateCreated}
              dateEdited={recipe.dateEdited}
            />
          )}
        </div>

        <RichTextRecipeComponent
          name="description"
          className="recipe-description"
          initialValue={recipe.description}
        />
        <RichTextRecipeComponent
          name="ingredients"
          className="recipe-ingredients"
          initialValue={recipe.ingredients}
        />
        <RichTextRecipeComponent
          name="directions"
          className="recipe-directions"
          initialValue={recipe.directions}
        />
      </div>
    </div>
  );
}
