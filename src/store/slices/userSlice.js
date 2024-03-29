import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user:
    typeof window !== undefined
      ? JSON.parse(localStorage.getItem("user"))
      : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
