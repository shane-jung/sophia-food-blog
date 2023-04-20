import {Recipe } from '@/client/types';
import EditButton from '@/client/components/EditButton';
import React, { useState }  from 'react';

interface RecipeElementProps{
    children: React.ReactNode;
    isAuthorized: boolean;
}

export default function RecipeElement(props: RecipeElementProps){

    const [contentEditable, setContentEditable] = useState(false);
    const [className, setClassName] = useState("recipe-element");
    function editElement(child:React.ReactNode){
       setContentEditable(!contentEditable);
       setClassName("recipe-element-editing");
    }
    return(
        <div className= "recipe-element" contentEditable = {contentEditable}>
            { props.children }
            { props.isAuthorized && <EditButton contentEditable= {false} startEditing = {editElement} child = {props.children} />  }
        </div>
    )



}