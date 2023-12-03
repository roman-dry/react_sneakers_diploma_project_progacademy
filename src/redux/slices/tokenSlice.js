import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorage";

const initialState = {
    item: {
      userId: getLocalStorage("token").userId || "",
      access_token: getLocalStorage("token").access_token || "",
      exp: getLocalStorage("token").exp || "",
    },
  };

  export const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
      setTokenItem(state, action) {
        state.item = action.payload
        setLocalStorage("token", action.payload);
      },
      removeToken(state) {
        localStorage.removeItem("token")
        state.item = initialState;
      },
    },
  });
  
  export const { setTokenItem, removeToken } = tokenSlice.actions;
  export default tokenSlice.reducer;