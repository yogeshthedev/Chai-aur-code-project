import { createSlice } from "@reduxjs/toolkit";
import {
  getChannelProfile,
  getChannelVideos,
  toggleSubscription,
} from "./channelThunks";

const initialState = {
  profile: null,
  videos: [],
  loading: false,
  error: null,
};

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getChannelProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChannelProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getChannelProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getChannelVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChannelVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(getChannelVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(toggleSubscription.fulfilled, (state) => {
        if (state.profile) {
          if (state.profile.isSubscribed) {
            state.profile.isSubscribed = false;
            state.profile.subscribersCount -= 1;
          } else {
            state.profile.isSubscribed = true;
            state.profile.subscribersCount += 1;
          }
        }
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default channelSlice.reducer;
