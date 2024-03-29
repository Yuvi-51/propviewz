import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  inView: "",
};

const projectSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setInView: (state, action) => {
      state.inView = action.payload;
    },
  },
});

export const { setInView } = projectSlice.actions;

export default projectSlice.reducer;
