export type Recipe = {
    _id: string;
    title: string;
    titleID: string;
    dateCreated?: Date;
    dateEdited?: Date;
    description: string;
    author?: Author;
    ingredients : Ingredient[];
    instructions?: string[];
    imageURLs?: string[];
    comments?: Comment[];
    tags? : string [];
    ingredientTags? : string[];
    prepTime? : string;
    cookTime? : string; 
    ratings? : Rating [];
    notes? : string [];
    children? : JSX.Element | JSX.Element[];

}

export type Ingredient = {
    _id?: string;
    name: string;
    quantity: number;
}


export type Profile = {
    _id: string;
    name: string;
    email: string;
    password: string;  
    savedRecipes: Recipe[];
   

}

export interface Author extends Profile {
    profilePictureURL: string;
    recipes: Recipe[];
}

export type Comment = {
    _id: string;
    profile: Profile;
    content: string;
    date: Date;
    replies: Comment[];
    rating?: Rating;
}

export type Rating = {
    _id: string;
    profile?: Profile;
    rating: number;
    date: Date;

}