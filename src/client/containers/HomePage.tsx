
import { useQuery } from "react-query";
import { NavLink } from "react-router-dom";
import { getAllRecipes } from "../queries";
import useAuth from "../utils/useAuth";

import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Carousel from "react-bootstrap/Carousel";

import { RecipesCategoryBlock } from "./RecipesCategoryBlock";
import { HomepageToolbar } from "../components/Recipe/Form/RecipeToolbar";
import SearchBar from "../components/other/SearchBar";
export default function HomePage() {
  const {auth } = useAuth();

  const { data: fetchedRecipes } = useQuery({
    queryKey: ["recipes", "featured"],
    queryFn: () => getAllRecipes({ sort: "featured" }), 
  });

  return (
    <Container>
      {auth?.user?.roles?.includes(8012) && <HomepageToolbar />}
      <Container className={"landing-block mb-3"}>
        <h1 className="text-center">Welcome to Once Upon A Thyme....</h1>
        <h3 className="text-center"></h3>
        <p>
          Once Upon a Thyme is my personal recipe collection. I have been
          collecting recipes for years and I wanted to have a place to store
          them all. I also wanted to be able to share them with my friends and
          family. I hope you enjoy them as much as I do!
        </p>
        <div className="text-center">
          <NavLink to="/recipes" className="btn btn-primary btn-lg mt-3">
            View Recipes
          </NavLink>
        </div>
      </Container>

      <Carousel>
        {fetchedRecipes.slice(0, 5).map((recipe: any, index: number) => {
          return (
            <Carousel.Item key={recipe._id}>
              <Image src={recipe?.imageUrl} className="image-carousel" />

              <Carousel.Caption>
                <h3>{recipe.title}</h3>
                <p>{recipe.subtitle}</p>
              </Carousel.Caption>
            </Carousel.Item>
          );
        })}
      </Carousel>

      <Container className="bg-secondary text-light py-5 px-4 my-5" >
        <h2 className="text-center pb-3">Looking for something in particular?</h2>
        <SearchBar />
      </Container>

      <RecipesCategoryBlock
        tag={{
          value: "recent",
          _id: "64921eb1bd1b50d757f00170",
          label: "Recent",
          heading: "Recent Recipes",
        }}
      />

      
    </Container>
  );
}
