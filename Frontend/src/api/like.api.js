import axiosInstance from "./axiosInstance";
import { LIKE_ENDPOINTS } from "../utils/constants";

export const toggleVideoLikeApi = async (videoId) => {
  const response = await axiosInstance.post(LIKE_ENDPOINTS.TOGGLE_VIDEO(videoId));
  return response.data;
};

export const getLikedVideosApi = async () => {
  const response = await axiosInstance.get(LIKE_ENDPOINTS.LIKED_VIDEOS);
  return response.data;
};
