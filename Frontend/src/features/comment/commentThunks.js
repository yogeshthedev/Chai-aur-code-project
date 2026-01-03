import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

export const fetchVideoComments = createAsyncThunk(
  "comment/fetchVideoComments",
  async (videoId, thunkAPI) => {
    try {
      const response = await api.get(`/comments/${videoId}`);
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error while getting comment"
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "comment/addComment",
  async (videoId, thunkAPI) => {
    try {
      const response = await api.post(`/comments/${videoId}`);
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error while adding comment"
      );
    }
  }
);
