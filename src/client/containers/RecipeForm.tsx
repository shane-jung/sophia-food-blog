import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import RecipeToolbar, {
  CreateRecipeToolbar,
} from "../components/Recipe/Form/RecipeToolbar";
import SimpleTextInput from "../components/Recipe/Form/SimpleTextInput";
import ImageUpload from "../components/Recipe/ImageUpload";
import RecipeBodyElement from "../components/Recipe/Form/RecipeBodyElement";
import { setViewMode } from "../slices/user";
import queryClient from "../utils/queryClient";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import * as uuid from "uuid";
import Select from "@/client/components/Recipe/Form/Select";

import Dropdown from "react-bootstrap/Dropdown";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import TitleId from "../components/Recipe/Form/TitleID";
import Form from "react-bootstrap/Form";
import { Col, InputGroup, Row } from "react-bootstrap";

const defaultRecipeBody = [
  {
    _id: uuid.v4(),
    type: "rich",
    name: "Background",
    value: "",
  },
  {
    _id: uuid.v4(),
    type: "rich",
    name: "Ingredients",
    value: "",
  },
  {
    _id: uuid.v4(),
    type: "rich",
    name: "Directions",
    value: "",
  },
  {
    _id: uuid.v4(),
    type: "rich",
    name: "Notes",
    value: "",
  },
];

export default function RecipeForm({ recipe }: { recipe?: any }) {
  const viewMode = useSelector((state: any) => state.user.viewMode);
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedTags, setSelectedTags] = useState(recipe ? recipe.tags : []);
  const [body, setBody] = useState(recipe ? recipe.body : defaultRecipeBody);
  const recipeMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (viewMode == "CREATING")
        return await axiosPrivate.post("/recipes", payload, {
          withCredentials: true,
        });
      else
        return await axiosPrivate.put(`/recipes/${recipe._id}`, payload, {
          withCredentials: true,
        });
    },
    onSuccess: (response) => {
      dispatch(setViewMode("viewing-recipe"));

      tagsMutation.mutate({
        recipeId: response.data.value._id,
        tagIds: selectedTags,
      });

      queryClient.setQueryData(
        ["recipe", response.data.value.titleId],
        (oldData: any) => {
          return response.data.value;
        }
      );
      queryClient.setQueryData(
        ["recipe", response.data.value._id],
        (oldData: any) => {
          return response.data.value;
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["recipes"],
        exact: true,
      });
      navigate(`/recipes/${response.data.value.titleId}`, { replace: true });
    },
  });

  const tagsMutation = useMutation({
    mutationFn: async (payload: any) =>
      await axiosPrivate.post("/tags/addRecipeToTags", payload, {
        withCredentials: true,
      }),
    onSuccess: (response) => {
      console.log(response);
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    body.forEach((el: any, index: number) =>
      data.append("body[]", JSON.stringify(el))
    );

    selectedTags.forEach((tag: any) => data.append("tags[]", tag));
    data.set("dateEdited", new Date().toISOString());
    data.set("dateCreated", new Date().toISOString());
    if(imageUrl) data.set("imageUrl", imageUrl);
    recipeMutation.mutate(data);
  };

  function addSection(index: number, type: string) {
    const newBody = [...body];
    newBody.splice(index + 1, 0, {
      _id: uuid.v4(),
      type: type,
      value: "",
      name: "New Section",
    });
    setBody(newBody);
  }
  return (
    <form
      className="container"
      method="POST"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      id="recipe-form"
    >
      <CreateRecipeToolbar />
      <SimpleTextInput name="title" label="Title" value= {recipe?.title}/>
      <SimpleTextInput name="subtitle" label="Subtitle" value = {recipe?.subtitle}/>
      <SimpleTextInput name="titleId" label="titleID" value = {recipe?.titleId} />

      <Select selected = {recipe?.tags} setSelected = {setSelectedTags} category = {"meals"} />
      <Select selected = {recipe?.tags} setSelected = {setSelectedTags} category = {"cuisines"} />

      <Select selected = {recipe?.tags} setSelected = {setSelectedTags} category = {"ingredients"} />


      <TitleId value={recipe?.titleId} />

      <ImageUpload imageUrl={recipe?.imageUrl} index={-1} />

      <Form.Group as={Row}>
        <DurationInput
          name="prepTime"
          label="Prep Time"
          value={recipe?.prepTime}
        />
        <DurationInput
          name="cookTime"
          label="Cook Time"
          value={recipe?.cookTime}
        />
        <DurationInput
          name="totalTime"
          label="Total Time"
          value={recipe?.totalTime}
        />

        <Form.Group as={Col} sm={6} xl={6} className="mb-3">
          <Form.Label className="d-block text-center">Yield</Form.Label>
          <InputGroup>
            <Form.Control type="number" min={0} max={100} />
            <Form.Control type="text" defaultValue="Servings" />
          </InputGroup>
        </Form.Group>
      </Form.Group>

      <Select selected={recipe?.cuisines} setSelected={setSelectedTags} category="cuisines" />

      <Select selected={recipe?.meals} setSelected={setSelectedTags} category = "meals" />

      <Select selected={recipe?.diets} setSelected={setSelectedTags} category = "ingredients"/>

      <Form.Label>Recipe Body</Form.Label>
      {body?.map((element: any, index: number) => (
        <div key={element._id} className="position-relative">
          <RecipeBodyElement
            element={element}
            index={index}
            setBody={setBody}
          />

          <OverlayTrigger overlay={<Tooltip>Delete Section</Tooltip>}>
            <Button
              className="position-absolute"
              style={{ top: ".5rem", right: ".5rem" }}
              variant="danger"
              onClick={() => {
                const newBody = [...body];
                newBody.splice(index, 1);
                setBody(newBody);
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </OverlayTrigger>

          <AddToBody index={index} setBody={setBody} addSection={addSection} />
        </div>
      ))}
    </form>
  );
}

function DurationInput({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value: any;
}) {
  return (
    <Form.Group as={Col} sm={6} xl={6} className="mb-3  ">
      <Form.Label className="d-block text-center">{label}</Form.Label>
      <InputGroup>
        <Form.Control type="number" name="duration" min={0} max={24} />
        <InputGroup.Text>Hours</InputGroup.Text>
        <Form.Control type="number" name="duration" min={0} max={59} />
        <InputGroup.Text>Minutes</InputGroup.Text>
      </InputGroup>
    </Form.Group>
  );
}

function AddToBody({
  index,
  setBody,
  addSection,
}: {
  index: number;
  setBody: any;
  addSection: any;
}) {
  return (
    <>
      <Dropdown as={"span"} className="my-2 recipe-body-dropdown">
        <Dropdown.Toggle variant="primary">
          <FontAwesomeIcon icon={faPlus} />
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ width: "min-content" }}>
          <Dropdown.Header>Add Section</Dropdown.Header>
          <Dropdown.Item onClick={() => addSection(index, "rich")}>
            Text
          </Dropdown.Item>
          <Dropdown.Item onClick={() => addSection(index, "image")}>
            Image
          </Dropdown.Item>
          <Dropdown.Item onClick={() => addSection(index, "double-image")}>
            Double Image
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
