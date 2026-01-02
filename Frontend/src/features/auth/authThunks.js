import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post("/users/register", userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);


export const loginUser = createAsyncThunk(
  "auth/login",
  async ({identifier,password}, thunkAPI) => {
    try {

        const payload = identifier.includes("@")
        ? { email: identifier, password }
        : { username: identifier, password };

      const response = await api.post("/users/login", payload);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);