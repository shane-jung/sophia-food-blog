import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setRecipe } from "../slices/recipe";
import { setViewMode } from "../slices/user";
import CreateRecipeForm from "./CreateRecipeForm";

export default function CreateRecipePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setViewMode("creating-recipe"));
    dispatch(setRecipe({ type: "clear-recipe" }));
  }, []);

  return <CreateRecipeForm />;
}
