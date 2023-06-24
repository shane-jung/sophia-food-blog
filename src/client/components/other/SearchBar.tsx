import axios from "@/client/api/axios";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";

import Dropdown from "react-bootstrap/Dropdown";
import { Col, Container, ListGroup, Row } from "react-bootstrap";


let timer:NodeJS.Timeout | null = null;


export default function SearchBar(){
    const [query, setQuery] = useState("");
    const [searchFocus, setSearchFocus] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [results, setResults] = useState([]); // [{title: "cauliflower tacos", id: 1}, {title: "cauliflower tacos", id: 1}
    // const regExp = /cauliflower tacos/

    window.onclick = (event:any)=> {
        if(!event.target.matches(".search-bar *")){
            setSearchFocus(false);
        } 
    }

    useEffect(()=>{
        if(!query) return setResults([]);
        debounceSearch(query);
    }, [query])

    function debounceSearch(query:string):void{
        console.log(timer);
        setSearchLoading(true); 

        if(timer) 
            clearTimeout(timer);


        timer = setTimeout(()=>{
            searchDb(query).then((results)=> { 
                setResults(results);
                console.log(results);
            })
        }, 500)
    }

    
    async function searchDb(query:string){
       
        try {
            const {data: results} = await axios.get(`/recipes/search?query=${query}`);
            console.log(query, results);
            return results;
        } catch (err) {
            console.log(err);
        } finally {
            setSearchLoading(false); 

        }
    }

    return (
        <Form className="d-flex search-bar" onFocus = {()=> setSearchFocus(true)} >
            <Form.Control 
                    type="search" 
                    className="me-2"
                    onChange={(e)=> setQuery(e.target.value)} 
                    placeholder = "Search for a recipes"
                    value={query}
            />
            <Button variant= "outline-light" onClick= {(event:any)=>event?.preventDefault()}>
                    {/* <FontAwesomeIcon icon= {faSearch} /> */} Search
            </Button>
            <ListGroup className= "search-results">

                    { searchFocus && results.map((recipe: any)=> {
                            return <ListGroup.Item key={recipe.titleId}className = "search-result" >  

                                                <Link 
                                                    to= {`/recipes/${recipe.titleId}`} 
                                                    className="fs-6 text-decoration-none d-flex align-items-center"
                                                    onClick = {()=> {setSearchFocus(false); setQuery("")}}
                                                >
                                                    <img src={recipe.imageUrl} alt="" className=" mx-3" />

                                                    {recipe.title}
                                                </Link>

                                        
                                        {/* <div dangerouslySetInnerHTML={{__html: recipe.description.slice(0, 200) + '...'}}></div> */}

                                    </ListGroup.Item>
                        })
                    }
            </ListGroup>
        </Form>
    )
}