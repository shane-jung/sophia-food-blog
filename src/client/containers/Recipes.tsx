import { useEffect, useState } from 'react'; 
import { Recipe } from '@/client/types'

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
        <div>
            <ul> 
                { recipes.map(recipe=> (
                    <li
                    key={recipe._id}
                    className="recipe-card"
                    >
                        <a href={`/recipes/${recipe.titleID}`}>{recipe.title}</a>
                    </li>
                ))}
            </ul>
        </div>
       
    );
}