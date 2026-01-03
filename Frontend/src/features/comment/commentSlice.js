import { createSlice } from "@reduxjs/toolkit";
import { fetchVideoComments } from "./commentThunks";

const initialState = {
  comments: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalComments: 0,
};
const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideoComments.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchVideoComments.fulfilled, (state, action) => {
        state.loading = false;

        state.comments = action.payload.comments;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalComments = action.payload.totalComments;
      })

      .addCase(fetchVideoComments.rejected, (state, action) => {
        (state.error = action.payload || action.payload.error),
          (state.loading = false);
      });

    builder

      .addCase(addComment.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.comments;
      })

      .addCase(addComment.rejected, (state, action) => {
        (state.error = action.payload || action.payload.error),
          (state.loading = false);
      });
  },
});

export default commentSlice.reducer;
