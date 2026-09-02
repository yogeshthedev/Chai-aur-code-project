import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Image as ImageIcon,
  Save,
  Trash2,
  ExternalLink,
  Loader2,
  CheckCircle2,
  EyeOff,
  Plus,
  Clock,
  ListOrdered,
  Layers,
  AlertCircle
} from "lucide-react";
import {
  getVideoByIdApi,
  updateVideoApi,
  deleteVideoApi,
  togglePublishStatusApi,
  updateVideoChaptersApi,
} from "../api/video.api";
import ImageCropperModal from "../components/common/ImageCropperModal";
import { confirmToast } from "../utils/confirmToast";
import { useAuthStore } from "../store/useAuthStore";
import { formatTime } from "../components/player/useVideoPlayer";

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// Convert string "MM:SS" or "HH:MM:SS" or raw seconds to number in seconds
const parseTimeStringToSeconds = (timeStr) => {
  if (typeof timeStr === "number") return Math.max(0, timeStr);
  if (!timeStr || typeof timeStr !== "string") return 0;

  const parts = timeStr.trim().split(":").map(Number);
  if (parts.some((p) => isNaN(p))) {
    const fallback = Number(timeStr);
    return isNaN(fallback) ? 0 : Math.max(0, fallback);
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] || 0;
};

const EditVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState("general"); // 'general' | 'chapters'
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isThumbDragOver, setIsThumbDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Chapters state
  const [chapters, setChapters] = useState([]);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterTime, setNewChapterTime] = useState("");
  const [newChapterDesc, setNewChapterDesc] = useState("");

  const [cropperConfig, setCropperConfig] = useState({
    isOpen: false,
    imageSrc: "",
    cropType: "thumbnail",
    fileName: "",
  });

  const thumbnailInputRef = useRef(null);

  // Fetch current video details
  const { data: videoData, isLoading, isError } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideoByIdApi(videoId),
    enabled: Boolean(videoId),
    select: (response) => response?.data,
  });

  const video = videoData;

  // Initialize form state when video data is fetched
  useEffect(() => {
    if (video) {
      setTitle(video.title || "");
      setDescription(video.description || "");
      setThumbnailPreview(video.thumbnail || "");
      setChapters(
        Array.isArray(video.chapters)
          ? video.chapters.map((c) => ({
              title: c.title || "",
              startTime: c.startTime || 0,
              description: c.description || "",
            }))
          : []
      );
    }
  }, [video]);

  // Check ownership
  const currentUserId = user?._id?.toString();
  const videoOwnerId = (video?.owner?._id || video?.owner)?.toString();
  const isOwner = Boolean(currentUserId && videoOwnerId && currentUserId === videoOwnerId);

  // 1. Update Video Details (Title, Description, Thumbnail) Mutation
  const updateDetailsMutation = useMutation({
    mutationFn: async (formData) => {
      return await updateVideoApi(videoId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-videos"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Video details updated successfully!");
      setThumbnailFile(null);
      setUploadProgress(0);
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to update video details";
      toast.error(msg);
      setUploadProgress(0);
    },
  });

  // 2. Toggle Publish Status Mutation
  const togglePublishMutation = useMutation({
    mutationFn: () => togglePublishStatusApi(videoId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-videos"] });
      const isPub = response?.data?.isPublished;
      toast.success(isPub ? "Video is now Public" : "Video set to Draft / Private");
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to toggle publish status";
      toast.error(msg);
    },
  });

  // 3. Update Chapters Mutation
  const updateChaptersMutation = useMutation({
    mutationFn: (updatedChapters) => updateVideoChaptersApi(videoId, updatedChapters),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
      toast.success("Video chapters updated successfully!");
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to update video chapters";
      toast.error(msg);
    },
  });

  // 4. Delete Video Mutation
  const deleteVideoMutation = useMutation({
    mutationFn: () => deleteVideoApi(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-videos"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Video deleted successfully");
      navigate("/dashboard");
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to delete video";
      toast.error(msg);
    },
  });

  const processThumbnailFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WebP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropperConfig({
        isOpen: true,
        imageSrc: reader.result,
        cropType: "thumbnail",
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = (croppedBlob) => {
    if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    const previewUrl = URL.createObjectURL(croppedBlob);
    setThumbnailPreview(previewUrl);
    const file = new File([croppedBlob], cropperConfig.fileName || "thumbnail.jpg", {
      type: "image/jpeg",
    });
    setThumbnailFile(file);
    setCropperConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Video title cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    updateDetailsMutation.mutate(formData);
  };

  const handleAddChapter = (e) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) {
      toast.error("Chapter title is required");
      return;
    }

    const seconds = parseTimeStringToSeconds(newChapterTime);
    const updated = [
      ...chapters,
      {
        title: newChapterTitle.trim(),
        startTime: seconds,
        description: newChapterDesc.trim(),
      },
    ].sort((a, b) => a.startTime - b.startTime);

    setChapters(updated);
    setNewChapterTitle("");
    setNewChapterTime("");
    setNewChapterDesc("");
  };

  const handleRemoveChapter = (index) => {
    const updated = chapters.filter((_, i) => i !== index);
    setChapters(updated);
  };

  const handleSaveChapters = () => {
    updateChaptersMutation.mutate(chapters);
  };

  const handleDeleteVideo = () => {
    confirmToast({
      title: `Delete "${video?.title || "this video"}"?`,
      message: "This video will be permanently deleted from your channel. This action cannot be undone.",
      confirmText: "Delete Video",
      onConfirm: () => {
        deleteVideoMutation.mutate();
      },
    });
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-1/3 rounded bg-[#18181B] border border-white/6 animate-pulse" />
        <div className="h-64 w-full rounded-lg bg-[#18181B] border border-white/6 animate-pulse" />
        <div className="h-40 w-full rounded-lg bg-[#18181B] border border-white/6 animate-pulse" />
      </div>
    );
  }

  if (isError || !video) {
    return (
      <div className="rounded-lg border border-white/8 bg-[#121212] p-12 text-center space-y-4 my-10 max-w-lg mx-auto">
        <AlertCircle size={36} className="mx-auto text-[#EF4444]" />
        <h2 className="font-display font-bold text-lg text-[#FAFAF8]">Video Not Found</h2>
        <p className="font-mono text-xs text-[#71717A]">
          The video you are trying to edit does not exist or has been removed.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] px-4 py-2 font-mono text-xs font-bold text-[#0A0A0A]"
        >
          <ArrowLeft size={13} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="rounded-lg border border-white/8 bg-[#121212] p-12 text-center space-y-4 my-10 max-w-lg mx-auto">
        <AlertCircle size={36} className="mx-auto text-[#EF4444]" />
        <h2 className="font-display font-bold text-lg text-[#FAFAF8]">Access Denied</h2>
        <p className="font-mono text-xs text-[#71717A]">
          You are not authorized to edit this video. You can only manage content you own.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] px-4 py-2 font-mono text-xs font-bold text-[#0A0A0A]"
        >
          <ArrowLeft size={13} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-7 pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-white/8 pb-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1AA] hover:text-[#FF5A36] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Dashboard</span>
          <span className="text-white/20">/</span>
          <span className="text-[#FAFAF8] truncate max-w-xs">{video.title}</span>
          <span className="text-white/20">/</span>
          <span className="text-[#FF5A36]">Edit</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/videos/${videoId}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#18181B] hover:bg-[#222226] text-[#FAFAF8] px-3 py-1.5 text-xs font-mono transition"
            title="Preview video"
          >
            <ExternalLink size={12} />
            <span>View Video</span>
          </Link>

          <button
            type="button"
            onClick={handleDeleteVideo}
            disabled={deleteVideoMutation.isPending}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-[#EF4444] px-3 py-1.5 text-xs font-mono transition cursor-pointer"
          >
            <Trash2 size={12} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Header & Status Toggle Strip */}
      <div className="rounded-lg border border-white/8 bg-[#121212] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display font-black text-xl sm:text-2xl text-[#FAFAF8]">
              Edit Video
            </h1>
            <span
              className={`rounded-xs px-2 py-0.5 font-mono text-[10px] font-semibold border ${
                video.isPublished
                  ? "bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/20"
                  : "bg-[#E5A93C]/10 text-[#E5A93C] border-[#E5A93C]/20"
              }`}
            >
              {video.isPublished ? "Public" : "Draft / Unpublished"}
            </span>
          </div>
          <p className="text-xs font-mono text-[#71717A] mt-1">
            Update metadata, cover artwork, timeline chapters, and publish visibility.
          </p>
        </div>

        {/* Toggle Publish Quick Button */}
        <button
          type="button"
          onClick={() => togglePublishMutation.mutate()}
          disabled={togglePublishMutation.isPending}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 font-mono text-xs font-bold transition cursor-pointer self-start sm:self-auto ${
            video.isPublished
              ? "border border-white/10 bg-[#18181B] hover:bg-[#222226] text-[#FAFAF8]"
              : "bg-[#2DD4BF] hover:bg-[#20b8a5] text-[#0A0A0A]"
          }`}
        >
          {togglePublishMutation.isPending ? (
            <Loader2 size={13} className="animate-spin" />
          ) : video.isPublished ? (
            <EyeOff size={13} className="text-[#E5A93C]" />
          ) : (
            <CheckCircle2 size={13} />
          )}
          <span>{video.isPublished ? "Unpublish Video" : "Publish Video"}</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-3 border-b border-white/8 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-mono text-xs transition cursor-pointer ${
            activeTab === "general"
              ? "bg-[#FF5A36]/12 text-[#FF5A36] border border-[#FF5A36]/40 font-semibold"
              : "text-[#71717A] hover:text-[#FAFAF8]"
          }`}
        >
          <Layers size={13} />
          <span>General & Artwork</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("chapters")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-mono text-xs transition cursor-pointer ${
            activeTab === "chapters"
              ? "bg-[#FF5A36]/12 text-[#FF5A36] border border-[#FF5A36]/40 font-semibold"
              : "text-[#71717A] hover:text-[#FAFAF8]"
          }`}
        >
          <ListOrdered size={13} />
          <span>Video Chapters ({chapters.length})</span>
        </button>
      </div>

      {/* Tab 1: General & Artwork Form */}
      {activeTab === "general" && (
        <form onSubmit={handleSaveDetails} className="space-y-6">
          {/* Thumbnail Cover & Video Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thumbnail Cover Artwork */}
            <div className="space-y-2">
              <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
                16:9 Thumbnail Cover
              </label>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsThumbDragOver(true);
                }}
                onDragLeave={() => setIsThumbDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsThumbDragOver(false);
                  if (e.dataTransfer.files?.[0]) processThumbnailFile(e.dataTransfer.files[0]);
                }}
                onClick={() => thumbnailInputRef.current?.click()}
                className={`relative aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all overflow-hidden ${
                  isThumbDragOver
                    ? "border-[#FF5A36] bg-[#FF5A36]/5"
                    : thumbnailFile
                    ? "border-[#FF5A36]/50 bg-[#121212]"
                    : "border-white/10 bg-[#121212] hover:border-white/20 hover:bg-[#18181B]"
                }`}
              >
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && processThumbnailFile(e.target.files[0])}
                  className="hidden"
                />

                {thumbnailPreview ? (
                  <div className="relative h-full w-full group">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="h-full w-full object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity gap-1">
                      <ImageIcon size={18} className="text-[#FF5A36]" />
                      <span className="font-mono text-xs text-white">Click or drag new image to replace</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-[#18181B] text-[#FF5A36] border border-white/8">
                      <ImageIcon size={18} />
                    </div>
                    <div>
                      <p className="font-display font-bold text-xs text-[#FAFAF8]">
                        Upload Cover Artwork
                      </p>
                      <p className="font-mono text-[10px] text-[#71717A] mt-0.5">
                        1280x720 recommended (16:9)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {thumbnailFile && (
                <div className="flex items-center justify-between font-mono text-[11px] text-[#71717A] px-1">
                  <span className="truncate max-w-xs text-[#FF5A36]">New: {thumbnailFile.name}</span>
                  <span>{formatFileSize(thumbnailFile.size)}</span>
                </div>
              )}
            </div>

            {/* Video File Stream Info */}
            <div className="space-y-2">
              <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
                Video Stream Preview
              </label>

              <div className="relative aspect-video rounded-lg border border-white/10 bg-black overflow-hidden flex items-center justify-center">
                {video.videoFile ? (
                  <video
                    src={video.videoFile}
                    poster={video.thumbnail}
                    controls
                    className="h-full w-full object-contain rounded"
                  />
                ) : (
                  <div className="text-center font-mono text-xs text-[#71717A]">
                    No video stream loaded
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between font-mono text-[11px] text-[#71717A] px-1">
                <span>Duration: {formatTime(video.duration || 0)}</span>
                <span>Views: {video.views || 0}</span>
              </div>
            </div>
          </div>

          {/* Title & Description Fields */}
          <div className="rounded-lg border border-white/8 bg-[#121212] p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
                Video Title <span className="text-[#FF5A36]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Video title..."
                className="w-full rounded-md border border-white/10 bg-[#18181B] px-3.5 py-2.5 text-xs text-[#FAFAF8] placeholder:text-[#71717A] outline-none focus:border-[#FF5A36]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide context, references, or code links for your viewers..."
                rows={5}
                className="w-full rounded-md border border-white/10 bg-[#18181B] px-3.5 py-2.5 text-xs text-[#FAFAF8] placeholder:text-[#71717A] outline-none focus:border-[#FF5A36] resize-none"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/dashboard"
              className="rounded-md border border-white/10 bg-[#18181B] hover:bg-[#222226] px-4 py-2 font-mono text-xs text-[#FAFAF8] transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={updateDetailsMutation.isPending || !title.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] px-6 py-2 font-mono text-xs font-bold transition disabled:opacity-40 cursor-pointer shadow-sm"
            >
              {updateDetailsMutation.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Video Details</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Video Chapters Builder */}
      {activeTab === "chapters" && (
        <div className="space-y-6">
          {/* Add New Chapter Card */}
          <form
            onSubmit={handleAddChapter}
            className="rounded-lg border border-white/8 bg-[#121212] p-6 space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-white/8 pb-3">
              <Plus size={15} className="text-[#FF5A36]" />
              <h3 className="font-display font-bold text-sm text-[#FAFAF8]">
                Add Timeline Chapter
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Timestamp Input */}
              <div className="sm:col-span-3 space-y-1.5">
                <label className="block font-mono text-[11px] text-[#71717A] uppercase tracking-wider">
                  Timestamp (MM:SS)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newChapterTime}
                    onChange={(e) => setNewChapterTime(e.target.value)}
                    placeholder="e.g. 02:45"
                    className="w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#FAFAF8] font-mono placeholder:text-[#71717A] outline-none focus:border-[#FF5A36]"
                  />
                  <Clock size={12} className="absolute right-2.5 top-3 text-[#71717A] pointer-events-none" />
                </div>
              </div>

              {/* Chapter Title Input */}
              <div className="sm:col-span-5 space-y-1.5">
                <label className="block font-mono text-[11px] text-[#71717A] uppercase tracking-wider">
                  Chapter Title <span className="text-[#FF5A36]">*</span>
                </label>
                <input
                  type="text"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="e.g. Architecture Overview"
                  className="w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#FAFAF8] placeholder:text-[#71717A] outline-none focus:border-[#FF5A36]"
                />
              </div>

              {/* Optional Description */}
              <div className="sm:col-span-4 space-y-1.5">
                <label className="block font-mono text-[11px] text-[#71717A] uppercase tracking-wider">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={newChapterDesc}
                  onChange={(e) => setNewChapterDesc(e.target.value)}
                  placeholder="Summary of this segment"
                  className="w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#FAFAF8] placeholder:text-[#71717A] outline-none focus:border-[#FF5A36]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={!newChapterTitle.trim()}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36]/15 hover:bg-[#FF5A36]/25 text-[#FF5A36] border border-[#FF5A36]/30 px-3.5 py-1.5 font-mono text-xs font-bold transition disabled:opacity-40 cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Chapter</span>
              </button>
            </div>
          </form>

          {/* Chapters List */}
          <div className="rounded-lg border border-white/8 bg-[#121212] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <div className="flex items-center gap-2">
                <ListOrdered size={15} className="text-[#FF5A36]" />
                <h3 className="font-display font-bold text-sm text-[#FAFAF8]">
                  Configured Chapters ({chapters.length})
                </h3>
              </div>
              <span className="font-mono text-[11px] text-[#71717A]">
                Sorted chronologically by playback start time
              </span>
            </div>

            {chapters.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <p className="font-mono text-xs text-[#71717A]">
                  No chapters defined yet. Add chapter markers above to enable timeline breakdown for viewers.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/6">
                {chapters.map((chap, idx) => (
                  <div
                    key={idx}
                    className="py-3 flex items-center justify-between gap-4 group hover:bg-[#18181B]/40 px-2 rounded transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs font-bold text-[#FF5A36] bg-[#FF5A36]/10 px-2 py-0.5 rounded border border-[#FF5A36]/20 shrink-0">
                        {formatTime(chap.startTime)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-display font-bold text-xs text-[#FAFAF8] truncate">
                          {chap.title}
                        </p>
                        {chap.description && (
                          <p className="font-mono text-[11px] text-[#71717A] truncate">
                            {chap.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveChapter(idx)}
                      className="p-1.5 rounded text-[#71717A] hover:text-[#EF4444] hover:bg-white/6 transition cursor-pointer"
                      title="Remove chapter"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chapters Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/dashboard"
              className="rounded-md border border-white/10 bg-[#18181B] hover:bg-[#222226] px-4 py-2 font-mono text-xs text-[#FAFAF8] transition"
            >
              Cancel
            </Link>

            <button
              type="button"
              onClick={handleSaveChapters}
              disabled={updateChaptersMutation.isPending}
              className="inline-flex items-center gap-2 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] px-6 py-2 font-mono text-xs font-bold transition disabled:opacity-40 cursor-pointer shadow-sm"
            >
              {updateChaptersMutation.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving Chapters...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Chapters</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperConfig.isOpen}
        onClose={() => setCropperConfig((prev) => ({ ...prev, isOpen: false }))}
        imageSrc={cropperConfig.imageSrc}
        cropType={cropperConfig.cropType}
        onCropComplete={handleCroppedImage}
      />
    </div>
  );
};

export default EditVideo;
