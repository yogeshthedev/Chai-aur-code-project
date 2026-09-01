import mongoose, { isValidObjectId } from "mongoose";
import { Note } from "../models/note.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Format seconds into MM:SS or HH:MM:SS
const formatTimestamp = (seconds = 0) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const sFormatted = s < 10 ? `0${s}` : `${s}`;
  if (h > 0) {
    const mFormatted = m < 10 ? `0${m}` : `${m}`;
    return `${h}:${mFormatted}:${sFormatted}`;
  }
  return `${m}:${sFormatted}`;
};

// 1. Create Note
const createNote = asyncHandler(async (req, res) => {
  const { videoId, timestamp, title, content } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  if (!content || !content.trim()) {
    throw new ApiError(400, "Note content cannot be empty");
  }

  const note = await Note.create({
    user: req.user._id,
    video: videoId,
    timestamp: typeof timestamp === "number" ? Math.max(0, timestamp) : 0,
    title: title?.trim() || "",
    content: content.trim(),
    isPrivate: true,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note created successfully"));
});

// 2. Get Video Notes for Current User
const getVideoNotes = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  const notes = await Note.find({
    user: req.user._id,
    video: videoId,
  }).sort({ timestamp: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

// 3. Update Note
const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { title, content, timestamp } = req.body;

  if (!isValidObjectId(noteId)) {
    throw new ApiError(400, "Invalid Note ID");
  }

  const note = await Note.findById(noteId);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  if (note.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You do not have permission to edit this note");
  }

  if (content !== undefined) {
    if (!content.trim()) throw new ApiError(400, "Content cannot be empty");
    note.content = content.trim();
  }

  if (title !== undefined) note.title = title.trim();
  if (typeof timestamp === "number") note.timestamp = Math.max(0, timestamp);

  await note.save();

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note updated successfully"));
});

// 4. Delete Note
const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  if (!isValidObjectId(noteId)) {
    throw new ApiError(400, "Invalid Note ID");
  }

  const note = await Note.findById(noteId);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  if (note.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You do not have permission to delete this note");
  }

  await Note.findByIdAndDelete(noteId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Note deleted successfully"));
});

// 5. Export Notes as Markdown
const exportNotes = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  const video = await Video.findById(videoId);
  const notes = await Note.find({
    user: req.user._id,
    video: videoId,
  }).sort({ timestamp: 1 });

  let markdown = `# Notes: ${video?.title || "Video Notes"}\n\n`;
  markdown += `*Saved by ${req.user.fullName || req.user.username} on ${new Date().toLocaleDateString()}*\n\n---\n\n`;

  if (notes.length === 0) {
    markdown += `*No notes recorded for this video.*\n`;
  } else {
    notes.forEach((n, idx) => {
      const timeTag = formatTimestamp(n.timestamp);
      markdown += `### ${idx + 1}. [${timeTag}] ${n.title || "Note"}\n\n`;
      markdown += `${n.content}\n\n`;
      markdown += `---\n\n`;
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { markdown, count: notes.length }, "Notes exported successfully"));
});

export {
  createNote,
  getVideoNotes,
  updateNote,
  deleteNote,
  exportNotes,
};
