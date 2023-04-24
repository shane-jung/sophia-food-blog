

import { useEffect, useState} from "react";
import { AuthenticationContext } from "../contexts/AuthenticationContext";
import { _viewMode } from "../enums";

import  RecipeContainer from "./RecipeContainer";
import  RecipeForm from "./RecipeForm";

import { useLoaderData } from "react-router";
import { EmptyRecipe, Recipe } from "../types";
import { CommentType } from "../types";
import { Link } from "react-router-dom";
import Comments from "../components/other/Comments";

export default function RecipePage() {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [recipeLoaderData, commentsLoaderData] = useLoaderData() as any;
    const [recipe, setRecipe] = useState(recipeLoaderData);
    useEffect(()=>{
        setRecipe({...recipeLoaderData});
    }, [recipeLoaderData])
    // console.log(recipe);
    // const [text, setText] = useState("Preview User View")

    // function ToggleAuthentication(){
    //     function toggle(){
    //         setIsAuthenticated(!isAuthenticated);
    //         if(isAuthenticated) setText("Preview Admin View");
    //         else setText("Preview User View");
    //     }
    //     return (
    //         <button onClick = {toggle}>{text}</button>
    //     )
    // }
    const [viewMode, setViewMode] = useState(isAuthenticated)
    
    const inner = isAuthenticated ? <RecipeForm recipe={recipe} /> : <RecipeContainer recipe={recipe} viewMode = {_viewMode.VIEWING}/>
    return (  
        <> 
            {/* <ToggleAuthentication /> */}
            <AuthenticationContext.Provider value = {isAuthenticated}>
                <>
                    {inner}
                    { recipe.titleID && <Comments/> }
                    <Link to='/recipes'>Back to Recipes</Link>
                </>
            </AuthenticationContext.Provider>
        </>
    )
}



