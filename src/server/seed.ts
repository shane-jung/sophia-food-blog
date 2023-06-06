import {Author, Recipe} from '@/client/types';



export const sampleRecipe : Recipe = {
    _id: '1',
    title: 'Sample Recipe', 
    description: 'This is a sample recipe',
    background: 'This is the recipe background',    
    ingredients: [ "5 apples", "2 tbsp honey", "1 alfie"],
    directions: 'This is a sample recipe',
    dateCreated: '2021-01-01',
    dateEdited: '2021-01-01',
    titleId: 'sample-recipe',
    comments: [ "69"],
    author: {
        profilePictureURL: "",
        _id: "69",
        recipes: [],
        firstName: "Sophia",
        lastName: "Manicor",
        email: "sophiamanicor@gmail.com",
        password: "password",
        savedRecipes: []
    }
}
 
export const sampleAuthor:Author = {
    profilePictureURL: "",
    _id: "69",  
    recipes: [sampleRecipe],
    firstName: "Sophia",
    lastName: "Manicor",
    email: "sophiamanicor@gmail.com",
    password: "password",
    savedRecipes: []
}