import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";


export const createPlaylist = createAsyncThunk(
  "playlist/create",
  async ({ name, description }, thunkAPI) => {
    try {
      const res = await api.post("/playlists", { name, description });
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create playlist"
      );
    }
  }
);


export const getPlaylistById = createAsyncThunk(
  "playlist/getById",
  async (playlistId, thunkAPI) => {
    try {
      const res = await api.get(`/playlists/${playlistId}`);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch playlist"
      );
    }
  }
);


export const getUserPlaylists = createAsyncThunk(
  "playlist/getUserPlaylists",
  async (userId, thunkAPI) => {
    try {
      const res = await api.get(`/playlists/user/${userId}`);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch playlists"
      );
    }
  }
);


export const updatePlaylist = createAsyncThunk(
  "playlist/update",
  async ({ playlistId, name, description }, thunkAPI) => {
    try {
      const res = await api.patch(`/playlists/${playlistId}`, {
        name,
        description,
      });
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update playlist"
      );
    }
  }
);


export const deletePlaylist = createAsyncThunk(
  "playlist/delete",
  async (playlistId, thunkAPI) => {
    try {
      await api.delete(`/playlists/${playlistId}`);
      return playlistId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete playlist"
      );
    }
  }
);


export const addVideoToPlaylist = createAsyncThunk(
  "playlist/addVideo",
  async ({ videoId, playlistId }, thunkAPI) => {
    try {
      const res = await api.patch(
        `/playlists/add/${videoId}/${playlistId}`
      );
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add video"
      );
    }
  }
);

/**
 * 🔹 Remove video from playlist
 * PATCH /playlists/remove/:videoId/:playlistId
 */
export const removeVideoFromPlaylist = createAsyncThunk(
  "playlist/removeVideo",
  async ({ videoId, playlistId }, thunkAPI) => {
    try {
      const res = await api.patch(
        `/playlists/remove/${videoId}/${playlistId}`
      );
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove video"
      );
    }
  }
);
