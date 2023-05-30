import { useEffect, useState } from 'react'; 
import { Recipe } from '@/client/types'
import { NavLink } from 'react-router-dom';
import useAxiosPrivate from '@/client/utils/useAxiosPrivate';

let cached = false;
let cachedRecipes: Recipe [] = [];

export default function Recipes(){
    const [recipes, setRecipes] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);
    


    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        setIsLoading(true);
        const getRecipes = async (): Promise<Recipe []> => {
            try{
                const response = await axiosPrivate.get('/recipes', {
                    signal: controller.signal
                })
                return response.data;
            } catch (error) {  
                return [];
            }
        }
        if(!cached){
            getRecipes().then((response) => {
                setRecipes([...response]);
                setIsLoading(false);
                cached = true;
                cachedRecipes = [...response];
            });
        }
        else {
            setRecipes([...cachedRecipes]);
            setIsLoading(false);
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
                !isLoading 
                    
                ? 
                <ul className = "recipes-grid"> 
                    { recipes?.map((recipe:any)=> (
                        <li
                        key={recipe._id}
                        className="recipe-thumbnail"
                        >
                            <NavLink to={`/recipes/${recipe.titleID}`}>{recipe.title}</NavLink>
                        </li>
                    ))}
                </ul>
                : <div>Loading...</div>
                }
            </div>

        
       
    );
}