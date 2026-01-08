import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Like } from "./../models/like.model.js";
import { Subscription } from "./../models/subscription.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  // 1️⃣ Parse pagination
  page = Number(page);
  limit = Number(limit);
  const skip = (page - 1) * limit;

  // 2️⃣ Build filter dynamically
  const filter = {
    isPublished: true, // public API → only published videos
  };

  // 3️⃣ Filter by user (channel videos)
  if (userId && isValidObjectId(userId)) {
    filter.owner = userId;
  }

  // 4️⃣ Apply search query
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  // 5️⃣ Sorting logic
  const allowedSortFields = ["createdAt", "title"];
  let sortField = "createdAt";
  let sortDirection = -1;

  if (allowedSortFields.includes(sortBy)) {
    sortField = sortBy;
  }

  if (sortType === "asc") {
    sortDirection = 1;
  }

  const sortOptions = { [sortField]: sortDirection };

  // 6️⃣ Fetch videos
  const videos = await Video.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  // 7️⃣ Total count for pagination
  const totalVideos = await Video.countDocuments(filter);

  // 8️⃣ Return response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        currentPage: page,
        totalPages: Math.ceil(totalVideos / limit),
        totalVideos,
      },
      "Videos fetched successfully"
    )
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // 1️⃣ Validate text fields
  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  // 2️⃣ Validate files
  if (!req.files || !req.files.video || !req.files.thumbnail) {
    throw new ApiError(400, "Video file and thumbnail are required");
  }

  const videoFilePath = req.files.video[0].path;
  const thumbnailFilePath = req.files.thumbnail[0].path;

  // 3️⃣ Upload files to Cloudinary
  const uploadedVideo = await uploadOnCloudinary(videoFilePath);
  const uploadedThumbnail = await uploadOnCloudinary(thumbnailFilePath);

  if (!uploadedVideo?.secure_url || !uploadedThumbnail?.secure_url) {
    throw new ApiError(500, "Failed to upload files to Cloudinary");
  }

  // 4️⃣ Create video document
  const video = await Video.create({
    title: title.trim(),
    description: description.trim(),
    videoFile: uploadedVideo.secure_url,
    thumbnail: uploadedThumbnail.secure_url,
    duration: uploadedVideo.duration || 0,
    owner: req.user._id,
    isPublished: true, // draft by default
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const userId = req.user?._id;

  let video = await Video.findById(videoId).populate(
    "owner",
    "username avatar fullname"
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const isOwner = userId && video.owner._id.toString() === userId.toString();

  if (!video.isPublished && !isOwner) {
    throw new ApiError(403, "This video is not published yet");
  }

  if (!isOwner) {
    video = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("owner", "fullname avatar");
  }

  const likeCount = await Like.countDocuments({ video: videoId });

  let isLiked = false;
  if (userId) {
    const liked = await Like.findOne({
      video: videoId,
      likedBy: userId,
    });
    isLiked = Boolean(liked);
  }

  const subscriberCount = await Subscription.countDocuments({
    channel: video.owner._id,
  });

  let isSubscribed = false;
  if (userId) {
    const subscribed = await Subscription.findOne({
      channel: video.owner._id,
      subscriber: userId,
    });
    isSubscribed = Boolean(subscribed);
  }

  const videoResponse = {
    ...video.toObject(),
    likeCount,
    isLiked,
    owner: {
      ...video.owner.toObject(),
      subscriberCount,
      isSubscribed,
    },
  };

  return res
    .status(200)
    .json(new ApiResponse(200, videoResponse, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid id");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video does not exist");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update video");
  }
  const { title, description } = req.body;

  if (!title && !description && !req.files?.thumbnail) {
    throw new ApiError(400, "Nothing to update");
  }
  if (title && title.trim()) {
    video.title = title.trim();
  }

  if (description && description.trim()) {
    video.description = description.trim();
  }

  if (req.files?.thumbnail) {
    const thumbnailPath = req.files.thumbnail[0].path;
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailPath);

    if (!uploadedThumbnail?.secure_url) {
      throw new ApiError(500, "Failed to upload thumbnail");
    }

    video.thumbnail = uploadedThumbnail.secure_url;
  }
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video update succesffulyy"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById({ _id: videoId });

  if (!video) {
    throw new ApiError(404, "Video does not exist");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete video");
  }

  await Video.deleteOne(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video delete successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video does not exist");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to change publish status");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isPublished: video.isPublished },
        `Video is now ${video.isPublished ? "published" : "unpublished"}`
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
