import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import Tags from "./Tags";

import { Recipe } from "@/client/types";
export default function RecipeSidebar({ recipe }: { recipe: Recipe }) {
  const ingredients = recipe.body.find(
    (component) => component.name === "Ingredients"
  )?.value;

  return (
    <Container
      className="border border-2 position-sticky px-4 pt-4 bg-light m-3"
      style={{ top: "5.25em", marginTop: "-2em" }}
    >
      <h4>Recipe Details</h4>
      <div className="me-2">
        <div>
          <strong>Prep time: </strong>
          <DurationFormatted duration={recipe.prepTime!} />
        </div>
        <div>
          <strong>Cook time: </strong>
          <DurationFormatted duration={recipe.cookTime!} />
        </div>
        <div>
          <strong>Total time:</strong>
          <DurationFormatted duration={recipe.totalTime!} />
        </div>
        <div>
          <strong>Serves: </strong>
          {recipe.servings}
        </div>
      </div>

      <Tags tagIds={recipe.cuisines} category={"Cuisine"} />

      <Tags tagIds={recipe.meals} category={"Meal"} />
      <Row>
        <h5>Ingredients</h5>
        <div dangerouslySetInnerHTML={{ __html: ingredients }}></div>
      </Row>
    </Container>
  );
}

function DurationFormatted({ duration }: { duration: string }) {
  return (
    <span>
      {duration.split("PT").map((time, index) => (
        <span key={index}>
          {time.replace("H", " hours, ").replace("M", " minutes")}
        </span>
      ))}
    </span>
  );
}
