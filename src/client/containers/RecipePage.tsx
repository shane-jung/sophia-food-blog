

import { useEffect, useState } from "react";
import { _viewMode } from "../enums";

import RecipeContainer from "./RecipeContainer";
import RecipeForm from "./RecipeForm";

import { useLoaderData } from "react-router";
import { Link } from "react-router-dom";
import Comments from "../components/other/Comments";
import useAuth from "../utils/useAuth";
import { ViewModeProvider } from "../contexts/ViewModeProvider";

export default function RecipePage() {
    const {auth} = useAuth();
    const [recipeLoaderData, commentsLoaderData] = useLoaderData() as any;
    const [recipe, setRecipe] = useState(recipeLoaderData);
    useEffect(() => {
        setRecipe({ ...recipeLoaderData });
    }, [recipeLoaderData])

    return (
        <ViewModeProvider>
            {auth?.user?.roles?.includes(8012) ? <RecipeForm recipe={recipe} /> : <RecipeContainer recipe={recipe} /> }
            {recipe.titleID && <Comments />}
            <Link to='/recipes'>Back to Recipes</Link>
        </ViewModeProvider>
    )
}




