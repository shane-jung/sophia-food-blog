import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";

import axios from "../../api/axios";

import RecipeThumbnail from "./RecipeThumbnail";

import Breadcrumb from "react-bootstrap/Breadcrumb";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/recipes" }}>
          Recipes
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/category" }}>
          Categories
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{fetchedTag?.data.label}</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="text-center">
        <span>{fetchedTag?.data?.heading}</span>
      </h1>
      <p>{tag?.description}</p>
      <Row sm={4}>
        {recipeIds?.map((recipeId: string, index: number) => (
          <Col xs={12} sm={6} lg={4} xl={3}>
            <RecipeThumbnail key={index} recipeId={recipeId} />;
          </Col>
        ))}
      </Row>
    </Container>
  );
}

async function fetchRecipes({ tag }: { tag: string }) {
  return await axios.get(`/recipes/tags/${tag}`);
}
