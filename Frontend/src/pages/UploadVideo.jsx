import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Upload,
  Film,
  Image as ImageIcon,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { uploadVideoApi } from "../api/video.api";
import ImageCropperModal from "../components/common/ImageCropperModal";

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const UploadVideo = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [isVideoDragOver, setIsVideoDragOver] = useState(false);
  const [isThumbDragOver, setIsThumbDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cropperConfig, setCropperConfig] = useState({
    isOpen: false,
    imageSrc: "",
    cropType: "thumbnail",
    fileName: "",
  });

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const processVideoFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file (MP4, WebM, MOV)");
      return;
    }

    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
    setVideoFile(file);

    // If title is empty, infer from file name
    if (!title) {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      setTitle(cleanName);
    }
  };

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
    if (thumbnailPreview) {
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

  const uploadMutation = useMutation({
    mutationFn: (formData) =>
      uploadVideoApi(formData, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      }),
    onSuccess: (data) => {
      toast.success("Video published successfully!");
      setUploadProgress(100);
      navigate("/dashboard");
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to upload video";
      toast.error(msg);
      setUploadProgress(0);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!videoFile) {
      toast.error("Please select a video file");
      return;
    }
    if (!thumbnailFile) {
      toast.error("Please upload a 16:9 thumbnail cover");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a video title");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a video description");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);

    uploadMutation.mutate(formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-7 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/8 pb-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1AA] hover:text-[#FF5A36] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Dashboard</span>
          <span className="text-white/20">/</span>
          <span className="text-[#FAFAF8]">Upload Video</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1 & 2: Video & Thumbnail Dropzones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Video Dropzone */}
          <div className="space-y-2">
            <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
              1. Video File <span className="text-[#FF5A36]">*</span>
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsVideoDragOver(true);
              }}
              onDragLeave={() => setIsVideoDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsVideoDragOver(false);
                if (e.dataTransfer.files?.[0]) processVideoFile(e.dataTransfer.files[0]);
              }}
              onClick={() => videoInputRef.current?.click()}
              className={`relative aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all overflow-hidden ${
                isVideoDragOver
                  ? "border-[#FF5A36] bg-[#FF5A36]/5"
                  : videoFile
                  ? "border-white/20 bg-[#121212]"
                  : "border-white/10 bg-[#121212] hover:border-white/20 hover:bg-[#18181B]"
              }`}
            >
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files?.[0] && processVideoFile(e.target.files[0])}
                className="hidden"
              />

              {videoPreview ? (
                <div className="relative h-full w-full">
                  <video
                    src={videoPreview}
                    className="h-full w-full object-contain rounded"
                    controls
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-[#18181B] text-[#FF5A36] border border-white/8">
                    <Film size={18} />
                  </div>
                  <div>
                    <p className="font-display font-bold text-xs text-[#FAFAF8]">
                      Click or drag video file
                    </p>
                    <p className="font-mono text-[10px] text-[#71717A] mt-0.5">
                      MP4, WebM, MOV
                    </p>
                  </div>
                </div>
              )}
            </div>

            {videoFile && (
              <div className="flex items-center justify-between font-mono text-[11px] text-[#71717A] px-1">
                <span className="truncate max-w-xs text-[#A1A1AA]">{videoFile.name}</span>
                <span>{formatFileSize(videoFile.size)}</span>
              </div>
            )}
          </div>

          {/* Thumbnail Dropzone */}
          <div className="space-y-2">
            <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
              2. 16:9 Thumbnail Cover <span className="text-[#FF5A36]">*</span>
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
                  ? "border-white/20 bg-[#121212]"
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
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="font-mono text-xs text-white">Click to Change</span>
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
                <span className="truncate max-w-xs text-[#A1A1AA]">{thumbnailFile.name}</span>
                <span>{formatFileSize(thumbnailFile.size)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Title & Description */}
        <div className="rounded-lg border border-white/8 bg-[#121212] p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
              Video Title <span className="text-[#FF5A36]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Building High-Performance Distributed Systems in Rust"
              className="w-full rounded-md border border-white/10 bg-[#18181B] px-3.5 py-2.5 text-xs text-[#FAFAF8] placeholder:text-[#71717A] outline-none focus:border-[#FF5A36]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
              Description <span className="text-[#FF5A36]">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, references, or code links for your viewers..."
              rows={4}
              className="w-full rounded-md border border-white/10 bg-[#18181B] px-3.5 py-2.5 text-xs text-[#FAFAF8] placeholder:text-[#71717A] outline-none focus:border-[#FF5A36] resize-none"
            />
          </div>
        </div>

        {/* Upload Progress Bar */}
        {uploadMutation.isPending && (
          <div className="rounded-lg border border-white/8 bg-[#121212] p-4 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-[#71717A]">
              <span>Uploading to cloud storage...</span>
              <span className="text-[#FF5A36] font-bold">{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#18181B]">
              <div
                className="h-full bg-[#FF5A36] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Form Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/dashboard"
            className="rounded-md border border-white/10 bg-[#18181B] hover:bg-[#222226] px-4 py-2 font-mono text-xs text-[#FAFAF8] transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={uploadMutation.isPending || !videoFile || !thumbnailFile || !title.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] px-6 py-2 font-mono text-xs font-bold transition disabled:opacity-40 cursor-pointer shadow-sm"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Upload size={14} />
                <span>Publish Video</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Image Cropper Modal for 16:9 Crop */}
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

export default UploadVideo;
