import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import projectSlice from "./slices/projectSlice";
import selectedKeysSlice from "./slices/selectedKeysSlice";
import userSlice from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    project: projectSlice,
    selectedKeys: selectedKeysSlice,
  },
});
