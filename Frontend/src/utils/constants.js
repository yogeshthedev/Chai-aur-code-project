export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const USER_ENDPOINTS = {
  REGISTER: "/users/register",
  LOGIN: "/users/login",
  LOGOUT: "/users/logout",
  REFRESH_TOKEN: "/users/refresh-token",
  CURRENT_USER: "/users/current-user",
  CHANGE_PASSWORD: "/users/change-password",
  UPDATE_ACCOUNT: "/users/update-account",
  UPDATE_AVATAR: "/users/avatar",
  UPDATE_COVER_IMAGE: "/users/cover-image",
  USER_PROFILE: (username) => `/users/c/${username}`,
  WATCH_HISTORY: "/users/history",
};

export const LIKE_ENDPOINTS = {
  TOGGLE_VIDEO: (videoId) => `/likes/toggle/v/${videoId}`,
  LIKED_VIDEOS: "/likes/videos",
};

export const PLAYLIST_ENDPOINTS = {
  BASE: "/playlist",
  CREATE: "/playlist",
  USER: (userId) => `/playlist/user/${userId}`,
  DETAIL: (playlistId) => `/playlist/${playlistId}`,
  ADD_VIDEO: (playlistId, videoId) => `/playlist/add/${videoId}/${playlistId}`,
  REMOVE_VIDEO: (playlistId, videoId) => `/playlist/remove/${videoId}/${playlistId}`,
};

export const DASHBOARD_ENDPOINTS = {
  STATS: "/dashboard/stats",
  VIDEOS: "/dashboard/videos",
};

export const VIDEO_ENDPOINTS = {
  LIST: "/videos",
  DETAIL: (videoId) => `/videos/${videoId}`,
};
