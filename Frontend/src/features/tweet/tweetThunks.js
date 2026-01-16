import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// CREATE TWEET
export const createTweet = createAsyncThunk(
  "tweet/createTweet",
  async ({ content }, thunkAPI) => {
    try {
      const res = await api.post("/tweets", { content });
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create tweet"
      );
    }
  }
);

// GET USER TWEETS (COMMUNITY TAB)
export const getUserTweets = createAsyncThunk(
  "tweet/getUserTweets",
  async (userId, thunkAPI) => {
    try {
      const res = await api.get(`/tweets/user/${userId}`);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch tweets"
      );
    }
  }
);

// UPDATE TWEET
export const updateTweet = createAsyncThunk(
  "tweet/updateTweet",
  async ({ tweetId, content }, thunkAPI) => {
    try {
      const res = await api.patch(`/tweets/${tweetId}`, { content });
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update tweet"
      );
    }
  }
);

// DELETE TWEET
export const deleteTweet = createAsyncThunk(
  "tweet/deleteTweet",
  async (tweetId, thunkAPI) => {
    try {
      await api.delete(`/tweets/${tweetId}`);
      return tweetId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete tweet"
      );
    }
  }
);
