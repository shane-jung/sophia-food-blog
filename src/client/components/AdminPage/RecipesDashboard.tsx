import { useGetAllRecipes } from "@/client/queries";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";

export default function RecipesDashboard() {
  const recipes = useGetAllRecipes();
  return (
    <Container>
      <h1>Recipes Dashboard</h1>
      <ListGroup>
        <ListGroup.Item as={Row} className="d-flex justify-content-between">
          <Col>Recipe Stats</Col>
          <Col>Rating</Col>
          <Col>Comments</Col>
          <Col>Saves</Col>
        </ListGroup.Item>
        {recipes?.map((recipe: any) => {
          return (
            <ListGroup.Item
              as={Row}
              key={recipe._id}
              className="d-flex justify-content-between"
            >
              <Col>
                <Link to={"/recipes/" + recipe.titleId}>{recipe.title}</Link>
              </Col>
              <Col>
                {recipe.averageRating?.toFixed(2) +
                  " (" +
                  recipe.ratings.length +
                  ")"}
              </Col>
              <Col>{recipe.comments?.length}</Col>
              <Col>{recipe.saves}</Col>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Container>
  );
}
