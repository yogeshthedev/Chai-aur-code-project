import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

export const getAllVideos = createAsyncThunk(
  "video/getAllVideos",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/videos");
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const getVideoById = createAsyncThunk(
  "video/getVideoById",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/videos/${id}`);
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const toggleVideoLike = createAsyncThunk(
  "video/toggleVideoLike",
  async (videoId, thunkAPI) => {
    try {
      const response = await api.post(`/likes/toggle/v/${videoId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);
