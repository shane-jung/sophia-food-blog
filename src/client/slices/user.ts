import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
    _id : string;
    likedComments: any;
    email: string;
    username: string;
}

const initialState : UserState = {
    _id: "",
    likedComments: [],
    email: "",
    username: "",
}


export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setId (state = initialState, action:PayloadAction<string>){
      // state._id = action.payload
      return {
        ...state,
        _id: action.payload
      };
    },
    setLikedComments (state = initialState, action:PayloadAction<any>) {
      return {
        ...state,
        likedComments: [...new Set(action.payload)]
      }
    },
    setLikedComment (state = initialState, action:PayloadAction<any>)  {
      const recipeId = action.payload.recipeId;
      const index = state.likedComments.findIndex((comment:any) => comment.recipeId === recipeId);
      switch(action.payload.type){  
        case "add":
          if(index === -1)
            return {
              ...state, 
              likedComments: [
                ...state.likedComments, { 
                  recipeId: action.payload.recipeId, 
                  comments: [
                    action.payload.commentId
                  ]
                }
              ]
            }
          else {
            const commentsList = [...state.likedComments[index].comments, action.payload.commentId];
            const commentsObject = { recipeId: action.payload.recipeId, comments: commentsList };
            const likedComments = [...state.likedComments];
            likedComments[index] = commentsObject;
            return {
              ...state,
              likedComments
            }
          }
        break;
        case "remove":
          if(index!= -1){
            const commentsList = state.likedComments[index].comments;
            const commentsListFiltered = commentsList.filter((commentId:string) => commentId !== action.payload.commentId);
            const commentsObject = { recipeId: action.payload.recipeId, comments: commentsListFiltered };
            const likedComments = [...state.likedComments];
            likedComments[index] = commentsObject;
            return {
              ...state,
              likedComments
            }
          }
        default:
          
      } 
    },
    handleLogin (state = initialState, action:PayloadAction<any>)  {
      const {_id, email, likedComments, username} = action.payload.user;
      // console.log(action.payload.user);
      return {
        ...state, 
        _id,
        email,
        username,
        likedComments
      }
    },
    handleLogout (state = initialState){
      return {
        ...state, 
        _id: "",
        likedComments: [],
        email: "",
        username: "",
      }
    },
  },
})

// Action creators are generated for each case reducer functionikedCommentsForRecipe
export const { setId, setLikedComments, setLikedComment, handleLogout, handleLogin} = userSlice.actions

export default userSlice.reducer