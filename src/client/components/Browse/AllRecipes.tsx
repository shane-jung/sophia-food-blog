import { Suspense, useEffect, useState } from "react";
import axios from "@/client/api/axios";
import Loading from "../other/Loading";
import { useQuery, useQueryClient } from "react-query";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import RecipeThumbnail from "./RecipeThumbnail";

export default function AllRecipes() {
  const tags = useQuery(["tags"], getAllTags).data;
  const [filters, setFilters] = useState<any>({});
  const recipes = useQuery(["recipes", filters], () => {
    return getRecipes({ filters });
  }).data;

  useEffect(() => {
    document.title = "All Recipes | Once Upon A Time";
  }, []);

  const [tagsSorted, setTagsSorted] = useState(
    tags.reduce((acc: any, tag: any) => {
      if (!acc[tag.category]) {
        acc[tag.category] = [];
      }
      acc[tag.category].push(tag);
      return acc;
    }, {})
  );

  return (
    <Container>
      <Row>
        <Col xs={3}>
          <Form className="mt-3">
            <h4>Filters</h4>
            <Button onClick = {()=>setFilters({})}>Clear Filters</Button>
            {Object.keys(tagsSorted).map((category: string, index: number) => (
              <RecipeFilters
                key={index}
                category={category}
                tags={tagsSorted[category]}
                setFilters={setFilters}
              />
            ))}
          </Form>
        </Col>
        <Col>
          <h1 className="text-center">All Recipes</h1>
          <Suspense fallback={<Loading />}>
            <Row>
              {recipes.map((recipe: any, index: number) => (
                <Col  key={index}  xs={12} sm={6} lg={4} xl={3}>
                  <RecipeThumbnail recipeId={recipe._id} />
                </Col>
              ))}
            </Row>
          </Suspense>
        </Col>
      </Row>
    </Container>
  );
}

function RecipeFilters({
  category,
  tags,
  setFilters,
}: {
  category: string;
  tags: any;
  setFilters: any;
}) {
  const [length, setLength] = useState(Math.min(5, tags.length));
  return (
    <Form.Group>
      <Form.Label className="text-capitalize">{category}</Form.Label>
      {tags
        .map((tag: any) => (
          <Form.Check
            key={tag._id}
            value={tag._id}
            label={tag.value}
            className="text-capitalize"
            onChange={(e: any) => {
              setFilters((filters: any) => {
                if (e.target.checked) {
                  return {
                    ...filters,
                    [category]: [
                      ...(filters?.[category] || []),
                      e.target.value,
                    ],
                  };
                } else {
                  return {
                    ...filters,
                    [category]: filters?.[category]?.filter(
                      (filter: any) => filter !== e.target.value
                    ),
                  };
                }
              });
            }}
          />
        ))
        .slice(0, length)}
      {length < tags.length ? (
        <Button
          variant="link"
          onClick={() => setLength(Math.min(length + 5, tags.length))}
        >
          Show More ({tags.length - length})
        </Button>
      ) : (
        length > 5 && (
          <Button variant="link" onClick={() => setLength(5)}>
            Show Less
          </Button>
        )
      )}
    </Form.Group>
  );
}

async function getAllTags() {
  const { data } = await axios.get("/tags");
  return data;
}

async function getRecipes({ filters }: any) {
  console.log("FILTERS IN GET RECIPES", filters);
  const { data } = await axios.get(
    `/recipes/?filters=${JSON.stringify(filters)}`
  );
  return data;
}
