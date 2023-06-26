import { useEffect } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import { setViewMode } from "../slices/user";
import axios from "../api/axios";

import RecipeToolbar from "../components/Recipe/Form/RecipeToolbar";
import Comments from "../components/Recipe/Comments/Comments";
import BookmarkRecipe from "../components/Recipe/BookmarkRecipe";
import AuthorSnippet from "../components/Recipe/AuthorSnippet";
import RichTextComponent from "../components/Recipe/Form/RichTextComponent";
import { StaticRatingBar } from "../components/Recipe/RatingBar";
import ImageUpload from "../components/Recipe/ImageUpload";
import Tags from "../components/Recipe/Tags";
import SimpleTextComponent from "../components/Recipe/Form/SimpleTextComponent";

import Container from "react-bootstrap/Container";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";

import { Recipe } from "../types";
import useAuth from "../utils/useAuth";
import { setRecipe } from "../slices/recipe";

export default function RecipeContainer() {
  const {auth} = useAuth();
  const location = useLocation();
  const titleId = location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const recipe: Recipe = useQuery(["recipe", titleId], () =>
    loadRecipe(titleId)
  ).data;
  const activeRecipeId = useSelector((state: any) => state.recipe.activeRecipeId);


  useEffect(() => {
    document.title = recipe.title + " - Once Upon a Thyme";
    dispatch(setViewMode("viewing-recipe"));
    dispatch(setRecipe({activeRecipeId: recipe._id}))
  }, [recipe]);

  return (
    <Container>
      { auth?.user?.roles?.includes(8012) && <RecipeToolbar />} 
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/recipes" }}>
          Recipes
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{recipe.title}</Breadcrumb.Item>
      </Breadcrumb>
      <Row className="align-items-end justify-content-around my-4 position-relative">
        <Col xs={8}>
          <SimpleTextComponent name="title" value={recipe.title} />
          <SimpleTextComponent name="subtitle" value={recipe.subtitle} />
          <AuthorSnippet author={recipe.author} />
        </Col>
        <Col xs={3} className="d-flex flex-column justify-content-center ">
          {/* <StaticRatingBar /> */}

          <Link className="btn btn-secondary mx-1 mt-1" to="#comments">
            {recipe.comments?.length || 0} comments
          </Link>
          <Link className="btn btn-secondary m-1 mt-1" to="#recipe">
            Jump to Recipe
          </Link>
        </Col>
        <BookmarkRecipe recipeId={recipe._id} />
      </Row>
      <ImageUpload imageUrl={recipe.imageUrl as string} index={-1} />
      <Container>
        <Row>
          <Col>
            <Tags tagIds={recipe.cuisines} category={"Cuisine"} />
          </Col>
          <Col>
            <Tags tagIds={recipe.meals} category={"Meal"} />
          </Col>
          <Col>
            <Tags tagIds={recipe.ingredients} category={"Ingredients"} />
          </Col>
        </Row>
      </Container>
      <RecipeBody body={recipe.body} />
      <Comments/>
    </Container>
  );
}

function RecipeBody({ body }: any) {
  return (
    <Container id="recipe">
      {body?.map((section: any, index: number) => {
        switch (section.type) {
          case "simple":
            return (
              <SimpleTextComponent
                key={index}
                value={section.value}
                name={section.name}
              />
            );
          case "rich":
            return (
              <RichTextComponent
                key={index}
                value={section.value}
                name={section.name}
              />
            );
          case "image":
            return (
              <ImageUpload key={index} imageUrl={section.value} index={index} />
            );
          case "double-image":
            return (
              <div className="double-image" key={index}>
                <Image src={section.value} />
                <Image src={section.value} />
              </div>
            );
        }
      })}
    </Container>
  );
}

async function loadRecipe(titleId: string) {
  const { data } = await axios.get(`/recipes/titleId/${titleId}`);
  return data;
}
