

export type Recipe = {
    subtitle: string;
    _id: string;
    title: string;
    titleId: string;
    dateCreated: string;
    dateEdited: string;
    author: any;
    cardTitle: string;
    // ingredients : Ingredient[];
    imageUrl?: string;
    comments: string[];
    tags? : string [];
    ingredientTags? : string[];
    prepTime? : string;
    cookTime? : string; 
    ratings? : Rating [];
    notes? : string [];
    body : any[];

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
    ratings: any;
}

export const EmptyProfile:Profile = {
    firstName: "",
    lastName: "",   
    email: "",
    password: "",  
    savedRecipes : [],   // an array of Recipe Ids 
    comments : [],       // an array of (Recipe Id, comment Id)'s 
    likedComments : [ ],   // an array of Objects of the form  {recipeId, commentId []}
    ratings: [],
}

export interface Author extends Profile {
    profilePictureURL: string;
    recipes: Recipe[];
}

export type CommentType= {
    _id?: string;
    likes:number;
    username:string;
    profileId: string,
    content: string;
    date: string;
    replies?: CommentType[];
    rating?: Rating;
}

export type Rating = {
    _id?: string;
    userId: string;
    recipeId: string;
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
    subtitle: "",
    comments: [],
    ratings: [],
    imageUrl: "",
    tags: [],
    cardTitle: "",
}