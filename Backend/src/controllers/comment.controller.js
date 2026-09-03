import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "./../models/video.model.js";
import { Like } from "./../models/like.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  let { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const videoExists = await Video.findById(videoId);
  if (!videoExists) {
    throw new ApiError(404, "Video not found");
  }

  page = Number(page);
  limit = Number(limit);

  if (!Number.isInteger(page) || page < 1) {
    throw new ApiError(400, "Page must be a positive integer");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new ApiError(400, "Limit must be between 1 and 100");
  }

  const skip = (page - 1) * limit;

  const videoObjectId = new mongoose.Types.ObjectId(videoId);
  const currentUserId = req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null;

  const comments = await Comment.aggregate([
    {
      $match: {
        $or: [
          { video: videoObjectId },
          { video: videoId },
        ],
      },
    },
    {
      $sort: { // newest first
        createdAt: -1,
      },
    },
    { // pagination
      $skip: skip,
    },
    {
      $limit: limit,
    },
    { // populate owner
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: {
        path: "$owner",
        preserveNullAndEmptyArrays: true,
      },
    },
    { // find likes for each comment
      $lookup: {
        from: "likes",
        let: {
          commentId: "$_id",
        },
        pipeline: [ // find likes for this comment
          {
            $match: {
              $expr: {
                $eq: ["$comment", "$$commentId"],
              },
            },
          },
          {
            $group: { // count likes and check current user
              _id: null,
              likeCount: {
                $sum: 1,
              },
              likedByCurrentUser: {
                $max: {
                  $cond: [
                    { $eq: ["$likedBy", currentUserId] },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
        as: "likeStats",
      },
    },
    {
      $project: { // return clean data
        content: 1,
        video: 1,
        createdAt: 1,
        updatedAt: 1,
        owner: {
          _id: 1,
          fullName: 1,
          username: 1,
          avatar: 1,
        },
        likeCount: { // if likeStats is empty, return 0
          $ifNull: [
            { $arrayElemAt: ["$likeStats.likeCount", 0] },
            0,
          ],
        },
        isLiked: { // if likeStats is empty, return false
          $eq: [
            {
              $ifNull: [
                { $arrayElemAt: ["$likeStats.likedByCurrentUser", 0] },
                0,
              ],
            },
            1,
          ],
        },
      },
    },
  ]);

  const totalComments = await Comment.countDocuments({
    $or: [
      { video: videoObjectId },
      { video: videoId },
    ],
  });


  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
        currentPage: page,
        totalPages: Math.ceil(totalComments / limit),
        totalComments,
      },
      "Comments fetched successfully"
    )
  );
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  if (typeof content !== "string" || !content.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const videoExists = await Video.findById(videoId);
  if (!videoExists) {
    throw new ApiError(404, "Video not found");
  }

  const comment = await Comment.create({
    content: content.trim(),
    video: videoId,
    owner: req.user._id,
  });

  const populatedComment = await comment.populate(
    "owner",
    "fullName username avatar"
  );


  const commentResponse = {
    ...populatedComment.toObject(), // why we use toObject() here? because we want to convert the mongoose document to a plain javascript object so that we can add new fields to it
    likeCount: 0,
    isLiked: false,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, commentResponse, "Comment added successfully"));
});


const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  if (typeof content !== "string" || !content.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this comment");
  }

  comment.content = content.trim();
  await comment.save();

  const populatedComment = await comment.populate("owner", "fullName username avatar");
  const likeCount = await Like.countDocuments({ comment: comment._id });
  const isLiked = Boolean(
    await Like.exists({
      comment: comment._id,
      likedBy: req.user._id,
    })
  );

  const updatedComment = {
    ...populatedComment.toObject(),
    likeCount,
    isLiked,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this comment");
  }

  await comment.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
