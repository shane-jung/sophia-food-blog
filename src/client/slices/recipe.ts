import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { Rating, Recipe } from '../types'

interface RecipeState {
    _id : string;
    comments: any;
    commentIds: string[];
    title: string;
    cardTitle:string;
    titleId: string;
    background: string;
    description: string;
    ingredients: string;
    instructions: string;
    dateEdited: string;
    dateCreated: string;
    imageUrl: string;
    ratings: Rating[],
    tags: any, 
    tagIds: string[],
    selectedTags: any[], 
    savedTags: any[],
}

const initialState : RecipeState = {
    _id: "",
    comments: [],
    commentIds:[],
    title: "",
    cardTitle: "",
    titleId: "",
    background: "",
    description: "",
    ingredients: "",
    instructions: "",
    dateEdited: "",
    dateCreated: "",
    imageUrl: "",
    ratings: [],
    tags: [],
    tagIds:[],
    selectedTags: [],
    savedTags: [],
}


export const recipeSlice = createSlice({
  name: 'recipe',
  initialState: initialState,
  reducers: {
    setRecipe(state = initialState, action:PayloadAction<any>){
      // console.log(action.payload.type);
      switch (action.payload.type){
        case "set-recipe":
          return {
            ...state,
            ...action.payload.recipe
          }
        case "clear-recipe":
          return {
            ...initialState
          }
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { setRecipe } = recipeSlice.actions

export default recipeSlice.reducer