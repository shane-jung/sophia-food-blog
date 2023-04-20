
import { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.snow.css';
import { useLoaderData } from 'react-router';
import { Recipe } from '../types';

import RichTextEditor from '@/client/components/other/RichTextEditor'



export default function RecipeForm(){
    const recipe: Recipe = useLoaderData() as Recipe;
    const updating = recipe != undefined;
    
    
    const directionsRef : any = useRef(null);
    const descriptionRef : any = useRef(null);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        data.set('dateEdited', new Date().toISOString());
        data.set('description', descriptionRef.current.value);
        data.set('directions', directionsRef.current.value);
        data.append('directions', document.getElementById('directions')?.innerHTML || '');
        
        console.log(data.get('dateEdited'));
        var reqLink, method; 
        if(updating){
            method = 'PUT';
            reqLink = `/api/recipes/${recipe.titleID}/edit`;
        }
        else {
            method = 'POST'
            reqLink = '/api/recipes/create';
            data.set('dateCreated', new Date().toISOString());
        }

        fetch(reqLink, {
            method: method,
            body: data, 
        }).then(() => {
            window.location.href = '/recipes/' + data.get('titleID');
        });
      }

    return (
        <form onSubmit= {handleSubmit} action='/api/recipes/create' method='POST'  encType="multipart/form-data">
            <input type='text' name='title' required placeholder= "New Recipe" defaultValue = {(updating && recipe.title) || ""} className="recipe-title" />
            <input type="text" name='titleID' placeholder="Title ID (A short Identifier for the recipe, used in the URL. Example: mac-and-cheese, or 'mashed-potato-paprikish)" readOnly = {updating} defaultValue = {(updating && recipe.titleID) || ""} required className = "recipe-title-id" />
            <label>Description</label>
            <RichTextEditor reference = {descriptionRef} />
            <label>Directions</label>
            <RichTextEditor reference={directionsRef}  />
            <button type='submit'>Submit</button>
        </form>
    );
}