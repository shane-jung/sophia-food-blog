import useAuth from "@/client/utils/useAuth"

import { EditableContext } from "@/client/contexts/EditableContext";
import { useState } from "react";
import { useContext } from "react"
import RichTextRecipeComponent from "./RichTextRecipeComponent";
interface IngredientProps{
    ingredients: string[];
}

export default function Ingredients(props: IngredientProps){
    const { auth } = useAuth()
    const isEditable = useContext(EditableContext);
    const [ingredientsList, setIngredientsList] = useState(props.ingredients || []);
    

    function addIngredient(){
        setIngredientsList([...ingredientsList, ""]);
    }
    return (
        <div>
            <h2>Ingredients</h2>
            <ul className = 'recipe-ingredients'>
                {
                    ingredientsList.map((ingredient, i) => {
                            return <li key= {ingredient + `${i}`}>
                                        <RichTextRecipeComponent className ="recipe-ingredient" key={ `${i}` } value = {ingredient} name = "Ingredient" />
                                    </li>
                    })
                }
            </ul>
            {auth?.accessToken && isEditable && <button type= "button" className="simple-button" onClick = {addIngredient}>Add Ingredient</button>}
        </div>
    );
}