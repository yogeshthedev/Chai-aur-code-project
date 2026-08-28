import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "./../models/video.model.js";
import { Comment } from "./../models/comment.model.js";
import { Tweet } from "./../models/tweet.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const existingLike = await Like.findOneAndDelete({
    likedBy: req.user._id,
    video: videoId,
  });

  if (existingLike) {
    return res.status(200).json(new ApiResponse(200, null, "Video unliked"));
  }

  await Like.create({
    likedBy: req.user._id,
    video: videoId,
  });

  return res.status(201).json(new ApiResponse(201, null, "Video liked"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const existingLike = await Like.findOneAndDelete({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (existingLike) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Comment unliked"));
  }

  await Like.create({
    comment: commentId,
    likedBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, null, "Comment liked"));
});


const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not exist");
  }

  const isTweetLiked = await Like.findOneAndDelete({
    likedBy: req.user._id,
    tweet: tweetId,
  });

  if (isTweetLiked) {
    return res.status(200).json(new ApiResponse(200, null, "Tweet unliked"));
  }
  await Like.create({
    likedBy: req.user._id,
    tweet: tweetId,
  });
  return res.status(201).json(new ApiResponse(201, null, "Tweet liked"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const likes = await Like.find({
    likedBy: userId,
    video: { $exists: true, $ne: null }, // $ne is used to exclude null values, $exists is used to check if the field exists
  })
    .populate({
      path: "video",
      populate: {
        path: "owner",
        select: "username avatar",
      },
    })
    .sort({ createdAt: -1 });

  const likedVideos = likes
    .filter((like) => like.video)
    .map((like) => like.video);

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
