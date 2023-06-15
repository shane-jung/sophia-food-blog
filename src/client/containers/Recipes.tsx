import { Suspense, useEffect, useState } from "react";
import { Recipe } from "@/client/types";
import { NavLink } from "react-router-dom";
import axios from "@/client/api/axios";
import { BarLoader as Loader } from "react-spinners";
import { useSelector } from "react-redux";
import Loading from "../components/other/Loading";
import { useQuery } from "react-query";

export default function Recipes() {
  const [recipes, setRecipes] = useState<any>();
  const { data } = useQuery(["recipes"], getAllRecipes);

  useEffect(() => {
    if (data) {
      setRecipes(data.data);
    }
  }, []);

  const [recipesFiltered, setRecipesFiltered] = useState<any>([]);

  useEffect(() => {
    setRecipesFiltered(recipes);
  }, [recipes]);

  return (
    <div>
      <h1>All Recipes</h1>
      <Suspense fallback={<Loading />}>
        <ul className="recipes-grid">
          {recipesFiltered?.map((recipe: any) => (
            <li key={recipe._id} className="recipe-thumbnail">
              <NavLink to={`/recipes/${recipe.titleId}`}>
                {recipe.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </Suspense>
    </div>
  );
}

async function getAllRecipes() {
  return await axios.get("/recipes");
}
