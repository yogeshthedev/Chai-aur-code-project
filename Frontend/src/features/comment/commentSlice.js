import { createSlice } from "@reduxjs/toolkit";
import {
  addComment,
  deleteComment,
  fetchVideoComments,
  updateComment,
} from "./commentThunks";

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
        state.comments.unshift(action.payload);
        state.totalComments += 1;
      })

      .addCase(addComment.rejected, (state, action) => {
        (state.error = action.payload || action.payload.error),
          (state.loading = false);
      });

    builder

      .addCase(updateComment.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })

      .addCase(updateComment.rejected, (state, action) => {
        (state.error = action.payload || action.payload.error),
          (state.loading = false);
      });

    builder
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter((c) => c._id !== action.payload);
        state.totalComments -= 1;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default commentSlice.reducer;
