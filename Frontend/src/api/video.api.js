import axiosInstance from "./axiosInstance";
import { VIDEO_ENDPOINTS } from "../utils/constants";

export const getVideosApi = async ({ page = 1, limit = 12, query = "", userId = "" } = {}) => {
  const response = await axiosInstance.get(VIDEO_ENDPOINTS.LIST, {
    params: {
      page,
      limit,
      ...(query ? { query } : {}),
      ...(userId ? { userId } : {}),
    },
  });

  return response.data;
};

export const getVideoByIdApi = async (videoId) => {
  const response = await axiosInstance.get(VIDEO_ENDPOINTS.DETAIL(videoId));
  return response.data;
};

export const uploadVideoApi = async (formData) => {
  const response = await axiosInstance.post(VIDEO_ENDPOINTS.LIST, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteVideoApi = async (videoId) => {
  const response = await axiosInstance.delete(VIDEO_ENDPOINTS.DETAIL(videoId));
  return response.data;
};

export const updateVideoApi = async (videoId, data) => {
  const response = await axiosInstance.patch(VIDEO_ENDPOINTS.DETAIL(videoId), data);
  return response.data;
};