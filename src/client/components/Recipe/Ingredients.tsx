import { Ingredient } from '@/client/types';

interface IngredientProps{
    ingredients: Ingredient[];
}

export default function Ingredients(props: IngredientProps){
    var ingredientsList = props.ingredients.map((ingredient) => {
        return <li> {ingredient.quantity + " " + ingredient.name} </li>
    });

    return (
        <div>
            <h2>Ingredients</h2>
            <ul>
               { ingredientsList } 
            </ul>
        </div>
    );
}