

import { useEffect, useState } from "react";
import { _viewMode } from "../enums";

import RecipeContainer from "./RecipeContainer";
import RecipeForm from "./RecipeForm";

import { useLoaderData } from "react-router";
import { Link } from "react-router-dom";
import Comments from "../components/other/Comments";
import useAuth from "../utils/useAuth";
import { ViewModeProvider } from "../contexts/ViewModeProvider";
import { setActiveRecipeId } from "../slices/recipe";
import { setLikedComments } from "../slices/user";
import {useSelector, useDispatch} from 'react-redux';

import {setComments} from '../slices/recipe'
import axios, { axiosPrivate } from '@/client/api/axios';
import { RootState } from "../slices/store";
import useRecipeLoader from "../utils/useRecipeLoader";



export default function RecipePage() {
    const {auth} = useAuth();
    const [recipe] = useLoaderData() as any;
    const userId = useSelector((state:any) => state.user._id);
    const recipeId = useSelector((state:any) => state.recipe.activeRecipeId);
    const dispatch = useDispatch();
    const recipeLoader = useRecipeLoader();
    // const activeRecipeId = useSelector((state: RootState) => state.recipe.activeRecipeId);

    useEffect(()=> {
         dispatch(setActiveRecipeId(recipe._id))
         recipeLoader(recipe._id, userId).then(({comments, likedComments}) :any =>{
            dispatch(setComments((comments)));
            // console.log("LIKED COMMENTS: ", likedComments);
            // dispatch(setLikedComments([... new Set(likedComments2)]));
        });
    },[]);
    // useEffect(()=>{
    //     console.log(likedComments)
    // }, [likedComments])

    return (
        <ViewModeProvider>
            <h1>{recipe._id}</h1>
            {auth?.user?.roles?.includes(8012) ? <RecipeForm recipe={recipe} /> : <RecipeContainer recipe={recipe} /> }
            {recipe.titleId && <Comments />}
            <Link to='/recipes'>Back to Recipes</Link>
        </ViewModeProvider>
    )
}




