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
