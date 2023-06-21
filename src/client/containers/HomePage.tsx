import { Carousel } from "react-bootstrap";
import { useQuery } from "react-query";
import { NavLink } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../utils/useAuth";
import Image from 'react-bootstrap/Image'
import { RecipesCategoryBlock } from "./RecipesCategoryBlock";
import Container from 'react-bootstrap/Container'

export default function HomePage() {

  const { data : fetchedRecipes } = useQuery({
    queryKey: ["recipes", "homepage"],
    queryFn: () => fetchRecipes({homepage: true}),
  })
  console.log(fetchedRecipes);
 
  return (
    <Container>
      <Container className={"landing-block mb-3"}> 
        <h1 className="text-center">Welcome to Once Upon A Thyme....</h1>
        <h3 className="text-center"></h3>  
        <p>
          Once Upon a Thyme is my personal recipe collection. 
          I have been collecting recipes for years and I wanted to have a place to store them all. 
          I also wanted to be able to share them with my friends and family. I hope you enjoy them as much as I do!
        </p>
        <div className="text-center">
          <NavLink to="/recipes" className="btn btn-primary btn-lg mt-3">
            View Recipes
          </NavLink>
        </div>


      </Container>
      


      <Carousel>
        <Carousel.Item>
          <Image src = {fetchedRecipes[8]?.imageUrl} className="image-carousel" />

          <Carousel.Caption>
            <h3>{fetchedRecipes[8].title}</h3>
            <p>{fetchedRecipes[8].subtitle}</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image src = {fetchedRecipes[9]?.imageUrl} className="image-carousel" />

          <Carousel.Caption>
          <h3>{fetchedRecipes[9].title}</h3>
            <p>{fetchedRecipes[9].subtitle}</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image src = {fetchedRecipes[7]?.imageUrl} className="image-carousel" />

          <Carousel.Caption>
            <h3>{fetchedRecipes[7].title}</h3>
            <p>{fetchedRecipes[7].subtitle}</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image src = {fetchedRecipes[6]?.imageUrl} className="image-carousel" />

          <Carousel.Caption>
          <h3>{fetchedRecipes[6].title}</h3>
            <p>{fetchedRecipes[6].subtitle}</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <RecipesCategoryBlock tag={{value:"recent", _id: "64921eb1bd1b50d757f00170", label: "Recent", heading: "Recent Recipes"}}/>
    </Container>
  );
}


async function fetchRecipes({homepage} : {homepage: boolean}){
  const {data} = await axios.get(`/recipes`);
  return data;
}