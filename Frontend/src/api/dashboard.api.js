import axiosInstance from "./axiosInstance";
import { DASHBOARD_ENDPOINTS } from "../utils/constants";

export const getDashboardStatsApi = async () => {
  const response = await axiosInstance.get(DASHBOARD_ENDPOINTS.STATS);
  return response.data;
};

export const getDashboardVideosApi = async () => {
  const response = await axiosInstance.get(DASHBOARD_ENDPOINTS.VIDEOS);
  return response.data;
};
