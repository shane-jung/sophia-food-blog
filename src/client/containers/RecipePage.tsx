import RecipeContainer from "./RecipeContainer";
import RecipeForm from "./EditRecipeForm";

import useAuth from "../utils/useAuth";
import {useSelector, useDispatch, shallowEqual} from 'react-redux';

import Comments from "../components/other/Comments";
import RecipeToolbar from "../components/Recipe/RecipeToolbar";

import 'react-quill/dist/quill.snow.css';


export default function RecipePage() {
    
    const {auth} = useAuth();
    const recipe = useSelector((state:any) => state.recipe);

    return (
        <>
            {
                auth?.user?.roles?.includes(8012) 
                ? <> 
                    <RecipeToolbar/>  
                    <RecipeForm/>  
                  </>
                :  <RecipeContainer /> 
            } 
            
            {recipe.titleId && <Comments />}
        </>
    )
}

