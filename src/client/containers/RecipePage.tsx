

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
import {useSelector, useDispatch} from 'react-redux';

import {setComments} from '../slices/recipe'
import axios from '@/client/api/axios';

export default function RecipePage() {
    const {auth} = useAuth();
    const [recipeLoaderData] = useLoaderData() as any;
    const [recipe, setRecipe]  = useState(recipeLoaderData);
    const [commentIds, setCommentIds] = useState<any>(recipe.comments);



    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setActiveRecipeId(recipe._id))
        function retrieveComments(){
            return Promise.all(commentIds?.map(async (id: string)=>{
                try{
                    const result = await axios.get(`/comments/${id}`);
                    const comment = result.data;
                    const replies = await Promise.all(comment.replies.map(async (id:string)=>{
                        const result = await axios.get(`/comments/${id}`);
                        return result.data;
                    }));

                    return {comment, replies};
                } catch (err) {

                }
            }));
        }
        retrieveComments().then(r=>dispatch(setComments(r)));
    },[]);


    return (
        <ViewModeProvider>
            {auth?.user?.roles?.includes(8012) ? <RecipeForm recipe={recipe} /> : <RecipeContainer recipe={recipe} /> }
            {recipe.titleId && <Comments />}
            <Link to='/recipes'>Back to Recipes</Link>
        </ViewModeProvider>
    )
}




