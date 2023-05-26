

import { useEffect, useState } from "react";
import { _viewMode } from "../enums";

import RecipeContainer from "./RecipeContainer";
import RecipeForm from "./RecipeForm";

import { useLoaderData } from "react-router";
import { EmptyRecipe, Recipe } from "../types";
import { CommentType } from "../types";
import { Link } from "react-router-dom";
import Comments from "../components/other/Comments";
import useAuth from "../utils/useAuth";

export default function RecipePage() {
    const {auth} = useAuth();
    const [recipeLoaderData, commentsLoaderData] = useLoaderData() as any;
    const [recipe, setRecipe] = useState(recipeLoaderData);
    useEffect(() => {
        setRecipe({ ...recipeLoaderData });
    }, [recipeLoaderData])


    return (
        <>
            {auth?.accessToken ? <RecipeForm recipe={recipe} /> : <RecipeContainer recipe={recipe} viewMode={_viewMode.VIEWING} /> }
            {recipe.titleID && <Comments />}
            <Link to='/recipes'>Back to Recipes</Link>
        </>
    )
}




