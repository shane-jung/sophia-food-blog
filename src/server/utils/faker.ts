import { Recipe, Ingredient } from 'src/client/types';
import connectToDatabase from '../database/mongodb'
// import createUniqueIndex from './createUniqueIndex';

async function insertFakeRecipes(numRecipes: number): Promise<void> {
  const db = await connectToDatabase();
  const recipesCollection = db.collection<Recipe>('Recipes');

  for (let i = 0; i < numRecipes; i++) {
    const title = "test recipe " + (i+1);
    const ingredients = generateFakeIngredients(Math.round(Math.random() * 10) + 1);
    const directions = [ " These ", " are ", " fake ", " directions "];
    const titleId = "test-recipe-" + (i+1);
    const fakeRecipe = {
      title,
      titleId, 
      ingredients,
      directions,
    };
    console.dir(fakeRecipe);
    await recipesCollection.insertOne(fakeRecipe);
  }
    return;
//   console.log(`Inserted ${numRecipes} fake recipes`);
}

function generateFakeIngredients(numIngredients: number): Ingredient [] {
    const ingredients: Ingredient[] = [];
    
    for (let i = 0; i < numIngredients; i++) {
        const name = 'ingredient ' + (i + 1);
        const quantity = Math.round(Math.random() * 5) + 1;
        ingredients.push({ name, quantity });
    }
    
    return ingredients;
}


export default insertFakeRecipes;
