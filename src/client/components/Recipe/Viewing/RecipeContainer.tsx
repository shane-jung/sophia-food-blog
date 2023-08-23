import { useEffect } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import { setViewMode } from "@/client/slices/user";
import axios from "@/client/api/axios";

import RecipeBody from "./RecipeBody";
import RecipeToolbar from "../Form/RecipeToolbar";
import Comments from "./Comments/Comments";
import BookmarkRecipe from "./BookmarkRecipe";
import AuthorSnippet from "./AuthorSnippet";
import { StaticRatingBar } from "./RatingBar";
import ImageUpload from "../Form/ImageUpload";
import Tags from "./Tags";
import SimpleTextComponent from "./SimpleTextComponent";
import RecipeSidebar from "./RecipeSidebar";

import Container from "react-bootstrap/Container";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { Recipe } from "@/client/types";
import useAuth from "@/client/utils/useAuth";
import { setRecipe } from "@/client/slices/recipe";
import Author from "./Author";
import MoreRecipes from "./MoreRecipes";

export default function RecipeContainer() {
  const { auth } = useAuth();
  const location = useLocation();
  const titleId = location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const recipe: Recipe = useQuery(["recipe", titleId], () =>
    loadRecipe(titleId)
  ).data;

  useEffect(() => {
    document.title = recipe.title + " - Once Upon a Thyme";
    window.scrollTo(0, 0);
    dispatch(setViewMode("viewing-recipe"));
    dispatch(setRecipe({ activeRecipeId: recipe._id }));
  }, [recipe]);

  return (
    <Container className="border-right border-2">
      {auth?.user?.roles?.includes(8012) && <RecipeToolbar />}
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/recipes" }}>
          Recipes
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{recipe.title}</Breadcrumb.Item>
      </Breadcrumb>
      <Row className="h-100 ">
        <Col className="py-2 px-3 position-relative">
          <BookmarkRecipe recipeId={recipe._id} />

          <Row className="align-items-end justify-content-around my-4 position-relative">
            <Col xs={8}>
              <SimpleTextComponent name="title" value={recipe.title} />
              <SimpleTextComponent name="subtitle" value={recipe.subtitle} />
              <AuthorSnippet author={recipe.author} />
            </Col>
            <Col xs={3} className="d-flex flex-column justify-content-center ">
              <StaticRatingBar
                averageRating={recipe.averageRating}
                ratings={recipe.ratings}
              />

              <Link className="btn btn-secondary mx-1 mt-1" to="#comments">
                {recipe.comments?.length || 0} comments
              </Link>
              <Link className="btn btn-secondary m-1 mt-1" to="#recipe">
                Jump to Recipe
              </Link>
            </Col>
          </Row>

          <ImageUpload imageUrl={recipe.imageUrl as string} index={-1} />
        </Col>
        <Col xs={3} className="position-relative">
          <Author />
        </Col>
      </Row>
      <Row>
        <Col>
          <RecipeBody body={recipe.body} />
        </Col>
        <Col xs={3} className="position-relative">
          <RecipeSidebar recipe={recipe} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Comments />
        </Col>
        <Col xs={3} className="position-relative">
          <MoreRecipes recipe={recipe} />
        </Col>
      </Row>
    </Container>
  );
}

async function loadRecipe(titleId: string) {
  const { data } = await axios.get(`/recipes/titleId/${titleId}`);
  return data;
}
