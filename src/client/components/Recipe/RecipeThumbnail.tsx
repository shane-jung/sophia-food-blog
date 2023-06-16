import axios from "@/client/api/axios";
import { Recipe } from "@/client/types";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

export default function RecipeThumbnail({recipeId} : {recipeId: string}) {
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);

  const {data: fetchedRecipe} = useQuery({  
    queryKey: ["recipe", "shortened", recipeId], 
    queryFn: () => fetchRecipe({recipeId}),
  })

  useEffect(()=>{
    setRecipe(fetchedRecipe?.data)
  }, [fetchedRecipe])

  return (
    <li className="recipe-thumbnail"> 
     
      <Link to={`/recipes/${recipe?.titleId}`}>
          <img src={recipe?.imageUrl} alt="" />
          {recipe?.title}
      </Link>
    </li>
  );
}


async function fetchRecipe({recipeId} : {recipeId: string}){
  return await axios.get(`/recipes/${recipeId}?shortened=true`);
}