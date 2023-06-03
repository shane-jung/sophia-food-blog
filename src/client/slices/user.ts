import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
    activeUserId : string;
}

const initialState : UserState = {
    activeUserId: ""

}


export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setActiveUserId: (state, action:PayloadAction<string>) => {
      state.activeUserId = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setActiveUserId } = userSlice.actions

export default userSlice.reducer