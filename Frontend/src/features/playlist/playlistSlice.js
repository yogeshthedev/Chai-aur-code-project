import { createSlice } from "@reduxjs/toolkit";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "./playlistThunks";

const initialState = {
  userPlaylists: [],
  currentPlaylist: null,
  loading: false,
  error: null,
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.userPlaylists = action.payload;
      })
      .addCase(getUserPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getPlaylistById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPlaylistById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlaylist = action.payload;
      });

    builder.addCase(createPlaylist.fulfilled, (state, action) => {
      state.userPlaylists.unshift(action.payload);
    });

    builder.addCase(updatePlaylist.fulfilled, (state, action) => {
      state.currentPlaylist = action.payload;
      const index = state.userPlaylists.findIndex(
        (p) => p._id === action.payload._id
      );
      if (index !== -1) {
        state.userPlaylists[index] = action.payload;
      }
    });

    builder.addCase(deletePlaylist.fulfilled, (state, action) => {
      state.userPlaylists = state.userPlaylists.filter(
        (p) => p._id !== action.payload
      );
      if (state.currentPlaylist?._id === action.payload) {
        state.currentPlaylist = null;
      }
    });
    builder.addCase(addVideoToPlaylist.fulfilled, (state, action) => {
      const updatedPlaylist = action.payload;

      // Update currentPlaylist
      if (state.currentPlaylist?._id === updatedPlaylist._id) {
        state.currentPlaylist = updatedPlaylist;
      }

      // Update userPlaylists
      const index = state.userPlaylists.findIndex(
        (p) => p._id === updatedPlaylist._id
      );
      if (index !== -1) {
        state.userPlaylists[index] = updatedPlaylist;
      }
    });

    builder.addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
      const updatedPlaylist = action.payload;

      if (state.currentPlaylist?._id === updatedPlaylist._id) {
        state.currentPlaylist = updatedPlaylist;
      }

      const index = state.userPlaylists.findIndex(
        (p) => p._id === updatedPlaylist._id
      );
      if (index !== -1) {
        state.userPlaylists[index] = updatedPlaylist;
      }
    });
  },
});

export default playlistSlice.reducer;
