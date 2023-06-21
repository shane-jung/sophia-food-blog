import { Suspense, useEffect, useState } from "react";
import axios from "@/client/api/axios";
import Loading from "../components/other/Loading";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { RecipesCategoryBlock } from "./RecipesCategoryBlock";
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'

import { LinkContainer } from "react-router-bootstrap";
import { Nav } from "react-bootstrap";

export default function AllRecipes() {
  const { data: fetchedTags } = useQuery(["tags"], getAllTags);
  
  return (
    <Container>
      <h1 className="text-center">All Recipes</h1>
      {/* <RecipeFiltersToolbar />  */}
      <Col xs={10} className="mb-3 mx-auto text-center">

        {fetchedTags?.map((tag: any) => (
          <LinkContainer to = {`/category/${tag.value.replace(" ", "-")}`}>
            <Button
              key={tag._id}
              variant="secondary" 
              size="sm"
              className= "text-capitalize mx-1 my-1 text-light"
              value = {tag.value}
            >
              {tag.value}
            </Button>
          </LinkContainer>
        ))}
      </Col>
      <Suspense fallback={<Loading />}>
        {fetchedTags?.slice(0, 6).map((tag: any) => (
          <RecipesCategoryBlock key={tag.value + " category"} tag={tag} />
        ))}
      </Suspense>
    </Container>
  );
}

async function getAllTags() {
  const { data } = await axios.get("/tags");
  return data;
}
