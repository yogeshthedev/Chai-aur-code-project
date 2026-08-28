import axiosInstance from "./axiosInstance";
import { USER_ENDPOINTS } from "../utils/constants";

/**
 * Register a new user with avatar and optional cover image.
 * Uses multipart/form-data for file uploads.
 */
export const registerUserApi = async (formData) => {
  const response = await axiosInstance.post(USER_ENDPOINTS.REGISTER, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Login user with email or username + password.
 */
export const loginUserApi = async (credentials) => {
  const response = await axiosInstance.post(USER_ENDPOINTS.LOGIN, credentials);
  return response.data;
};

/**
 * Logout currently authenticated user (clears cookies on backend).
 */
export const logoutUserApi = async () => {
  const response = await axiosInstance.post(USER_ENDPOINTS.LOGOUT);
  return response.data;
};

/**
 * Fetch currently logged in user details using session cookies.
 */
export const getCurrentUserApi = async () => {
  const response = await axiosInstance.get(USER_ENDPOINTS.CURRENT_USER);
  return response.data;
};

/**
 * Change current user password.
 */
export const changePasswordApi = async ({ oldPassword, newPassword }) => {
  const response = await axiosInstance.post(USER_ENDPOINTS.CHANGE_PASSWORD, {
    oldPassword,
    newPassword,
  });
  return response.data;
};

/**
 * Update user basic details (full name, email).
 */
export const updateAccountDetailsApi = async (data) => {
  const response = await axiosInstance.patch(USER_ENDPOINTS.UPDATE_ACCOUNT, data);
  return response.data;
};

/**
 * Update user avatar image.
 */
export const updateAvatarApi = async (avatarFile) => {
  const formData = new FormData();
  formData.append("avatar", avatarFile);
  const response = await axiosInstance.patch(USER_ENDPOINTS.UPDATE_AVATAR, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Update user cover image.
 */
export const updateCoverImageApi = async (coverImageFile) => {
  const formData = new FormData();
  formData.append("coverImage", coverImageFile);
  const response = await axiosInstance.patch(USER_ENDPOINTS.UPDATE_COVER_IMAGE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
