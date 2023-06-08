import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { Recipe } from '../types'

interface RecipeState {
    _id : string;
    comments: any;
    title: string;
    titleId: string;
    background: string;
    description: string;
    ingredients: string;
    instructions: string;
    dateEdited: string;
    dateCreated: string;
    imageUrl: string;


}

const initialState : RecipeState = {
    _id: "",
    comments: [],
    title: "",
    titleId: "",
    background: "",
    description: "",
    ingredients: "",
    instructions: "",
    dateEdited: "",
    dateCreated: "",
    imageUrl: "",
}


export const recipeSlice = createSlice({
  name: 'recipe',
  initialState: initialState,
  reducers: {
    setRecipe(state = initialState, action:PayloadAction<any>){
      return {
        ...state,
        ...action.payload,
        comments: state.comments,
      }
    }

    ,
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
        // console.log(index);
        const commentRemovedReply = {...state.comments[index], replies: state.comments[index].replies.filter((reply:any) => reply._id !== commentId)};
        // console.log(commentRemovedReply)
        const comments = [...state.comments];
        // console.log(comments);
        comments[index] = commentRemovedReply;
        // console.log(comments);
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
export const { addComment, setComments, addReply, removeComment, setRecipe } = recipeSlice.actions

export default recipeSlice.reducer