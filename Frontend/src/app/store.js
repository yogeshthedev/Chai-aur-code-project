import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import videoReducer from "../features/video/videoSlice.js";
import commentReducer from "../features/comment/commentSlice.js";
import channelReducer from "../features/channel/channelSlice.js";
import playlistReducer from "../features/playlist/playlistSlice.js";
import historyReducer from "../features/history/historySlice.js";
import tweetReducer from "../features/tweet/tweetSlice.js";

export default configureStore({
  reducer: {
    auth: authReducer,
    video: videoReducer,
    comment: commentReducer,
    profile: channelReducer,
    playlist: playlistReducer,
    history: historyReducer,
      tweet: tweetReducer, 
  },
});
