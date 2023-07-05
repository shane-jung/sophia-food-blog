import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useMutation, useQuery } from "react-query";
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
  const [body, setBody] = useState(recipe ? recipe.body : defaultRecipeBody);
console.log(viewMode);
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

    
    data.set(
      "ingredients",
      JSON.stringify(
        Array.from(event.currentTarget.ingredients)?.map((el: any) => el.value)
      )
    );
    if (data.get("ingredients") === "[]")
      data.set(
        "ingredients",
        JSON.stringify([event.currentTarget.ingredients.value])
      );

      data.set(
        "diets",
        JSON.stringify(
          Array.from(event.currentTarget.diets)?.map((el: any) => el.value)
        )
      );
      if (data.get("diets") === "[]")
        data.set(
          "diets",
          JSON.stringify([event.currentTarget.diets.value])
        );

    data.set(
      "meals",
      JSON.stringify(
        Array.from(event.currentTarget.meals)?.map((el: any) => el.value)
      )
    );
    if (data.get("meals") === "[]")
      data.set("meals", JSON.stringify([event.currentTarget.meals.value]));

    data.set(
      "cuisines",
      JSON.stringify(
        Array.from(event.currentTarget.cuisines)?.map((el: any) => el.value)
      )
    );
    if (data.get("cuisines") === "[]")
      data.set(
        "cuisines",
        JSON.stringify([event.currentTarget.cuisines.value])
      );

    body.forEach((el: any, index: number) =>
      data.append("body[]", JSON.stringify(el))
    );
    data.set("dateEdited", new Date().toISOString());
    data.set("dateCreated", new Date().toISOString());
    data.set(
      "prepTime",
      "PT" +
        event.currentTarget.prepTimeHours.value +
        "H" +
        event.currentTarget.prepTimeMinutes.value +
        "M"
    );
    data.set(
      "cookTime",
      "PT" +
        event.currentTarget.cookTimeHours.value +
        "H" +
        event.currentTarget.cookTimeMinutes.value +
        "M"
    );
    data.set(
      "totalTime",
      "PT" +
        event.currentTarget.totalTimeHours.value +
        "H" +
        event.currentTarget.totalTimeMinutes.value +
        "M"
    );
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
              defaultValue={0}
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

function DurationInput({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value: any;
}) {
  const [hours, setHours] = useState(value?.match(/(?<=PT)(.*?)(?=H)/));
  const [minutes, setMinutes] = useState(value?.match(/(?<=H)(.*?)(?=M)/));
  return (
    <Form.Group as={Col} sm={6} xl={6} className="mb-3  ">
      <Form.Label className="d-block text-center">{label}</Form.Label>
      <InputGroup>
        <Form.Control
          name={name + "Hours"}
          type="number"
          min={0}
          max={24}
          defaultValue={hours}
        />
        <InputGroup.Text>Hours</InputGroup.Text>
        <Form.Control
          name={name + "Minutes"}
          type="number"
          min={0}
          max={59}
          defaultValue={minutes}
        />
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
