import { getUser } from "@/client/queries";
import { useQuery } from "react-query";
import { useLocation } from "react-router";
import RecipeThumbnail from "../Recipe/RecipeThumbnail";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";


export default function ProfilePage() {
  const location = useLocation();
  const userId = location.pathname.split("/")[2];
  const user = useQuery(["user", userId], () => getUser(userId)).data;
  return (
    <div>
      <h1>Welcome, {user.username}</h1>

      <h1>Your saved Recipes</h1>
      <Row>
        {user.savedRecipes.map((recipe: any, index:number) => {
          return <RecipeThumbnail key= {index} recipeId={recipe} />;
        })}
      </Row>
     
    </div>
  );
}
