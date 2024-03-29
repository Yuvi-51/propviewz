import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: typeof window !== "undefined" ? localStorage?.getItem("token") : "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      localStorage.setItem("token", action.payload);
      state.token = action.payload;
    },
    removeToken: (state) => {
      state.token = "";
      // localStorage.removeItem("token");
      localStorage.clear();
    },
  },
});

export const { setToken, removeToken } = authSlice.actions;

export default authSlice.reducer;
