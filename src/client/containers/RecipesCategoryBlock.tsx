import RecipeThumbnail from "../components/Recipe/RecipeThumbnail";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "../api/axios";
import { useEffect, useState } from "react";

export function RecipesCategoryBlock({ tag }: { tag: any }) {
  const { data: fetchedRecipeIds } = useQuery(["recipes", tag.value], () =>
    fetchRecipes({ tag: tag.value!.replace("-", " ") })
  );

  return (
    <div key={tag._id} className ="recipe-category-block">
      <h1 className="recipe-category-header">
        <span className="tag-value">{tag.heading || (tag.value +  " Recipes")}</span> 
      </h1>
      <ul className="recipes-grid">
        {fetchedRecipeIds?.data?.slice(0, 8).map((recipeId: string, index: any) => (
          <RecipeThumbnail key={index} recipeId={recipeId} />
        ))}
      </ul>
       <Link to={`/category/${tag.value.replace(" ", "-")}`} className="more-recipes">
          View all {tag.value} recipes
        </Link>
    </div>
  );
}

async function fetchRecipes({ tag }: { tag: string }) {
  return await axios.get(`/recipes/tags/${tag}`);
}
