import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, IUserData } from "../../interfaces/user-interfaces";
import userApi from "../../api/userApi";

interface IInitialState extends IUserData {
  isLoading: boolean;
}

const initialState: IInitialState = {
  rating: 0,
  fullName: "",
  reports: [],
  reportsRef: [],
  isLoading: false,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //getUserData
      .addCase(getUserData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getUserData.fulfilled,
        (state, { payload }: PayloadAction<IUserData>) => {
          state.isLoading = false;
          Object.assign(state, payload);
        }
      )
      //updateUserName
      .addCase(updateUserName.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        updateUserName.fulfilled,
        (state, { payload }: PayloadAction<string>) => {
          state.fullName = payload;
        }
      )
      //updateUserReports
      .addCase(updateUserReports.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserReports.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        Object.assign(state, payload);
      })
      //updateUserRating
      .addCase(updateUserRating.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserRating.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        Object.assign(state, payload);
      });
  },
});

export const getUserData = createAsyncThunk(
  "userSlice/getUserData",
  async (user: IUser) => {
    return userApi.getUserData(user);
  }
);

export const updateUserName = createAsyncThunk(
  "userSlice/setUserName",
  async ({ user, name }: { user: IUser; name: string }) => {
    const updatedName = await userApi.updateUserName(user, name);
    return updatedName;
  }
);

export const updateUserReports = createAsyncThunk(
  "userSlice/updateUserReports",
  async (user: IUser) => {
    return userApi.updateUserReports(user);
  }
);

export const updateUserRating = createAsyncThunk(
  "userSlice/updateUserRating",
  async ({ user, rating }: { user: IUser; rating: number }) => {
    return userApi.updateUserRating(user, rating);
  }
);

export const userSliceActions = userSlice.actions;

export default userSlice.reducer;
