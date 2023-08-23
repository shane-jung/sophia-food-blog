import { getUser } from "@/client/queries";
import { useQuery } from "react-query";
import { useLocation } from "react-router";
import RecipeThumbnail from "../Browse/RecipeThumbnail";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function ProfilePage() {
  const location = useLocation();
  const userId = location.pathname.split("/")[2];
  const user = useQuery(["user", userId], () => getUser(userId)).data;
  return (
    <Container>
      <h1 className="mb-4">Welcome, {user.username}!</h1>

      <h4 className="mb-2">Saved Recipes</h4>
      <Row>
        {user.savedRecipes.map((recipe: any, index: number) => {
          return (
            <Col key={index} xs={12} sm={6} lg={4} xl={3}>
              <RecipeThumbnail recipeId={recipe} />;
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
