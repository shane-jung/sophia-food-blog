import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { Rating, Recipe } from '../types'

interface RecipeState {
    activeRecipeId : string,
}

const initialState : RecipeState = {
   activeRecipeId: "",
   
}


export const recipeSlice = createSlice({
  name: 'recipe',
  initialState: initialState,
  reducers: {
    setRecipe(state = initialState, action:PayloadAction<any>){
      console.log("HERE", action.payload);
      return {
        ...state,
        ...action.payload
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { setRecipe } = recipeSlice.actions

export default recipeSlice.reducer