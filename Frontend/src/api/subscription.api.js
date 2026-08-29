import axiosInstance from "./axiosInstance";

export const toggleSubscriptionApi = async (channelId) => {
  const response = await axiosInstance.post(`/subscriptions/c/${channelId}`);
  return response.data;
};
