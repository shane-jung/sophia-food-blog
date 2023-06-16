import { Suspense, useEffect, useState } from "react";
import axios from "@/client/api/axios";
import Loading from "../components/other/Loading";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { RecipesCategoryBlock } from "./RecipesCategoryBlock";

export default function AllRecipes() {
  const { data: fetchedTags } = useQuery(["tags"], getAllTags);
  
  return (
    <div>
      <h1 className="recipe-category-header">All Recipes</h1>
      {/* <RecipeFiltersToolbar />  */}
      <div>
        {fetchedTags?.map((tag: any) => (
          <Link
            key={tag._id}
            to={`/category/${tag.value.replace(" ", "-")}`}
            className="category-link"
          >
            {tag.value}{" "}
          </Link>
        ))}
      </div>
      <Suspense fallback={<Loading />}>
        {fetchedTags?.map((tag: any) => (
          <RecipesCategoryBlock key={tag.value + " category"} tag={tag} />
        ))}
      </Suspense>
    </div>
  );
}

async function getAllTags() {
  const { data } = await axios.get("/tags");
  return data;
}




// function RecipeFiltersToolbar() {
//   const [category, setCategory] = useState("meal");

//   const mealTags = ["breakfast", "lunch", "dinner"];
//   const cuisineTags = ["italian", "greek", "chinese"];
//   return (
//     <div className="recipe-filters-toolbar">
//       <div className="tag-category">
//         <h3 className="header">Meal</h3>

//         {mealTags.map((tag: string) => (
//           <Checkbox key={tag} tagName={tag} />
//         ))}
//       </div>
//       <div className="tag-category">
//         <h1 className="header">Cuisine</h1>
//         {cuisineTags.map((tag: string) => (
//           <Checkbox key={tag} tagName={tag} />
//         ))}
//       </div>
//       <button>Filter</button>
//     </div>
//   );
// }

// function Checkbox({ tagName }: { tagName: string }) {
//   const [id, setId] = useState(tagName + "-tag-filter");
//   return (
//     <div className="tag-select">
//       <label htmlFor={id}>{tagName}</label>
//       <input id={id} type="checkbox" />
//     </div>
//   );
// }

