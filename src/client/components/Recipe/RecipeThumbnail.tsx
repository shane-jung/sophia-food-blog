import axios from "@/client/api/axios";
import { Recipe } from "@/client/types";
import { useEffect, useState } from "react";
import { Col, Container, Image } from "react-bootstrap";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

export default function RecipeThumbnail({recipeId} : {recipeId: string}) {
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);

  const {data: fetchedRecipe} = useQuery({  
    queryKey: ["recipe", "shortened", recipeId], 
    queryFn: () => fetchRecipe({recipeId}),
  })

  useEffect(()=>{
    setRecipe(fetchedRecipe?.data)
  }, [fetchedRecipe])

  return (
    <Col xs={12} sm ={6} lg = {4} xl = {3}>
    <Container className="recipe-thumbnail"> 
      <Link 
        to={`/recipes/${recipe?.titleId}`}
        className= "text-decoration-none text-center"
      >
          <Image src={recipe?.imageUrl} alt=""  thumbnail/>
          {recipe?.title}
      </Link>
    </Container>
    </Col>
  );
}


async function fetchRecipe({recipeId} : {recipeId: string}){
  return await axios.get(`/recipes/${recipeId}?shortened=true`);
}