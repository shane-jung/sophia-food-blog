import { AuthenticationContext } from "@/client/contexts/AuthenticationContext";
import { EditableContext } from "@/client/contexts/EditableContext";
import { useState } from "react";
import { useContext } from "react"
import RichTextRecipeComponent from "./RichTextRecipeComponent";
interface IngredientProps{
    ingredients: string[];
}

export default function Ingredients(props: IngredientProps){
    const isAuthenticated = useContext(AuthenticationContext)
    const isEditable = useContext(EditableContext);
    const [ingredientsList, setIngredientsList] = useState(props.ingredients || []);
    

    //const ingredient = <RichTextRecipeComponent className = "recipe-ingredient"></RichTextRecipeComponent>
    function addIngredient(){
        setIngredientsList([...ingredientsList, ""]);
    }
    return (
        <div>
            <h2>Ingredients</h2>
            <ul className = 'recipe-ingredients'>
                {
                    ingredientsList.map((ingredient, i) => {
                        // if(isAuthenticated) 
                            return <li key= {ingredient + `${i}`}>
                                        <RichTextRecipeComponent className ="recipe-ingredient" value = {ingredient} name = "Ingredient" />
                                    </li>
                                        // <input readOnly = {!isEditable} defaultValue = {ingredient} placeholder = {"New Ingredient"}></input></li>
                        // else return <li key = {ingredient} className = "recipe-ingredient"> {ingredient} </li>
                    })
                }
            </ul>
            {isAuthenticated && isEditable && <button type= "button" className="simple-button" onClick = {addIngredient}>Add Ingredient</button>}
        </div>
    );
}