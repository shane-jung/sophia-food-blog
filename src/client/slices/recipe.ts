import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Recipe } from '../types'

interface RecipeState {
    activeRecipeId : string;
}

const initialState : RecipeState = {
    activeRecipeId: ""

}


export const recipeSlice = createSlice({
  name: 'recipe',
  initialState: initialState,
  reducers: {
    setActiveRecipeId: (state, action:PayloadAction<string>) => {
      state.activeRecipeId = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setActiveRecipeId } = recipeSlice.actions

export default recipeSlice.reducer