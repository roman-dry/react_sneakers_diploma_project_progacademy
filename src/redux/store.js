import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./slices/tokenSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
    reducer: {tokenReducer, userReducer,},
  })