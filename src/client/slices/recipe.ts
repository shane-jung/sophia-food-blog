import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { database } from 'faker';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
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
    removeComment(state = initialState, action:PayloadAction<any>){
      if(action.payload.type === "reply"){
        const { commentId, index } = action.payload;
        console.log(index);
        const commentRemovedReply = {...state.comments[index], replies: state.comments[index].replies.filter((reply:any) => reply._id !== commentId)};
        console.log(commentRemovedReply)
        const comments = [...state.comments];
        console.log(comments);
        comments[index] = commentRemovedReply;
        console.log(comments);
        return {
          ...state,
          comments: [...comments]
        }
      }
      return {
        ...state,
        comments: [...state.comments.filter((data:any) => data.comment._id !== action.payload.commentId)]
      }
    },
    setComments (state = initialState, action:PayloadAction<any>){
      return {
        ...state,
        comments: [...action.payload]
      }
    },
    addReply (state = initialState, action:PayloadAction<any>){
      const { comment, index } = action.payload;

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
        ...newState
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { setActiveRecipeId, addComment, setComments, addReply, removeComment } = recipeSlice.actions

export default recipeSlice.reducer