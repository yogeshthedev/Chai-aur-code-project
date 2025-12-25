import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet

  const user = req.user._id;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Tweet is empty");
  }

  const createTweet = await Tweet.create({
    content,
    owner: user,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, createTweet, "Create Tweet Successfully!"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets

  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(404, "User is not available");
  }

  const getUserTweets = await Tweet.find({ owner: userId });

  return res
    .status(201)
    .json(new ApiResponse(200, getUserTweets, "Tweet Fetched Successfully!"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

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
  //TODO: delete tweet

  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  const tweet = await Tweet.findById({ tweetId });
  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this tweet");
  }

  await Tweet.deleteOne({ _id: tweetId });


   res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet Deleted successfully"));

});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
