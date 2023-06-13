

import { useEffect, useMemo, useState } from "react";
import { _viewMode } from "../enums";

import RecipeContainer from "./RecipeContainer";
import RecipeForm from "./RecipeForm";

import { useLoaderData } from "react-router";
import { Link } from "react-router-dom";
import Comments from "../components/other/Comments";
import useAuth from "../utils/useAuth";
import {useSelector, useDispatch, shallowEqual} from 'react-redux';

import {setComments, setRecipe} from '../slices/recipe'
import useRecipeLoader from "../utils/useRecipeLoader";
import { setViewMode } from "../slices/user";   


export default function RecipePage() {
    const {auth} = useAuth();
    const [recipe] = useLoaderData() as any;
    const dispatch = useDispatch();
    const recipeLoader = useRecipeLoader();
    const recipeId = useSelector((state:any) => state.recipe._id, (prev, next) => prev === next);


    useEffect(()=>{
        dispatch(setRecipe(recipe));
    },[]);

    useEffect(()=> {
         recipeLoader(recipe.comments, recipe.tags).then(({comments, tags}: {comments:any, tags:any}) => {
            dispatch(setRecipe({comments, tags}))
         });
        if(!recipe.titleId) dispatch(setViewMode("CREATE_RECIPE"));
        else dispatch(setViewMode("VIEW_RECIPE"));
        // console.log("RECIPE ID CHANGED: ", recipeId)
    },[recipeId]);

    // useEffect(()=>{
    //     console.log("USER ID CHANGED: ", userId)
    // }, [userId])
    return (
        <>
            {auth?.user?.roles?.includes(8012) ? <RecipeForm/> : <RecipeContainer /> }
            {recipe.titleId && <Comments />}
            <Link to='/recipes'>Back to Recipes</Link>
        </>
    )
}




