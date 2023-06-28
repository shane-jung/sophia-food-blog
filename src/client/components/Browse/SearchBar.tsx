import axios from "@/client/api/axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

let timer: NodeJS.Timeout | null = null;

export default function SearchBar() {
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
          className="me-1"
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
              className="fs-6 text-decoration-none d-flex gap-2 align-items-center"
              onClick={() => {
                setSearchFocus(false);
                setQuery("");
              }}
            >
              <img src={recipe.imageUrl} alt=""  />
              {recipe.title}
            </Link>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}