import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const getChannelProfile = createAsyncThunk(
  "channel/getChannelProfile",
  async (username, thunkAPI) => {
    try {
      const res = await api.get(`/users/c/${username}`);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch channel profile"
      );
    }
  }
);

export const getChannelVideos = createAsyncThunk(
  "channel/getChannelVideos",
  async (channelId, thunkAPI) => {
    try {
      const res = await api.get(`/videos`, {
        params: { userId: channelId },
      });

      return res.data.data.videos || res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch channel videos"
      );
    }
  }
);

export const toggleSubscription = createAsyncThunk(
  "channel/toggleSubscription",
  async (channelId, thunkAPI) => {
    try {
      await api.post(`/subscriptions/c/${channelId}`);
      return channelId; // needed for optimistic update
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);
