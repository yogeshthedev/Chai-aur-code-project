import axiosInstance from "./axiosInstance";
import { PLAYLIST_ENDPOINTS } from "../utils/constants";

export const getUserPlaylistsApi = async (userId) => {
  const response = await axiosInstance.get(PLAYLIST_ENDPOINTS.USER(userId));
  return response.data;
};

export const getPlaylistByIdApi = async (playlistId) => {
  const response = await axiosInstance.get(PLAYLIST_ENDPOINTS.DETAIL(playlistId));
  return response.data;
};

export const createPlaylistApi = async (payload) => {
  const response = await axiosInstance.post(PLAYLIST_ENDPOINTS.CREATE, payload);
  return response.data;
};

export const addVideoToPlaylistApi = async ({ playlistId, videoId }) => {
  const response = await axiosInstance.patch(
    PLAYLIST_ENDPOINTS.ADD_VIDEO(playlistId, videoId)
  );
  return response.data;
};

export const removeVideoFromPlaylistApi = async ({ playlistId, videoId }) => {
  const response = await axiosInstance.patch(
    PLAYLIST_ENDPOINTS.REMOVE_VIDEO(playlistId, videoId)
  );
  return response.data;
};

export const deletePlaylistApi = async (playlistId) => {
  const response = await axiosInstance.delete(PLAYLIST_ENDPOINTS.DETAIL(playlistId));
  return response.data;
};

export const updatePlaylistApi = async ({ playlistId, payload }) => {
  const response = await axiosInstance.patch(
    PLAYLIST_ENDPOINTS.DETAIL(playlistId),
    payload
  );
  return response.data;
};
