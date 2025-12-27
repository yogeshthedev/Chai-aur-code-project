import mongoose, { isValidObjectId, Mongoose } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id;

  // 1️⃣ Validate ObjectId
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  // 2️⃣ Prevent self-subscription
  if (channelId.toString() === userId.toString()) {
    throw new ApiError(400, "User cannot subscribe to himself");
  }

  // 3️⃣ Check if subscription already exists
  const existingSubscription = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });

  // 4️⃣ If exists → unsubscribe
  if (existingSubscription) {
    await Subscription.deleteOne({
      subscriber: userId,
      channel: channelId,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Unsubscribed successfully"));
  }

  // 5️⃣ Else → subscribe
  await Subscription.create({
    subscriber: userId,
    channel: channelId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Subscribed successfully"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  // check channel user exists
  const channelUser = await User.findById(channelId);
  if (!channelUser) {
    throw new ApiError(404, "Channel not found");
  }

  const subscribers = await Subscription.find({
    channel: channelId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber id");
  }

  // authorization: user can only view their own subscriptions
  if (req.user._id.toString() !== subscriberId.toString()) {
    throw new ApiError(403, "You are not allowed to view these subscriptions");
  }

  // check subscriber exists
  const subscriberUser = await User.findById(subscriberId);
  if (!subscriberUser) {
    throw new ApiError(404, "User not found");
  }

  const subscribedChannels = await Subscription.find({
    subscriber: subscriberId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannels,
        subscribedChannels.length === 0
          ? "User has not subscribed to any channels yet"
          : "Channels fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
