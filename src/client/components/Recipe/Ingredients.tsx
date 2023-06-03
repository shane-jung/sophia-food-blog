import useAuth from "@/client/utils/useAuth"
import { useState } from "react";
import { useContext } from "react"
import RichTextRecipeComponent from "./RichTextRecipeComponent";
import ViewModeContext from "@/client/contexts/ViewModeProvider";
import useViewMode from "@/client/utils/useViewMode";
import { _viewMode } from "@/client/enums";
interface IngredientProps{
    ingredients: string[];
}

export default function Ingredients({ingredients}: IngredientProps){
    const {viewMode} = useViewMode();
    const [ingredientsList, setIngredientsList] = useState(ingredients || []);
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
                                        <RichTextRecipeComponent className ="recipe-ingredient" key={ `${i}` } value = {ingredient} name = "ingredients" />
                                    </li>
                    })
                }
            </ul>
            {(viewMode != _viewMode.VIEWING) && <button type= "button" className="simple-button" onClick = {addIngredient}>Add Ingredient</button>}
        </div>
    );
}