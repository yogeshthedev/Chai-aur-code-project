import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import videoReducer from "../features/video/videoSlice.js";

export default configureStore({
  reducer: {
    auth: authReducer,
    video: videoReducer,
  },
});
