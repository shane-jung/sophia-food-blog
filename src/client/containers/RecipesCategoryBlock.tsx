import RecipeThumbnail from "../components/Recipe/RecipeThumbnail";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "../api/axios";
import { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";

export function RecipesCategoryBlock({ tag }: { tag: any }) {
  const { data: fetchedRecipeIds } = useQuery(["recipes", tag.value], () =>
    fetchRecipes({ tag: tag.value!.replace("-", " ") })
  );

  return (
    <>
      <h2 className = "text-center mt-5 mb-3">
        {tag.heading}
      </h2>
      <Row className="text-center">
          {fetchedRecipeIds?.data?.slice(0, 8).map((recipeId: string, index: any) => (
            <RecipeThumbnail key={index} recipeId={recipeId} />
          ))} 
      </Row>
      
       <Button 
          variant="primary"
          href={`/category/${tag.value.replace(" ", "-")}`}
          className="text-capitalize text-center text-decoration-none fs-5 mx-auto d-block"
          style= {{width: "fit-content"}}

        >
          View all {tag.value} recipes
        </Button>
    </>
  );
}

async function fetchRecipes({ tag }: { tag: string }) {
  return await axios.get(`/recipes/tags/${tag}`);
}
