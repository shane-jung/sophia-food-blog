import { Recipe, EmptyRecipe } from "@/client/types";
import AuthorSnippet from "../components/Recipe/AuthorSnippet";
import SimpleTextRecipeComponent from "../components/Recipe/Form/SimpleTextRecipeComponent";
import RichTextRecipeComponent from "../components/Recipe/Form/RichTextRecipeComponent";
import { _viewMode } from "../enums";
import TitleId from "../components/Recipe/Form/TitleID";
import RatingBar, { StaticRatingBar } from "../components/Recipe/RatingBar";
import DateComponent from "../components/Recipe/DateComponent";
import { useSelector } from "react-redux";
import ImageUpload from "../components/Recipe/ImageUpload";
import Tags from "../components/Recipe/Tags";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container"
import { Breadcrumb, Col, Row } from "react-bootstrap";

export default function RecipeContainer() {
  const viewMode = useSelector((state: any) => state.user.viewMode);
  const recipe = useSelector((state: any) => state.recipe);
  return (

    <Container>
      <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/recipes" }}>
          Recipes
        </Breadcrumb.Item>
      <Breadcrumb.Item active>{recipe.title}</Breadcrumb.Item>
      </Breadcrumb>
      <Row className = "align-items-center justify-content-around my-4">
        <Col xs= {8}>
          <SimpleTextRecipeComponent name="title" initialValue={recipe.title} />
          <SimpleTextRecipeComponent
            name="subtitle"
            initialValue={recipe.subtitle}
          />
          { viewMode == "VIEWING" && <AuthorSnippet author={recipe.author} /> } 
        </Col>
        <Col xs={3}>
          { viewMode == "VIEWING" &&  <StaticRatingBar /> }
        </Col>
      </Row>
      <ImageUpload />
      
      <Tags />

      
       { viewMode == "VIEWING"  &&
        <>

              <Link className="btn btn-primary mx-1" to="#comments" >
              {recipe.comments?.length || 0} comments
              </Link>
              <Link className="btn btn-primary mx-1" to="#recipe">
                Jump to Recipe
              </Link>
        </>}
      
        

      {viewMode == "CREATING" && <TitleId value={recipe.titleId} />}
      <RichTextRecipeComponent
        name="background"
        className="recipe-background"
        initialValue={recipe.background}
      />
      <div id="recipe" className="container-sm\">
        <div className="header">
          <SimpleTextRecipeComponent
            name="cardTitle"
            initialValue={recipe.cardTitle}
          />
          {viewMode == "VIEWING" && (
            <DateComponent
              dateCreated={recipe.dateCreated}
              dateEdited={recipe.dateEdited}
            />
          )}
        </div>

        <RichTextRecipeComponent
          name="description"
          className="recipe-description"
          initialValue={recipe.description}
        />
        <RichTextRecipeComponent
          name="ingredients"
          className="recipe-ingredients"
          initialValue={recipe.ingredients}
        />
        <RichTextRecipeComponent
          name="directions"
          className="recipe-directions"
          initialValue={recipe.directions}
        />
      </div>
    </Container>
  );
}
