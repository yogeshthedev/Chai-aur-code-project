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

export const uploadVideoApi = async (formData, onUploadProgress) => {
  const response = await axiosInstance.post(VIDEO_ENDPOINTS.LIST, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });

  return response.data;
};

export const deleteVideoApi = async (videoId) => {
  const response = await axiosInstance.delete(VIDEO_ENDPOINTS.DETAIL(videoId));
  return response.data;
};

export const updateVideoApi = async (videoId, data) => {
  const isFormData = data instanceof FormData;
  const response = await axiosInstance.patch(
    VIDEO_ENDPOINTS.DETAIL(videoId),
    data,
    isFormData
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      : undefined
  );
  return response.data;
};

export const togglePublishStatusApi = async (videoId) => {
  const response = await axiosInstance.patch(VIDEO_ENDPOINTS.TOGGLE_PUBLISH(videoId));
  return response.data;
};

export const updateVideoChaptersApi = async (videoId, chapters) => {
  const response = await axiosInstance.patch(VIDEO_ENDPOINTS.CHAPTERS(videoId), {
    chapters,
  });
  return response.data;
};