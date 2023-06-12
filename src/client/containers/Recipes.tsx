import { useEffect, useState } from 'react'; 
import { Recipe } from '@/client/types'
import { NavLink } from 'react-router-dom';
import axios from '@/client/api/axios';
import {BarLoader as Loader} from 'react-spinners'

let cached = false;
let cachedRecipes: Recipe [] = [];

export default function Recipes(){
    const [recipes, setRecipes] = useState<any>();
    const [loading, setLoading] = useState(true);
    




    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getRecipes = async (): Promise<Recipe []> => {
            try{
                const response = await axios.get('/recipes', {
                    signal: controller.signal
                })
                return response.data;
            } catch (error) {  
                return [];
            }
        }
        if(!cached){
            // setLoading(false);
            getRecipes().then((response) => {
                setRecipes([...response]);
                setLoading(false);
                cached = true;
                cachedRecipes = [...response];
            });
        }
        else {
            setRecipes([...cachedRecipes]);
            setLoading(false);
        }
        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []);


    return (
        <div>
                <h1>All Recipes</h1>
                {
                !loading 
                    
                ? 
                <ul className = "recipes-grid"> 
                    { recipes?.map((recipe:any)=> (
                        <li
                        key={recipe._id}
                        className="recipe-thumbnail"
                        >
                            <NavLink to={`/recipes/${recipe.titleId}`}>{recipe.title}</NavLink>
                        </li>
                    ))}
                </ul>
                :  <Loader></Loader>
                }
            </div>

        
       
    );
}