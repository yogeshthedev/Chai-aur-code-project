import { createSlice } from "@reduxjs/toolkit";
import {
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "./authThunks.js";

const initialState = {
  user: null,
  isAuthenticated: false,
  authChecked: false,
  loading: false,
  error: null,
  success: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;

        // ❌ DO NOT authenticate user on register
        state.isAuthenticated = false;

        // optional: you may or may not store user
        state.user = null;

        state.success = "Registration successful!";
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
        state.success = null;
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user ?? action.payload;
        state.success = "Login successful!";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
        state.success = null;
      });

    builder
      .addCase(currentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(currentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user ?? action.payload;
        state.authChecked = true; // ✅ done checking
      })

      .addCase(currentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true; // ✅ done checking (failed)
      });

    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true; // ✅ VERY IMPORTANT
        state.success = "Logout successful";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
        state.error = action.payload ?? action.error?.message;
      });
  },
});

export default authSlice.reducer;
