import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Recipe } from '../types'

interface RecipeState {
    activeRecipeId : string;
    comments: any;
}

const initialState : RecipeState = {
    activeRecipeId: "",
    comments: [],

}


export const recipeSlice = createSlice({
  name: 'recipe',
  initialState: initialState,
  reducers: {
    setActiveRecipeId: (state, action:PayloadAction<string>) => {
      state.activeRecipeId = action.payload
    },
    addComment: (state, action:PayloadAction<any>) => {
      state.comments.push(action.payload)
    },
    setComments: (state, action:PayloadAction<any>) => {
      state.comments = action.payload
    },
    addReply: (state, action:PayloadAction<any>) => {
      console.log(state.comments);
      console.log(action.payload)
      state.comments[action.payload.index].replies.push(action.payload.comment);
    }

  },
})

// Action creators are generated for each case reducer function
export const { setActiveRecipeId, addComment, setComments, addReply } = recipeSlice.actions

export default recipeSlice.reducer