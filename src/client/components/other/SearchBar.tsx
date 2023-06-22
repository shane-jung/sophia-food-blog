import axios, { axiosPrivate } from "@/client/api/axios";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";

import Dropdown from "react-bootstrap/Dropdown";
import {
  ButtonGroup,
  Col,
  Container,
  ListGroup,
  Nav,
  Row,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useMutation } from "react-query";
import { Recipe } from "@/client/types";
import useAxiosPrivate from "@/client/utils/useAxiosPrivate";
import { query } from "express";
import queryClient from "@/client/utils/queryClient";

let timer: NodeJS.Timeout | null = null;

export default function SearchBar({ type }: { type: string }) {
  const [query, setQuery] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [recipes, setResults] = useState([]);

  window.onclick = (event: any) => {
    if (!event.target.matches(".search-bar *")) {
      setSearchFocus(false);
    }
  };

  useEffect(() => {
    if (!query) return setResults([]);
    debounceSearch(query);
  }, [query]);

  function debounceSearch(query: string): void {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      searchDb(query).then((results) => {
        setResults(results);
      });
    }, 500);
  }

  async function searchDb(query: string) {
    try {
      const { data: results } = await axios.get(
        `/recipes/search?query=${query}`
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Form className="search-bar" onFocus={() => setSearchFocus(true)}>
        <Form.Control
          type="search"
          className="me-2"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a recipes..."
          value={query}
        />

        {/* {type == "link" ? ( */}
        {searchFocus && (
          <LinkedSearchResults
            recipes={recipes}
            setSearchFocus={setSearchFocus}
            setQuery={setQuery}
          />
        )}
      </Form>
      {/* // ) : (
        //   <SelectableSearchResults
        //     recipes={recipes}
        //     setSearchFocus={setSearchFocus}
        //     setQuery={setQuery}       />
        // )} */}
    </>
  );
}

function LinkedSearchResults({
  recipes,
  setSearchFocus,
  setQuery,
}: {
  recipes: any;
  setSearchFocus: Function;
  setQuery: Function;
}) {
  return (
    <ListGroup className="search-results">
      {recipes.map((recipe: any) => {
        {
          console.log("here");
        }
        return (
          <ListGroup.Item key={recipe.titleId} className="search-result">
            <Link
              to={`/recipes/${recipe.titleId}`}
              className="fs-6 text-decoration-none d-flex align-items-center"
              onClick={() => {
                setSearchFocus(false);
                setQuery("");
              }}
            >
              <img src={recipe.imageUrl} alt="" className=" mx-3" />
              {recipe.title}
            </Link>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}

// function SelectableSearchResults({
//   recipes,
//   setSearchFocus,
//   setQuery,
// }: {
//   recipes: any;
//   setSearchFocus: Function;
//   setQuery: Function;
// }) {
//   const axiosPrivate = useAxiosPrivate();
//   const recipeMutation = useMutation({

//       mutationFn: async ({recipeId, value}: {recipeId: string, value:number}) => await axiosPrivate.put(`/recipes/${recipeId}`, {featured: value}),
//       mutationKey: "updateFeaturedRecipes",
//       onSuccess: () => {
//         queryClient.invalidateQueries(["recipes", "featured"]);
//       }
//   })

//   return (
//     <Container
//       className="search-results mt-3"
//       style={{ position: "relative", height: "200px", overflowY: "scroll" }}
//     >
//       {recipes.map((recipe: Recipe, index: number) => {
//         return (
//           <Container key={recipe.titleId} className="search-result d-flex align-items-center justify-content-between">
//             <img src={recipe.imageUrl} alt="" className="mx-1" />
//             {recipe.title}
//             <Button variant ="link" onClick={() => recipeMutation.mutate({recipeId: recipe._id, value: new Date().getTime()})}>Select</Button>
//           </Container>
//         );
//       })}
//     </Container>
//   );
// }
