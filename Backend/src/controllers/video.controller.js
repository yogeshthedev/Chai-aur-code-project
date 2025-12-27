import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


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
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    


})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
