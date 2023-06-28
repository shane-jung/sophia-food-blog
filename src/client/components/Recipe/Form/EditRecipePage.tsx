import axios from "../../../api/axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setViewMode } from "../../../slices/user";
import RecipeForm from "./RecipeForm";

export default function EditRecipePage() {
    const dispatch = useDispatch();
    const location = useLocation();
    const titleId = location.pathname.split("/")[2];
    const recipe = useQuery(['recipe', titleId], () => loadRecipe(titleId)).data;
    
    useEffect(() => {
      dispatch(setViewMode("editing-recipe"));
      window.scrollTo(0, 0);
    }, []);

    return ( 
        <>
            <h1 className="mb-3">Edit Recipe</h1>
            <RecipeForm recipe = {recipe} />

        </>
    )
  }
  


  async function loadRecipe(titleId: string) {
    const { data } = await axios.get(`/recipes/titleId/${titleId}`);
    console.log("IN LOAD RECIPE", data)
    return data;
  }