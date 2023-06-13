
import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useLoaderData, useNavigate } from 'react-router';
import { EmptyRecipe, Recipe } from '../types';
import { sampleAuthor, sampleRecipe} from '@/server/seed';

import RecipeContainer  from './RecipeContainer';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import useAuth from '../utils/useAuth';
import { useDispatch } from 'react-redux';
import { setViewMode } from '../slices/user';
import { useSelector } from 'react-redux';
import RecipeToolbar from '../components/Recipe/RecipeToolbar';
import { setRecipe } from '../slices/recipe';


export default function RecipeForm(){ 

    const recipe = useSelector((state:any) => state.recipe);
    const viewMode = useSelector((state:any) => state.user.viewMode);
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // useEffect(() => {
    //     console.log(recipe.tags);
    // },[recipe.tags]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        if(!verifyInputs(data)) return;
        data.set('dateEdited', new Date().toISOString());
        data.set('tags', JSON.stringify(recipe.tags.map((tag:any) => tag._id)));
        if(viewMode == "EDITING"){  //In the case that the recipe already exists, we just want to update the recipe. 
            const reqLink = `/recipes/${recipe._id}`;
            // const redirect = `/recipes/${recipe.titleId}`
            const result = await axiosPrivate.put(reqLink, data, {withCredentials: true});
            // navigate(redirect, {replace: true})
            dispatch(setRecipe(Object.fromEntries(data)));
            //console.log(Object.fromEntries(data))
        } else {         //In the case the recipe doesn't exist, we want to create the recipe.
            const reqLink = '/recipes/create';
            data.set('dateCreated', new Date().toISOString());
            data.set('author', sampleAuthor.toString() );
            const redirect = `/recipes/${data.get('titleId')}`
            const result = await axiosPrivate.post(reqLink, data, {withCredentials: true});
            navigate(redirect, {replace: true})
        }
        dispatch(setViewMode("VIEW_RECIPE"));
    }
    return (
        <>
            <form className="recipe-form" method='POST' encType="multipart/form-data" onSubmit = {handleSubmit}>
                {auth?.user?.roles?.includes(8012) && <RecipeToolbar/>}
                <RecipeContainer />
            </form>
        </>
    );
}


function verifyInputs(data:FormData){
    for(const [field, value] of data){
        if(!value) {
            console.log(`Error: ${field} field cannot be empty.`)
            return false;
        }
    }
    return true;
}