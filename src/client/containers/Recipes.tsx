import { useEffect, useState } from 'react'; 
import { Recipe } from '@/client/types'
import { NavLink } from 'react-router-dom';

export default function Recipes(){

    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        fetch('/api/recipes')
        .then(response => response.json())
        .then(data => setRecipes(data))
        .catch(error => console.log(error));
    }, []);

    {console.dir(recipes)}
    return (
        <div className = "main-container">
            <h1>All Recipes</h1>
            <ul> 
                { recipes.map(recipe=> (
                    <li
                    key={recipe._id}
                    className="recipe-card"
                    >
                        <NavLink to={`/recipes/${recipe.titleID}`}>{recipe.title}</NavLink>
                    </li>
                ))}
            </ul>
        </div>
       
    );
}