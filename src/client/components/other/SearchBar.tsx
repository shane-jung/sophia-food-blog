import axios from "@/client/api/axios";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Loading from "./Loading";


let timer:NodeJS.Timeout | null = null;


export default function SearchBar(){
    const [query, setQuery] = useState("");
    const [searchFocus, setSearchFocus] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [recipes, setResults] = useState([]); // [{title: "cauliflower tacos", id: 1}, {title: "cauliflower tacos", id: 1}
    // const regExp = /cauliflower tacos/

        window.onclick = (event:any)=> {
            if(!event.target.matches(".search-bar *") && searchFocus){
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
        <div className = "search-bar" onFocus = {()=> setSearchFocus(true)}
            >
            <div className = "search-bar-input">
                <input type="text" 
                    onChange={(e)=> setQuery(e.target.value)} 
                    style={ {"outline": "1px solid black"}}
                    placeholder = "Search for recipes"
                    
                />
                <button onClick= {(event:any)=>event?.preventDefault()}>
                    <FontAwesomeIcon icon= {faSearch} />
                </button>
            </div>
            

            <div className = { "search-results " +( searchFocus ? "focus" : "")} onFocus = {()=> setSearchFocus(true)} >
                {/* <button onClick = {(event:any)=> { event.preventDefault(); setSearchFocus(false)}}>Close results</button> */}
                { recipes?.length > 0 ?
                    recipes.map((recipe: any)=> {
                        return <div key={recipe.titleId} className = "search-result">    
                                    <img src={recipe.imageUrl} alt="" />
                                    <div>
                                        <Link to= {`/recipes/${recipe.titleId}`} >{recipe.title}</Link>
                                        <div dangerouslySetInnerHTML={{__html: recipe.description.slice(0, 200) + '...'}}></div>
                                    </div>
                                </div>
                    })
                    :  
                    <div className = "search-result">No results found</div>
                }
                    { searchLoading &&
                    <Loading /> }
            
            </div>
        </div>
    )
}