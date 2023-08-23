import axios from "@/client/api/axios";
import { Recipe } from "@/client/types";
import { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import { useQuery } from "react-query";

import { Link } from "react-router-dom";

export default function RecipeThumbnail({ recipeId }: { recipeId: string }) {
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);

  const { data: fetchedRecipe } = useQuery({
    queryKey: ["recipe", "shortened", recipeId],
    queryFn: () => fetchRecipe({ recipeId }),
  });

  useEffect(() => {
    setRecipe(fetchedRecipe?.data);
  }, [fetchedRecipe]);

  return (
    <Container className="recipe-thumbnail">
      <Link
        to={`/recipes/${recipe?.titleId}`}
        className="text-decoration-none text-center"
      >
        <Image src={recipe?.imageUrl} alt="" />
        <div className="text-center">{recipe?.title}</div>
      </Link>
    </Container>
  );
}

async function fetchRecipe({ recipeId }: { recipeId: string }) {
  return await axios.get(`/recipes/${recipeId}?shortened=true`);
}
