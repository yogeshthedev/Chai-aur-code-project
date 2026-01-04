import { createSlice } from "@reduxjs/toolkit";
import {
  getAllVideos,
  getVideoById,
  toggleSubscription,
  toggleVideoLike,
} from "./videoThunks";

const initialState = {
  videos: [],
  currentVideo: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalVideos: 0,
  },
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVideos.fulfilled, (state, action) => {
        (state.loading = false), (state.videos = action.payload.videos);
        state.pagination.currentPage = action.payload.currentPage;
        state.pagination.totalPages = action.payload.totalPages;
        state.pagination.totalVideos = action.payload.totalVideos;
      })
      .addCase(getAllVideos.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      });

    builder

      .addCase(getVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getVideoById.fulfilled, (state, action) => {
        (state.loading = false), (state.currentVideo = action.payload);
      })

      .addCase(getVideoById.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      });

    builder
      // optimistic and rollback feature

      .addCase(toggleVideoLike.pending, (state) => {
        if (!state.currentVideo) return;

        if (state.currentVideo.isLiked) {
          state.currentVideo.isLiked = false;
          state.currentVideo.likeCount -= 1;
        } else {
          state.currentVideo.isLiked = true;
          state.currentVideo.likeCount += 1;
        }
      })

      .addCase(toggleVideoLike.rejected, (state, action) => {
        if (!state.currentVideo) return;

        if (state.currentVideo.isLiked) {
          state.currentVideo.isLiked = false;
          state.currentVideo.likeCount -= 1;
        } else {
          state.currentVideo.isLiked = true;
          state.currentVideo.likeCount += 1;
        }

        state.error = action.payload;
      });

    builder
      // only optimistic
      .addCase(toggleSubscription.pending, (state) => {
        if (state.currentVideo?.owner) {
          const owner = state.currentVideo.owner;

          if (owner.isSubscribed) {
            owner.subscriberCount -= 1;
          } else {
            owner.subscriberCount += 1;
          }

          owner.isSubscribed = !owner.isSubscribed;
        }
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default videoSlice.reducer;
