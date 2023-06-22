import { useMutation, useQuery } from "react-query";
import axios from "../api/axios";
import TagEditor from "../components/other/TagEditor";

import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";

import { getAllRecipes, getAllTags } from "@/client/queries";
import { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import AsyncSelect from "react-select/async";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import Col from "react-bootstrap/esm/Col";
import { Spinner } from "react-bootstrap";

export default function AdminPage() {
  const { data: tags } = useQuery(["tags"], getAllTags);
  return (
    <Tabs defaultActiveKey="home" className="mb-3">
      <Tab eventKey="home" title="Home">
        <HomePageEditor />
      </Tab>
      <Tab eventKey="users" title="Users"></Tab>
      <Tab eventKey="recipes" title="Recipes"></Tab>
      <Tab eventKey="profile" title="Comments"></Tab>
      <Tab eventKey="contact" title="Tags">
        <TagEditor tags={tags} />
      </Tab>
    </Tabs>
  );
}

function HomePageEditor() {
  const { data: fetchedRecipes } = useQuery(["recipes", "featured"], () =>
    getAllRecipes({ sort: "featured" })
  );
  const [recipes, setRecipes] = useState(fetchedRecipes);

  return (
    <Container>
      <h2>Customize Home Page</h2>
      <ChooseRecipe recipes={recipes} />
    </Container>
  );
}


function ChooseRecipe({ recipes }: { recipes: any }) {
  const axiosPrivate = useAxiosPrivate();
  const recipesMutation = useMutation(
    async ({ recipeId, featured }: { recipeId: string; featured: number }) => {
      return await axiosPrivate.put(`/recipes/${recipeId}`, { featured });
    }
  );

  const [selectOptions, setSelectOptions] = useState(
    recipes.map((recipe: any) => ({ value: recipe._id, label: recipe.title }))
  );
  const [selected, setSelected] = useState(selectOptions.slice(0, 5));
  const [isEditing, setIsEditing] = useState(false);
  const { isLoading } = recipesMutation;

  function onValueChanged(val: any, index: number) {
    setSelected((prev: any) => {
      const newSelected = [...prev];
      newSelected[index] = val;
      return newSelected;
    });
  }

  function save() {
    Array.from({ length: 5 }, (_, index) => {
      recipesMutation.mutate({ recipeId: recipes[index]._id, featured: -1 });
    });
    selected.forEach((recipe: any, index: number) => {
      recipesMutation.mutate({ recipeId: recipe.value, featured: 5-index });
    });
  }

  function handleClick(){
    setIsEditing(!isEditing)
    if(isEditing) save();
  }

  return (
    <Container>
      <Container className="d-flex align-items-center gap-4 justify-content-between">
            <h3>Featured Recipes</h3>
            <Container className="m-0" style={{width:"fit-content"}}>
              {
                isLoading && <Spinner animation="border" variant="secondary" className="fs-5" />
              }
            <Button
                variant="secondary"
                onClick={handleClick}
                className="text-light"
              >
                {isEditing ? "Save" : "Edit"}
              </Button>
            </Container>
      </Container>
      
      <ListGroup className="featured-recipes my-3" as="ol" numbered>
        {isEditing ? (
          <>
            {Array.from({ length: 5 }, (_, index) => (
              <ListGroup.Item as = "li" className= "d-flex align-items-center gap-3" key={index}>
                <AsyncSelect
                  className="flex-grow-1"
                  loadOptions={(inputValue, callback) => {
                    callback(
                      selectOptions
                        .filter((x: any) =>
                          x.label
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        )
                        .slice(0, 10)
                    );
                  }}
                  defaultOptions={true}
                  onChange={(val) => onValueChanged(val, index)}
                  name="featured-recipes"
                  value={selected[index]}
                />
              </ListGroup.Item>
            ))}
          </>
        ) : (
          <>
            {selected.map((recipe: any, index: number) => (
              <ListGroup.Item key={index} className="py-3">{recipe.label}</ListGroup.Item>
            ))}
          </>
        )}
      </ListGroup>
    </Container>
  );
}
