import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  _id: string;
  likedComments: any;
  email: string;
  username: string;
  viewMode: string;
  savedRecipes: string[];
  comments: string[];
}

const initialState: UserState = {
  _id: "",
  likedComments: [],
  email: "",
  username: "",
  viewMode: "VIEWING",
  savedRecipes: [],
  comments: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setLikedComments(state = initialState, action: PayloadAction<any>) {
      return {
        ...state,
        likedComments: [...new Set(action.payload)],
      };
    },
    setLikedComment(state = initialState, action: PayloadAction<any>) {
      const recipeId = action.payload.recipeId;
      const index = state.likedComments.findIndex(
        (comment: any) => comment.recipeId === recipeId
      );
      switch (action.payload.type) {
        case "add":
          if (index === -1)
            return {
              ...state,
              likedComments: [
                ...state.likedComments,
                {
                  recipeId: action.payload.recipeId,
                  comments: [action.payload.commentId],
                },
              ],
            };
          else {
            const commentsList = [
              ...state.likedComments[index].comments,
              action.payload.commentId,
            ];
            const commentsObject = {
              recipeId: action.payload.recipeId,
              comments: commentsList,
            };
            const likedComments = [...state.likedComments];
            likedComments[index] = commentsObject;
            return {
              ...state,
              likedComments,
            };
          }
          break;
        case "remove":
          if (index != -1) {
            const commentsList = state.likedComments[index].comments;
            const commentsListFiltered = commentsList.filter(
              (commentId: string) => commentId !== action.payload.commentId
            );
            const commentsObject = {
              recipeId: action.payload.recipeId,
              comments: commentsListFiltered,
            };
            const likedComments = [...state.likedComments];
            likedComments[index] = commentsObject;
            return {
              ...state,
              likedComments,
            };
          }
        default:
      }
    },
    handleLogin(state = initialState, action: PayloadAction<any>) {
      const { _id, email, likedComments, username, savedRecipes, comments } =
        action.payload;
      // console.log(action.payload.user);
      return {
        ...state,
        _id,
        email,
        username,
        likedComments,
        viewMode: state.viewMode || "VIEWING",
        savedRecipes,
        comments,
      };
    },
    handleLogout(state = initialState) {
      return {
        ...state,
        _id: "",
        likedComments: [],
        email: "",
        username: "",
        viewMode: "VIEWING",
      };
    },
    setViewMode(state = initialState, action: PayloadAction<string>) {
      // cosnsole.log(action);
      switch (action.payload) {
        case "editing-recipe":
          return {
            ...state,
            viewMode: "EDITING",
          };
        case "viewing-recipe":
          return {
            ...state,
            viewMode: "VIEWING",
          };
        case "creating-recipe":
          return {
            ...state,
            viewMode: "CREATING",
          };
      }
    },
  },
});

// Action creators are generated for each case reducer functionikedCommentsForRecipe
export const {
  setLikedComments,
  setLikedComment,
  handleLogout,
  handleLogin,
  setViewMode,
} = userSlice.actions;

export default userSlice.reducer;
