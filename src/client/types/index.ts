export type Recipe = {
  subtitle: string;
  _id: string;
  title: string;
  titleId: string;
  dateCreated: string;
  dateEdited: string;
  description: string;
  background: string;
  author: any;
  cuisines?: string[];
  meals?: string[];
  ingredients?: any;
  imageUrl?: string;
  comments: string[];
  tags?: string[];
  ingredientTags?: string[];
  prepTime?: string;
  cookTime?: string;
  ratings: Rating[];
  notes?: string[];
  body: any[];
  averageRating: number;
  servings: string;
};

export type Ingredient = {
  _id?: string;
  name: string;
  quantity: number;
};

export type Profile = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  savedRecipes: any;
  comments: any;
  likedComments: any;
  ratings: any;
};

export const EmptyProfile: Profile = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  savedRecipes: [],
  comments: [],
  likedComments: [],
  ratings: [],
};

export interface Author extends Profile {
  profilePictureURL: string;
  recipes: Recipe[];
}

export type CommentType = {
  _id?: string;
  likes: number;
  username: string;
  profileId: string;
  content: string;
  date: string;
  replies?: CommentType[];
  rating?: Rating;
};

export type Rating = {
  _id?: string;
  userId: string;
  recipeId: string;
  rating: number;
  date: string;
};

export const EmptyRecipe: Recipe = {
  _id: "",
  title: "",
  titleId: "",
  dateCreated: "",
  dateEdited: "",
  description: "",
  background: "",
  author: "",
  ingredients: "",
  subtitle: "",
  comments: [],
  ratings: [],
  imageUrl: "",
  tags: [],
  body: [],
  averageRating: 0,
  servings: "",
};
