import {
  IReportData,
  IReportDataForPublish,
} from "../../interfaces/report-interfaces";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reportsApi from "../../api/reportsApi";
import { IUser } from "../../interfaces/user-interfaces";

interface IInitialState {
  isLoading: boolean;
  allReports: IReportData[];
}

const initialState: IInitialState = {
  isLoading: false,
  allReports: [],
};

export const reportsSlice = createSlice({
  name: "reportsSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      //getAllReports
      .addCase(getAllReports.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllReports.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.allReports = payload;
      })
      //addReport
      .addCase(addReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReport.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.allReports = payload;
      })
      //deleteReportById
      .addCase(deleteReportById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReportById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.allReports = payload;
      })
      //updateReport
      .addCase(updateReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateReport.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.allReports = payload;
      });
  },
});

export const getAllReports = createAsyncThunk(
  "reportsSlice/getAllReports",
  async () => {
    return reportsApi.getAllReports();
  }
);

export default reportsSlice.reducer;

export const addReport = createAsyncThunk(
  "reportSlice/addReport",
  async ({
    reportMessage,
    department,
    allowPublish,
    isAnonim,
    fullName,
    user,
  }: {
    reportMessage: string;
    department: string;
    allowPublish: boolean;
    isAnonim: boolean;
    fullName: string;
    user: IUser;
  }) => {
    return reportsApi.addReport(
      reportMessage,
      department,
      allowPublish,
      isAnonim,
      fullName,
      user
    );
  }
);

export const deleteReportById = createAsyncThunk(
  "reportsSlice/deleteReportById",
  async ({ user, id }: { user: IUser; id: string }) => {
    return reportsApi.deleteReportById(user, id);
  }
);

export const updateReport = createAsyncThunk(
  "reportsSlice/updateReport",
  async ({ newData, id }: { newData: IReportDataForPublish; id: string }) => {
    return reportsApi.updateReport(newData, id);
  }
);
