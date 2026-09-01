import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Tweet is empty");
  }

  const newTweet = await Tweet.create({
    content,
    owner: user,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newTweet, "Create Tweet Successfully!"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(404, "User is not available");
  }

  const tweets = await Tweet.find({ owner: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweet Fetched Successfully!"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body || {};

  // 1. Validate tweetId
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  // 2. Validate content
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Tweet content is required");
  }

  // 3. Find tweet
  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  // 4. Ownership check
  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this tweet");
  }

  // 5. Update tweet
  tweet.content = content;
  await tweet.save();

  // 6. Send response
  res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this tweet");
  }

  await Tweet.deleteOne({ _id: tweetId });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
