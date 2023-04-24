
import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useLoaderData } from 'react-router';
import { EmptyRecipe, Recipe } from '../types';
import { sampleAuthor, sampleRecipe} from '@/server/seed';

import RecipeContainer  from './RecipeContainer';
import ActionButton from '../components/ActionButton';
import { EditableContext } from '../contexts/EditableContext';
import DeleteRecipe from '../components/DeleteRecipe';
import { _viewMode } from '../enums';

interface RecipeFormProps{
    recipe:Recipe
}

export default function RecipeForm({recipe}:RecipeFormProps){ 

    const [isEditable, setIsEditable] = useState(false);

    let viewMode: _viewMode = recipe.titleID ?  _viewMode.EDITING :_viewMode.CREATING


    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if(buttonType!="submit") return;
        const data = new FormData(event.currentTarget);
        if(!verifyInputs(data)) return;
        data.set('dateEdited', new Date().toISOString());
        let reqLink, method, redirect;
        if(viewMode == _viewMode.EDITING){  //In the case that the recipe already exists, we just want to update the recipe. 
            method = 'POST';
            reqLink = `/api/recipes/${recipe.titleID}`;
        }
        else{         //In the case the recipe doesn't exist, we want to create the recipe.
            method = 'POST'
            reqLink = '/api/recipes/create';
            data.set('dateCreated', new Date().toISOString());
            data.set('author', sampleAuthor.toString() );
            // data.set('comments', new Array());
            redirect = `/recipes/${data.get('titleID')}`
        }
        fetch(reqLink, {
            method: method,
            body: data, 
        })
    }

    const [buttonText, setButtonText] = useState("Edit");
    const [buttonType, setButtonType]= useState("button" as "button" | "submit");
    if(viewMode == _viewMode.CREATING && buttonText != "Submit"){
        setButtonText("Submit")
        setButtonType("submit");
    }
    function handleActionButtonClick(event:any){
        switch (viewMode) {
            case _viewMode.VIEWING: 
                break
            case _viewMode.CREATING:
                
            case _viewMode.EDITING:
                if(isEditable){
                    console.log("Update Existing Recipe")
                    setButtonText("Edit");
                    setButtonType("submit");
                } else {
                    setButtonText("Save");
                    setButtonType("button");
                }
                setIsEditable(!isEditable);
        }
    }

    return (
        <>
            <form className="recipe-form"  onSubmit={handleSubmit} method='POST'  encType="multipart/form-data">
                <ActionButton onClick = {handleActionButtonClick} buttonText = {buttonText} buttonType = {buttonType} /> 
                <EditableContext.Provider value = {isEditable || (viewMode ==_viewMode.CREATING)}>
                    <RecipeContainer recipe={recipe} viewMode = {viewMode}/>
                </EditableContext.Provider>
            </form>
            <DeleteRecipe titleID = {recipe.titleID} />
        </>
    );
}


function verifyInputs(data:FormData){
    for(const [field, value] of data){
        if(value =="") console.log(`Error: ${field} field cannot be empty.`)
    }
    return true;
}

