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

  useEffect(() => { 
    document.title = recipe.title + " - Once Upon a Thyme";
  }, [recipe]);

  return (
    <>
      {auth?.user?.roles?.includes(8012) ? (
        <>
          <RecipeToolbar />
          <RecipeForm />
        </>
      ) : (
        <RecipeContainer />
      )}

      {recipe.titleId && <Comments />}
    </>
  );
}
