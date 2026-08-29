import { useMutation } from "@tanstack/react-query";
import { CloudUpload, Film, ImageUp, X, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { uploadVideoApi } from "../api/video.api";

const UploadVideo = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const mutation = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("video", videoFile);
      formData.append("thumbnail", thumbnailFile);
      return uploadVideoApi(formData);
    },
    onSuccess: () => {
      toast.success("Video uploaded successfully!");
      navigate("/");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Unable to upload video";
      toast.error(message);
    },
  });

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim() || !description.trim() || !videoFile || !thumbnailFile) {
      toast.error("Title, description, video file, and thumbnail are required.");
      return;
    }

    mutation.mutate();
  };

  return (
    <div className="w-full max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500 mb-2">
          <Sparkles size={13} />
          <span>Creator Studio</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-(--text-primary)">
          Upload a new video
        </h1>
        <p className="text-xs text-(--text-muted) mt-1">
          Share your video content with viewers around the world
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 md:p-8 shadow-sm"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column: Title & Description */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Give your video an engaging title"
                className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-900 px-4 py-3 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none transition focus:ring-2 focus:ring-red-500/20 focus:border-red-500/80"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Tell viewers what your video is about, include hashtags or links"
                rows={8}
                className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-900 px-4 py-3 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none transition focus:ring-2 focus:ring-red-500/20 focus:border-red-500/80 resize-none"
              />
            </div>
          </div>

          {/* Right Column: Video File & Thumbnail Picker */}
          <div className="space-y-4">
            {/* Video File Dropzone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Video File <span className="text-red-500">*</span>
              </label>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50/60 dark:bg-zinc-900/40 p-5 text-center text-slate-500 dark:text-zinc-400 transition hover:border-red-500 hover:text-red-500 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200/70 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 group-hover:text-red-500 transition">
                  <Film size={20} />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-red-500">
                    {videoFile ? videoFile.name : "Click to select video"}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-0.5">MP4, WebM, MOV</p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoChange}
                />
              </label>
              {videoPreview && (
                <video
                  src={videoPreview}
                  controls
                  className="mt-2 aspect-video w-full rounded-2xl bg-black object-contain border border-slate-300 dark:border-zinc-800"
                />
              )}
            </div>

            {/* Thumbnail Dropzone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Thumbnail <span className="text-red-500">*</span>
              </label>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50/60 dark:bg-zinc-900/40 p-5 text-center text-slate-500 dark:text-zinc-400 transition hover:border-red-500 hover:text-red-500 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200/70 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 group-hover:text-red-500 transition">
                  <ImageUp size={20} />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-red-500">
                    {thumbnailFile ? thumbnailFile.name : "Click to select thumbnail"}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-0.5">PNG, JPG, WebP</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailChange}
                />
              </label>
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="mt-2 aspect-video w-full rounded-2xl bg-slate-100 dark:bg-zinc-800 object-cover border border-slate-300 dark:border-zinc-800"
                />
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-zinc-800/80 pt-5">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-zinc-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <X size={14} /> Cancel
          </button>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-red-500/20 hover:bg-red-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <CloudUpload size={16} />
            <span>{mutation.isPending ? "Uploading Video..." : "Publish Video"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadVideo;


