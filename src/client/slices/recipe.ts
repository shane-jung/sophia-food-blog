import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
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
    setActiveRecipeId(state = initialState, action:PayloadAction<string>) {
      // state.activeRecipeId = action.payload
      return {
        ...state,
        activeRecipeId: action.payload
      }
    },
    addComment(state = initialState, action:PayloadAction<any>){
      // state.comments=  [...state.comments, action.payload]
      return {
        ...state,
        comments: [...state.comments, action.payload]
      }
    },
    setComments (state = initialState, action:PayloadAction<any>){
      return {
        ...state,
        comments: [...action.payload]
      }
    },
    addReply (state = initialState, action:PayloadAction<any>){
      const { index, comment } = action.payload;

      const newState = {
        ...state,
        comments: [...state.comments],
      };

      const updatedComment = {
        ...newState.comments[index],
        replies: [...newState.comments[index].replies, comment],
      };

      newState.comments[index] = updatedComment;
      return { 
        ...state, 
        newState
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { setActiveRecipeId, addComment, setComments, addReply } = recipeSlice.actions

export default recipeSlice.reducer