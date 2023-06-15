import { configureStore } from '@reduxjs/toolkit'
import recipeReducer from './recipe'
import userReducer from './user'

export const store = configureStore({
  reducer: {
    recipe: recipeReducer,
    user: userReducer,
  },
})



export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch