

export type Recipe = {
    _id: string;
    title: string;
    titleId: string;
    dateCreated: string;
    dateEdited: string;
    description: string;
    author: any;
    background : string;
    ingredients : string;
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
    savedRecipes : [],   // an array of Recipe Ids 
    comments : [],       // an array of (Recipe Id, comment Id)'s 
    likedComments : [ ],   // an array of Objects of the form  {recipeId, commentId []}
    
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
    titleId: "",
    dateCreated: "",
    dateEdited: "",
    description: "",
    background : "",
    author: "",
    ingredients : "",
    directions: "",
    comments: []
}