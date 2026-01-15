import { createSlice } from "@reduxjs/toolkit";
import { getWatchHistory } from "./historyThunks";

const initialState = {
  videos: [],
  loading: false,
  error: null,
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    clearHistoryState(state) {
      state.videos = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWatchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWatchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(getWatchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
  },
});

export const { clearHistoryState } = historySlice.actions;
export default historySlice.reducer;
