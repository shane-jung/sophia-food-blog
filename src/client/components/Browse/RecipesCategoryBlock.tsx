import { useQuery } from "react-query";
import axios from "@/client/api/axios";

import RecipeThumbnail from "@/client/components/Browse/RecipeThumbnail";

import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

export function RecipesCategoryBlock({ tag }: { tag: any }) {
  const { data: fetchedRecipeIds } = useQuery(["recipes", tag.value], () =>
    fetchRecipes({ tag: tag.value!.replace("-", " ") })
  );

  return (
    <>
      <h2 className="text-center mt-5 mb-3">{tag.heading}</h2>
      <Row className="text-center">
        {fetchedRecipeIds?.data
          ?.slice(0, 8)
          .map((recipeId: string, index: any) => (
            <Col key={index} xs={12} sm={6} lg={4} xl={3}>
              <RecipeThumbnail  recipeId={recipeId} />;
            </Col>
          ))}
      </Row>

      <Button
        variant="primary"
        href={`/category/${tag.value.replace(" ", "-")}`}
        className="text-capitalize text-center text-decoration-none fs-5 mx-auto d-block"
        style={{ width: "fit-content" }}
      >
        View all {tag.value} recipes
      </Button>
    </>
  );
}

async function fetchRecipes({ tag }: { tag: string }) {
  return await axios.get(`/recipes/tags/${tag}`);
}
