import axios from "axios";
import { API_BASE_URL, USER_ENDPOINTS } from "../utils/constants";

/**
 * Industry-Standard Axios Client:
 * 1. withCredentials: true ensures cookies (accessToken, refreshToken) are sent with every request.
 * 2. Response interceptor intercepts 401 Unauthorized errors to automatically refresh tokens.
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to avoid infinite refresh loops
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handles 401 errors & token rotation
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already retried this request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== USER_ENDPOINTS.LOGIN &&
      originalRequest.url !== USER_ENDPOINTS.REGISTER &&
      originalRequest.url !== USER_ENDPOINTS.REFRESH_TOKEN
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to get a new access token using refresh token cookie
        await axios.post(
          USER_ENDPOINTS.REFRESH_TOKEN,
          {},
          { withCredentials: true }
        );

        isRefreshing = false;
        processQueue(null);

        // Retry the original failed request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
