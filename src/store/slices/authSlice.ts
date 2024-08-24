import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../interfaces/user-interfaces";

interface IInitialState {
  isAuth: boolean;
  isLoading: boolean;
  user: null | IUser;
}

const initialState: IInitialState = {
  isAuth: false,
  isLoading: true,
  user: null,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<null | IUser>) => {
      state.isLoading = false;
      state.isAuth = !!payload;
      state.user = payload;
    },
  },
});

export const authSliceActions = authSlice.actions;

export default authSlice.reducer;
