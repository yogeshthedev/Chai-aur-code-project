import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/**
 * GET /users/history
 */
export const getWatchHistory = createAsyncThunk(
  "history/getWatchHistory",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/users/history");

      return res.data.data; // array of videos
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch watch history"
      );
    }
  }
);

export const deleteAllHistory = createAsyncThunk(
  "history/deleteAllHistory",
  async (_, thunkAPI) => {
    try {
      const res = await api.delete("/users/history");
      return res.data.message; // success message
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete watch history"
      );
    }
  }
);
