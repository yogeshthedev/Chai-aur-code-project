import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

// 🔹 Fetch comments
export const fetchVideoComments = createAsyncThunk(
  "comment/fetchVideoComments",
  async (videoId, thunkAPI) => {
    try {
      const res = await api.get(`/comments/${videoId}`);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error fetching comments"
      );
    }
  }
);

// 🔹 Add comment
export const addComment = createAsyncThunk(
  "comment/addComment",
  async ({ videoId, content }, thunkAPI) => {
    try {
      const res = await api.post(`/comments/${videoId}`, { content });
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error adding comment"
      );
    }
  }
);

// 🔹 Update comment
export const updateComment = createAsyncThunk(
  "comment/updateComment",
  async ({ commentId, content }, thunkAPI) => {
    try {
      const res = await api.patch(`/comments/c/${commentId}`, { content });
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error updating comment"
      );
    }
  }
);

// 🔹 Delete comment
export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (commentId, thunkAPI) => {
    try {
      await api.delete(`/comments/c/${commentId}`);
      return commentId; // ✅ return ID only
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error deleting comment"
      );
    }
  }
);

