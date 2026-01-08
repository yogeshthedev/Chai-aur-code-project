import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "./../models/video.model.js";
import { Comment } from "./../models/comment.model.js";
import { Tweet } from "./../models/tweet.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const existingLike = await Like.findOne({
    likedBy: req.user._id,
    video: videoId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);

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
    throw new ApiError(400, "Invalid Comment ID");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // 🔹 Check if user already liked this comment
  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  // 🔹 Unlike
  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Comment unliked"));
  }

  // 🔹 Like
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
  //TODO: toggle like on tweet

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid TweetID");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not exist");
  }

  const isTweetLiked = await Like.findOne({
    likedBy: req.user._id,
    tweet: tweetId,
  });

  if (isTweetLiked) {
    await Like.findByIdAndDelete(isTweetLiked._id);
    return res.status(200).json(new ApiResponse(200, null, "Tweet unliked"));
  }
  await Like.create({
    likedBy: req.user._id,
    tweet: tweetId,
  });
  return res.status(201).json(new ApiResponse(201, null, "Tweet liked"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const userId = req.user._id;

  const likes = await Like.find({
    likedBy: userId,
    video: { $exists: true },
  })
    .populate({
      path: "video",
      populate: {
        path: "owner",
        select: "username avatar",
      },
    })
    .sort({ createdAt: -1 });

  const validLikes = likes.filter((like) => like.video !== null);

  const likedVideo = validLikes.map((like) => like.video);

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideo, "Liked videos fetched successfully")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
