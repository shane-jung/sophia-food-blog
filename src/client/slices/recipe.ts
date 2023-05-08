import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Recipe } from '../types'

interface RecipeState {
    title:string;
}

const initialState : RecipeState = {
    title: "",

}


export const recipeSlice = createSlice({
  name: 'recipe',
  initialState: initialState,
  reducers: {
    setTitle: (state, action:PayloadAction<string>) => {
      state.title = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setTitle } = recipeSlice.actions

export default recipeSlice.reducer