import { createSlice } from "@reduxjs/toolkit";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "./tweetThunks";

const initialState = {
  tweets: [],
  loading: false,
  error: null,
};

const tweetSlice = createSlice({
  name: "tweet",
  initialState,
  reducers: {
    clearTweets(state) {
      state.tweets = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET USER TWEETS
      .addCase(getUserTweets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserTweets.fulfilled, (state, action) => {
        state.loading = false;
        state.tweets = action.payload;
      })
      .addCase(getUserTweets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE TWEET
      .addCase(createTweet.fulfilled, (state, action) => {
        state.tweets.unshift(action.payload);
      })

      // UPDATE TWEET
      .addCase(updateTweet.fulfilled, (state, action) => {
        const index = state.tweets.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.tweets[index] = action.payload;
        }
      })

      // DELETE TWEET
      .addCase(deleteTweet.fulfilled, (state, action) => {
        state.tweets = state.tweets.filter(
          (t) => t._id !== action.payload
        );
      });
  },
});

export const { clearTweets } = tweetSlice.actions;
export default tweetSlice.reducer;
