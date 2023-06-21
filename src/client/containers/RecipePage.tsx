import RecipeContainer from "./RecipeContainer";
import RecipeForm from "./EditRecipeForm";

import useAuth from "../utils/useAuth";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import Comments from "../components/Recipe/Comments/Comments";
import RecipeToolbar from "../components/Recipe/Form/RecipeToolbar";

import "react-quill/dist/quill.snow.css";
import { useEffect } from "react";

export default function RecipePage() {
  const { auth } = useAuth();
  const recipe = useSelector((state: any) => state.recipe);
  const viewMode = useSelector((state:any) => state.user.viewMode)

  useEffect(() => { 
    document.title = recipe.title + " - Once Upon a Thyme";
  }, [recipe]);

  return (
    <>
      {auth?.user?.roles?.includes(8012) ? (
        <>
          <RecipeForm />
        </>
      ) : (
        <RecipeContainer />
      )}

      {viewMode=="VIEWING" && <Comments />}
    </>
  );
}
