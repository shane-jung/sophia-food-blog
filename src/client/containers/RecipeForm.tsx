
import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useLoaderData, useNavigate } from 'react-router';
import { EmptyRecipe, Recipe } from '../types';
import { sampleAuthor, sampleRecipe} from '@/server/seed';

import RecipeContainer  from './RecipeContainer';
import ActionButton from '../components/ActionButton';
import { EditableContext } from '../contexts/EditableContext';
import DeleteRecipe from '../components/DeleteRecipe';
import { _viewMode } from '../enums';
import useViewMode from '../utils/useViewMode';
import useAxiosPrivate from '../utils/useAxiosPrivate';

interface RecipeFormProps{
    recipe:Recipe
}

export default function RecipeForm({recipe}:RecipeFormProps){ 
    const { viewMode, setViewMode } = useViewMode();
    const axiosPrivate = useAxiosPrivate();

    const [buttonText, setButtonText] = useState("");
    useEffect( ()=> {
        console.log(JSON.stringify(recipe));
        if(!recipe.titleID || recipe.titleID === "") console.log("Recipe doesn't exist")
        setViewMode(_viewMode.CREATING);
        console.log(recipe.titleID); 
        console.log(viewMode);
        const buttonText = viewMode == _viewMode.CREATING ? "Save" : "Edit";
        console.log(buttonText);
        setButtonText(buttonText);
    }, []);

    const navigate = useNavigate();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if(!verifyInputs(data)) return;
        data.set('dateEdited', new Date().toISOString());
        let reqLink, redirect:string;
        if(viewMode == _viewMode.EDITING){  //In the case that the recipe already exists, we just want to update the recipe. 
            reqLink = `/recipes/${recipe.titleID}`;
            redirect = `/recipes/${recipe.titleID}`
        } else {         //In the case the recipe doesn't exist, we want to create the recipe.
            reqLink = '/recipes/create';
            data.set('dateCreated', new Date().toISOString());
            data.set('author', sampleAuthor.toString() );
            redirect = `/recipes/${data.get('titleID')}`
        }
        const result = await axiosPrivate.post(reqLink, data, {withCredentials: true});
        console.log(result);
        navigate(redirect, {replace: true})
    }

    

    function handleActionButtonClick(event:any){
        event.preventDefault();
        console.log("here");
        console.log("viewMode: " + viewMode)
        switch (viewMode) {
            case _viewMode.VIEWING:
                setButtonText("Save");
                setViewMode(_viewMode.EDITING);
                break;
            case _viewMode.EDITING:
                setButtonText("Edit");      
                setViewMode(_viewMode.VIEWING); 
                handleSubmit(event);
                break;  
            case _viewMode.CREATING:
                setButtonText("Save");
                setViewMode(_viewMode.EDITING);
                break;
        }
    }

    return (
        <>
            <form className="recipe-form"  onSubmit={handleSubmit} method='POST'  encType="multipart/form-data">
                <ActionButton onClick = {handleActionButtonClick} buttonText = {buttonText} /> 
                <RecipeContainer recipe={recipe}/>
            </form>
            { viewMode != _viewMode.CREATING &&  <DeleteRecipe titleID = {recipe.titleID} /> }
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

