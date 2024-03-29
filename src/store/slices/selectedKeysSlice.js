import { createSlice } from "@reduxjs/toolkit";

const selectedKeysSlice = createSlice({
  name: "selectedKeys",
  initialState: { value: new Set([]) },
  reducers: {
    setSelectedKeys: (state, action) => {
      state.value = new Set(action.payload);
    },
  },
});

export const { setSelectedKeys } = selectedKeysSlice.actions;
export default selectedKeysSlice.reducer;
