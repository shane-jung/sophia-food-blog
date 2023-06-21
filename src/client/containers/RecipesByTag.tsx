import { useEffect, useState } from "react";
import { Breadcrumb, Container, Row } from "react-bootstrap";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
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
    <Container>

      <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/recipes" }}>Recipes</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/category" }}>Categories</Breadcrumb.Item>
        <Breadcrumb.Item active>
          {fetchedTag?.data.label}
        </Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="text-center">
        <span>{fetchedTag?.data?.heading}</span>
      </h1>
      <p>{tag?.description}</p>
      <Row sm={4}>
        {recipeIds?.map((recipeId: string) => (
          <RecipeThumbnail key={recipeId} recipeId={recipeId} />
        ))}
      </Row>
    </Container>
  );
}

async function fetchRecipes({ tag }: { tag: string }) {
  return await axios.get(`/recipes/tags/${tag}`);
}
