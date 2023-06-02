

export type Recipe = {
    _id: string;
    title: string;
    titleID: string;
    dateCreated: string;
    dateEdited: string;
    description: string;
    author: any;
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
    _id?: string;
    firstName: string;
    lastName: string;   
    email: string;
    password: string;  
    savedRecipes: any;
    comments: any
    likedComments: any;
}

export const EmptyProfile:Profile = {
    firstName: "",
    lastName: "",   
    email: "",
    password: "",  
    savedRecipes : [],   // an array of Recipe IDs 
    comments : [],       // an array of (Recipe ID, comment ID)'s 
    likedComments : [ ],   // an array of Objects of the form  {recipeID, commentID []}
    
}

export interface Author extends Profile {
    profilePictureURL: string;
    recipes: Recipe[];
}

export type CommentType= {
    _id: string;
    likes:number;
    username:string;
    profile?: Profile;
    username: string;
    likes: number;
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
    author: "",
    ingredients : [],
    directions: "",
    comments: []
}