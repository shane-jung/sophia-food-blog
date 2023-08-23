import { useState } from "react";
import { useMutation } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { setViewMode } from "@/client/slices/user";
import queryClient from "@/client/utils/queryClient";
import useAxiosPrivate from "@/client/utils/useAxiosPrivate";
import * as uuid from "uuid";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

import { CreateRecipeToolbar } from "./RecipeToolbar";
import Select from "./Select";
import TitleId from "./TitleID";
import SimpleTextInput from "./SimpleTextInput";
import ImageUpload from "./ImageUpload";
import RecipeBodyElement from "./RecipeBodyElement";
import AddToBody from "./AddToBody";
import DurationInput from "./DurationInput";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

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
  const imageUrl = useSelector((state: any) => state.recipe.imageUrl);
  const viewMode = useSelector((state: any) => state.user.viewMode);
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [body, setBody] = useState(recipe ? recipe.body : defaultRecipeBody);
  const recipeMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (viewMode == "CREATING")
        return await axiosPrivate.post("/recipes", payload, {
          withCredentials: true,
        });
      else if (viewMode == "EDITING")
        return await axiosPrivate.put(`/recipes/${recipe._id}`, payload, {
          withCredentials: true,
        });
    },
    onSuccess: (response) => {
      dispatch(setViewMode("viewing-recipe"));
      if (!response) return;
      tagsMutation.mutate({
        recipeId: response.data.value?._id,
        tagIds: [
          ...response.data.value.cuisines,
          ...response.data.value.ingredients,
          ...response.data.value.meals,
          ...response.data.value.diets,
        ],
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

    ["ingredients", "cuisines", "diets", "meals"].forEach((el) =>
      data.set(
        el,
        JSON.stringify(
          Array.from(event.currentTarget[el])?.map((el: any) => el.value)
        )
      )
    );

    body.forEach((el: any, index: number) =>
      data.append("body[]", JSON.stringify(el))
    );
    data.set("dateEdited", new Date().toISOString());
    data.set("dateCreated", new Date().toISOString());
    ["prepTime", "cookTime", "totalTime"].forEach((el) =>
      data.set(
        el,
        "PT" +
          event.currentTarget[`${el}Hours`].value +
          "H" +
          event.currentTarget[`${el}Minutes`].value +
          "M"
      )
    );

    data.set("imageUrl", imageUrl);
    data.set(
      "servings",
      event.currentTarget.servingsQty.value +
        " " +
        event.currentTarget.servingsUnit.value
    );
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
      <SimpleTextInput name="title" label="Title" value={recipe?.title} />
      <SimpleTextInput
        name="subtitle"
        label="Subtitle"
        value={recipe?.subtitle}
      />

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
            <Form.Control
              name="servingsQty"
              type="number"
              min={0}
              max={100}
              defaultValue={
                recipe?.servings ? recipe.servings.split(" ")[0] : 0
              }
            />
            <Form.Control
              name="servingsUnit"
              type="text"
              defaultValue="Servings"
            />
          </InputGroup>
        </Form.Group>
      </Form.Group>

      <Select selectedIds={recipe?.cuisines} category="cuisines" />

      <Select selectedIds={recipe?.meals} category="meals" />

      <Select selectedIds={recipe?.ingredients} category="ingredients" />

      <Select selectedIds={recipe?.diets} category="diets" />

      <Form.Label>Recipe Body</Form.Label>

      <AddToBody index={-1} setBody={setBody} addSection={addSection} />

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
