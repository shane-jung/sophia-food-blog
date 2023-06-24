import AuthorSnippet from "../components/Recipe/AuthorSnippet";
import RichTextComponent from "../components/Recipe/Form/RichTextComponent";
import { _viewMode } from "../enums";
import { StaticRatingBar } from "../components/Recipe/RatingBar";
import { useDispatch, useSelector } from "react-redux";
import ImageUpload from "../components/Recipe/ImageUpload";
import Tags from "../components/Recipe/Tags";
import { Link, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container"
import { Breadcrumb, Col, Row } from "react-bootstrap";
import SimpleTextComponent from "../components/Recipe/Form/SimpleTextComponent";
import useAuth from "../utils/useAuth";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { setViewMode } from "../slices/user";
import { setRecipe } from "../slices/recipe";
import axios from "../api/axios";
import RecipeToolbar from "../components/Recipe/Form/RecipeToolbar";



export default function RecipeContainer() {

  const { auth } = useAuth();


  const location = useLocation();
  const titleId = location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const recipe = useQuery(["recipe", titleId], () => loadRecipe(titleId)).data;
  console.log(recipe);
  useEffect(() => {
    dispatch(setViewMode("viewing-recipe"));
    // dispatch(setRecipe({ type: "set-recipe", recipe: { ...recipe.recipe } }));
  }, [recipe]);

  useEffect(() => { 
    document.title = recipe.title + " - Once Upon a Thyme";
  }, [recipe]);


  return (

    <Container>
      <RecipeToolbar />
      <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/recipes" }}>
          Recipes
        </Breadcrumb.Item>
      <Breadcrumb.Item active>{recipe.title}</Breadcrumb.Item>
      </Breadcrumb>
      <Row className = "align-items-center justify-content-around my-4">
        <Col xs= {8}>
          <SimpleTextComponent name="title" value={recipe.title} />
          <SimpleTextComponent
            name="subtitle"
            value={recipe.subtitle}
          />
         <AuthorSnippet author={recipe.author} />
        </Col>
        <Col xs={3}>
          <StaticRatingBar />
        </Col>
      </Row>
      <ImageUpload />
      <Container>
        <Tags />
        <Link className="btn btn-primary mx-1 text-light" to="#comments" >
        {recipe.comments?.length || 0} comments
        </Link>
        <Link className="btn btn-primary mx-1 text-light" to="#recipe">
          Jump to Recipe
        </Link>
      </Container>
      <RecipeBody body = {recipe.body}/> 
    </Container>
  );
}


function RecipeBody({body}: any){

  return (
    body?.map((section: any, index:number) => {
      switch (section.type) {
        case "simple":
          return <SimpleTextComponent key={index} value={section.value} name={section.name} />;
        case "rich":
          return <RichTextComponent key= {index} value={section.value} name={section.name} />;
        case "image":
          return <ImageUpload key={index} />;
        case "double-image":
          return (
            <div className="double-image" key={index}>
              <ImageUpload />
              <ImageUpload />
            </div>
          )

      }
    })
        
  )
}




async function loadRecipe(titleId: string) {
  const { data } = await axios.get(`/recipes/titleId/${titleId}`);
  return data;
}