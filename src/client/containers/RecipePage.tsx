

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
import ImageUpload from "../components/Recipe/ImageUpload";
import { deepEqual } from "assert";



export default function RecipePage() {
    const {auth} = useAuth();
    const [recipe] = useLoaderData() as any;
    const userId = useSelector((state:any) => state.user._id, shallowEqual);
    const dispatch = useDispatch();
    const recipeLoader = useRecipeLoader();
    
    useMemo(()=> {
         dispatch(setRecipe(recipe))
         recipeLoader(recipe._id, userId).then(({comments, likedComments}) :any =>{
            dispatch(setComments((comments)));
        });
        console.log("CHANGING VIEW MODE");
        if(!recipe.titleId) dispatch(setViewMode("CREATE_RECIPE"));
        else dispatch(setViewMode("VIEW_RECIPE"));
    },[recipe]);

    useEffect(()=>{
        console.log("USER ID CHANGED: ", userId)
    }, [userId])
    return (
        <>
            {auth?.user?.roles?.includes(8012) ? <RecipeForm/> : <RecipeContainer /> }
            {recipe.titleId && <Comments />}
            <Link to='/recipes'>Back to Recipes</Link>
        </>
    )
}




