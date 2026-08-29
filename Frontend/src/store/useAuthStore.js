import { create } from "zustand";
import {
  loginUserApi,
  registerUserApi,
  logoutUserApi,
  getCurrentUserApi,
} from "../api/auth.api";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Initial app load auth check
  isSubmitting: false,

  // Check if user has an active session on initial app load
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await getCurrentUserApi();
      const user = response?.data;
      set({ user: user || null, isAuthenticated: Boolean(user) });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  // Register action
  register: async (formData) => {
    set({ isSubmitting: true });
    try {
      const response = await registerUserApi(formData);
      toast.success("Account created successfully! Please sign in.");
      set({ isSubmitting: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
      set({ isSubmitting: false });
      return { success: false, error: errorMessage };
    }
  },

  // Login action
  login: async (credentials) => {
    set({ isSubmitting: true });
    try {
      const response = await loginUserApi(credentials);
      const loggedInUser = response.data?.user || response.data;
      set({
        user: loggedInUser,
        isAuthenticated: true,
        isSubmitting: false,
      });
      toast.success("Signed in successfully!");
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(errorMessage);
      set({ isSubmitting: false });
      return { success: false, error: errorMessage };
    }
  },

  // Logout action
  logout: async () => {
    try {
      await logoutUserApi();
      set({ user: null, isAuthenticated: false });
      toast.success("Logged out successfully");
    } catch {
      set({ user: null, isAuthenticated: false });
      toast.error("Session ended locally");
    }
  },

  // Update user in local state (e.g. after updating avatar/details)
  setUser: (updatedUser) => {
    set({ user: updatedUser });
  },
}));
