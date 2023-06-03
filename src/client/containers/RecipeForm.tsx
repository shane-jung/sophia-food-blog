
import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useLoaderData, useNavigate } from 'react-router';
import { EmptyRecipe, Recipe } from '../types';
import { sampleAuthor, sampleRecipe} from '@/server/seed';

import RecipeContainer  from './RecipeContainer';
import { EditableContext } from '../contexts/EditableContext';
import DeleteRecipe from '../components/DeleteRecipe';
import { _viewMode } from '../enums';
import useViewMode from '../utils/useViewMode';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import useAuth from '../utils/useAuth';

interface RecipeFormProps{
    recipe:Recipe
}

export default function RecipeForm({recipe}:RecipeFormProps){ 
    const { viewMode, setViewMode } = useViewMode();
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    useEffect( ()=> {   
        if(!recipe.titleId) setViewMode(_viewMode.CREATING);
        else setViewMode(_viewMode.VIEWING);
    }, []);

    const navigate = useNavigate();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if(!verifyInputs(data)) return;
        data.set('dateEdited', new Date().toISOString());
        let reqLink, redirect:string;
        if(viewMode == _viewMode.EDITING){  //In the case that the recipe already exists, we just want to update the recipe. 
            reqLink = `/recipes/${recipe.titleId}`;
            redirect = `/recipes/${recipe.titleId}`
        } else {         //In the case the recipe doesn't exist, we want to create the recipe.
            reqLink = '/recipes/create';
            data.set('dateCreated', new Date().toISOString());
            data.set('author', sampleAuthor.toString() );
            redirect = `/recipes/${data.get('titleId')}`
        }
        const result = await axiosPrivate.post(reqLink, data, {withCredentials: true});
        // console.log(result);
        navigate(redirect, {replace: true})
        setViewMode(_viewMode.VIEWING);
    }
    return (
        <>
            <form className="recipe-form" method='POST'  encType="multipart/form-data" onSubmit = {handleSubmit}>
                {auth?.user?.roles?.includes(8012) && (viewMode == _viewMode.VIEWING ? <EditButton/> : <SubmitButton/>)}
                <RecipeContainer recipe={recipe}/>
            </form>
            { viewMode != _viewMode.CREATING &&  <DeleteRecipe titleId = {recipe.titleId} /> }
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



function SubmitButton(){

    const {viewMode, setViewMode} = useViewMode();
    const [buttonText, setButtonText] = useState("");
    
    useEffect(()=>{ 
        if (viewMode == _viewMode.CREATING) setButtonText("Create Recipe");
        else setButtonText("Save");
    }, [viewMode]);


    return(
        <button className="edit-button simple-button" type= "submit">{buttonText}</button>

    )
}


function EditButton() {
    const {viewMode, setViewMode} = useViewMode();

    const toggleViewMode = (e:any) =>{
        e.preventDefault();
        setViewMode(viewMode == _viewMode.VIEWING ? _viewMode.EDITING : _viewMode.VIEWING);
    }

    return(
        <button className="edit-button simple-button" type= "button" onClick = {toggleViewMode}> Edit </button>
        
    )
}