import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
      index: true,
    },
    timestamp: {
      type: Number, // Time in seconds (e.g. 145.2)
      required: true,
      default: 0,
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    codeSnippet: {
      type: String,
      default: "",
    },
    codeLanguage: {
      type: String,
      default: "javascript",
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly fetch notes for a user on a specific video sorted by timestamp
noteSchema.index({ user: 1, video: 1, timestamp: 1 });

export const Note = mongoose.model("Note", noteSchema);
