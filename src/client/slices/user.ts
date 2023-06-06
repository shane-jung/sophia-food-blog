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
      switch(action.payload.type){  
        case "add":
          const likedComments1 = [...state.likedComments, action.payload.commentId];
          // console.log("ADDING 1", likedComments1);
          state.likedComments = [...new Set(likedComments1)]
          break;
        case "remove":
          const likedComments2 = [...state.likedComments.filter((commentId:any) => commentId !== action.payload.commentId)]
          // console.log("REMOVING FILTERED", likedCommentsFiltered);
          state.likedComments =  likedComments2;
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
        username
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