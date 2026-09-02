import axiosInstance from "./axiosInstance";
import { USER_ENDPOINTS } from "../utils/constants";

export const getUserChannelProfileApi = async (username) => {
  const response = await axiosInstance.get(USER_ENDPOINTS.USER_PROFILE(username));
  return response.data;
};

export const getWatchHistoryApi = async () => {
  const response = await axiosInstance.get(USER_ENDPOINTS.WATCH_HISTORY);
  return response.data;
};

export const clearWatchHistoryApi = async () => {
  const response = await axiosInstance.delete(USER_ENDPOINTS.WATCH_HISTORY);
  return response.data;
};
