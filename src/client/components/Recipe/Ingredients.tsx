export default function Ingredients(props: {recipe: Recipe}){
    var ingredientsList = props.recipe.ingredients.map((ingredient) => {
        return <li> {ingredient.quantity + " " + ingredient.name} </li>
    });
    return (
        <div>
            <h2>Ingredients</h2>
            <ul>
                {props.recipe.ingredients.map(ingredient => (
                    <li key={ingredient}>{ingredient}</li>
                ))}
            </ul>
        </div>
    );
}