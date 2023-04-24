import { sampleAuthor } from "@/server/seed";

export type Recipe = {
    _id: string;
    title: string;
    titleID: string;
    dateCreated: string;
    dateEdited: string;
    description: string;
    author: Author;
    background : string;
    ingredients : string[];
    // ingredients : Ingredient[];
    directions: string;
    imageURLs?: string[];
    comments: string[];
    tags? : string [];
    ingredientTags? : string[];
    prepTime? : string;
    cookTime? : string; 
    ratings? : Rating [];
    notes? : string [];

}

export type Ingredient = {
    _id?: string;
    name: string;
    quantity: number;
}


export type Profile = {
    _id: string;
    firstName: string;
    lastName: string;   
    email: string;
    password: string;  
    savedRecipes: Recipe[];
   

}

export interface Author extends Profile {
    profilePictureURL: string;
    recipes: Recipe[];
}

export type CommentType= {
    _id: string;
    profile?: Profile;
    content: string;
    date: string;
    replies?: CommentType[];
    rating?: Rating;
}

export type Rating = {
    _id: string;
    profile?: Profile;
    rating: number;
    date: string;

}

export const EmptyRecipe:Recipe = {
    _id: "",
    title: "",
    titleID: "",
    dateCreated: "",
    dateEdited: "",
    description: "",
    background : "",
    author: sampleAuthor,
    ingredients : [],
    directions: "",
    comments: []
}