import { configureStore } from '@reduxjs/toolkit'
import recipeReducer from './recipe'

const store = configureStore({
  reducer: {
    recipe: recipeReducer,
  },
})



export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch