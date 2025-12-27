import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  const ChannelId = req.user._id;

  const totalVideos = await Video.countDocuments({ owner: ChannelId });

  const totalSubscribers = await Subscription.countDocuments({
    channel: ChannelId,
  });

  const myVideos = await Video.find({ owner: req.user._id }, { _id: 1 });

  const videoIds = myVideos.map((video) => video._id);

  const totalLikes = await Like.countDocuments({
    video: { $in: videoIds },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos,
        totalSubscribers,
        totalLikes,
      },
      "Channel stats fetched successfully"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel

  const ChannelId = req.user._id;

  const channelVideos = await Video.find({ owner: ChannelId }).sort({
    createdAt: -1,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelVideos,
        channelVideos.length === 0
          ? "Video not available"
          : "Videos feteched succesfully"
      )
    );
});

export { getChannelStats, getChannelVideos };
