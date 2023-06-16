import { useEffect } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "../api/axios";
import { setRecipe } from "../slices/recipe";
import { setViewMode } from "../slices/user";
import RecipePage from "./RecipePage";

export default function ViewRecipePage() {
  const location = useLocation();
  const titleId = location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const { data: fetchedRecipe } = useQuery(["recipe", titleId], () => loadRecipe(titleId));

  useEffect(() => {
    dispatch(setViewMode("viewing-recipe"));
    dispatch(setRecipe({ type: "set-recipe", recipe: { ...fetchedRecipe.recipe } }));
  }, [fetchedRecipe]);

  return <RecipePage />;
}

async function loadRecipe(titleId: string) {
  const { data } = await axios.get(`/recipes/titleId/${titleId}`);
  return data;
}
