import axiosInstance from "./axiosInstance";

export const getVideoCommentsApi = async ({ videoId, page = 1, limit = 10 }) => {
  const response = await axiosInstance.get(`/comments/${videoId}`, {
    params: { page, limit },
  });

  return response.data;
};

export const addCommentApi = async ({ videoId, content }) => {
  const response = await axiosInstance.post(`/comments/${videoId}`, { content });
  return response.data;
};

export const updateCommentApi = async ({ commentId, content }) => {
  const response = await axiosInstance.patch(`/comments/c/${commentId}`, { content });
  return response.data;
};

export const deleteCommentApi = async (commentId) => {
  const response = await axiosInstance.delete(`/comments/c/${commentId}`);
  return response.data;
};
