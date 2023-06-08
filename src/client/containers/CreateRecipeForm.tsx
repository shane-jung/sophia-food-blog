import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setRecipe } from "../slices/recipe";
import { setViewMode } from "../slices/user";
import RecipePage from "./RecipePage";


export default function CreateRecipeForm(){
    const dispatch = useDispatch();
    
    useEffect(() => {
        console.log("CREATING RECIPE");
        console.log("CHANGING VIEW MODE");
        dispatch(setViewMode("CREATE_RECIPE"))
        dispatch(setRecipe({}))
    }, []);

    return( 
        <RecipePage />
    )

}