import { useEffect, useState } from 'react'; 
import { Recipe } from '@/client/types'
import { NavLink } from 'react-router-dom';
import useAxiosPrivate from '@/client/utils/useAxiosPrivate';

export default function Recipes(){

    const [recipes, setRecipes] = useState<Recipe[]>([]);

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        // fetch('/api/recipes')
        // .then(response => response.json())
        // .then(data => setRecipes(data))
        // .catch(error => console.log(error));
        let isMounted = true;
        const controller = new AbortController();
        const getRecipes = async () => {
            try{
                const response = await axiosPrivate.get('/recipes', {
                    signal: controller.signal
                })
                console.log(response.data);
                setRecipes(response.data);
            } catch (error) {  

            }
        }

        getRecipes();
        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []);

    return (
        <div>
            <h1>All Recipes</h1>
            <ul className = "recipes-grid"> 
                { recipes.map(recipe=> (
                    <li
                    key={recipe._id}
                    className="recipe-thumbnail"
                    >
                        <NavLink to={`/recipes/${recipe.titleID}`}>{recipe.title}</NavLink>
                    </li>
                ))}
            </ul>
        </div>
       
    );
}