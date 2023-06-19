import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import RecipeThumbnail from "../components/Recipe/RecipeThumbnail";

export default function RecipesByTag() {
  const [tag, setTag] = useState<any>();
  var { tag: tagValue } = useParams();
  const { data: fetchedTag } = useQuery({
    queryKey: ["tags", tagValue],
    queryFn: async () =>
      await axios.get(`/tags/${tagValue!.replace("-", " ")}`),
  });
  const [recipeIds, setRecipeIds] = useState<any>(fetchedTag?.data?.recipes);

  useEffect(() => {
    setTag(fetchedTag?.data);
    setRecipeIds(fetchedTag?.data?.recipes);
  }, [fetchedTag]);

  return (
    <div>
      <h1 className="recipe-category-header">
        <span className="tag-value">{fetchedTag?.data?.heading}</span>
      </h1>
      <p>{tag?.description}</p>
      <ul className="recipes-grid">
        {recipeIds?.map((recipeId: string) => (
          <RecipeThumbnail key={recipeId} recipeId={recipeId} />
        ))}
      </ul>
    </div>
  );
}

async function fetchRecipes({ tag }: { tag: string }) {
  return await axios.get(`/recipes/tags/${tag}`);
}
