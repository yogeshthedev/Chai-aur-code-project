import React, { useState, useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import {
  Play,
  MoreVertical,
  ListPlus,
  Share2,
  Check,
  ExternalLink,
  Download,
  Pencil,
  Trash2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { formatTime } from "../player/useVideoPlayer";
import SaveToPlaylistModal from "../SaveToPlaylistModal";
import { useAuthStore } from "../../store/useAuthStore";
import { deleteVideoApi } from "../../api/video.api";
import { confirmToast } from "../../utils/confirmToast";

const formatViews = (views = 0) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
};

const VideoCard = ({ video, onDelete }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  // Close menu on click outside or escape key
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  if (!video) return null;

  const currentUserId = user?._id?.toString();
  const videoOwnerId = (video.owner?._id || video.owner)?.toString();
  const isOwner = Boolean(currentUserId && videoOwnerId && currentUserId === videoOwnerId);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteVideoApi(video._id),
    onSuccess: () => {
      toast.success("Video deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["channel"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
      queryClient.invalidateQueries({ queryKey: ["liked-videos"] });
      if (onDelete) onDelete(video._id);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete video");
    },
  });

  const handleToggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handleSaveToPlaylist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMenuOpen(false);
    if (!isAuthenticated) {
      toast.error("Please sign in to save videos to a playlist");
      return;
    }
    setIsPlaylistModalOpen(true);
  };

  const handleCopyLink = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMenuOpen(false);
    try {
      const videoUrl = `${window.location.origin}/videos/${video._id}`;
      await navigator.clipboard.writeText(videoUrl);
      setCopied(true);
      toast.success("Video link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy video link");
    }
  };

  const handleOpenInNewTab = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMenuOpen(false);
    window.open(`/videos/${video._id}`, "_blank");
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMenuOpen(false);
    if (!video.videoFile) {
      toast.error("Video file unavailable for download");
      return;
    }
    const link = document.createElement("a");
    link.href = video.videoFile;
    link.download = `${video.title || "video"}.mp4`;
    link.target = "_blank";
    link.rel = "noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started");
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMenuOpen(false);
    navigate(`/videos/${video._id}/edit`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMenuOpen(false);
    confirmToast({
      title: "Delete Video?",
      message: `Are you sure you want to delete "${video.title}"? This action cannot be undone.`,
      confirmText: "Delete",
      onConfirm: () => deleteMutation.mutate(),
    });
  };

  return (
    <div
      className={`group flex flex-col min-w-0 transition-colors duration-150 ${
        isMenuOpen ? "relative z-30" : ""
      }`}
    >
      {/* Video Thumbnail Frame (16:9 ratio, 8px radius, subtle border) */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[#121212] border border-white/8 transition-all duration-200 group-hover:border-white/20">
        <Link to={`/videos/${video._id}`} className="block h-full w-full">
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-75 transition-opacity duration-200" />

          {/* Center Play Icon on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF5A36] text-[#0A0A0A] shadow-xl">
              <Play size={18} className="fill-current ml-0.5" />
            </div>
          </div>
        </Link>

        {/* Bottom Duration Badge (JetBrains Mono) */}
        {video.duration !== undefined && (
          <div className="absolute bottom-2 right-2 rounded-xs bg-[#0A0A0A]/90 px-1.5 py-0.5 text-[10px] font-mono text-[#FAFAF8] border border-white/10 backdrop-blur-md">
            {formatTime(video.duration)}
          </div>
        )}
      </div>

      {/* Video Details & Meta Information */}
      <div className="mt-3 flex gap-3 min-w-0">
        {/* Channel Avatar */}
        <Link
          to={video.owner?.username ? `/c/${video.owner.username}` : "#"}
          className="shrink-0 pt-0.5 group/avatar"
        >
          {video.owner?.avatar ? (
            <img
              src={video.owner.avatar}
              alt={video.owner.username || "Channel"}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10 group-hover/avatar:ring-[#FF5A36] transition-all duration-150"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-[#FAFAF8] ring-1 ring-white/10">
              {video.owner?.username ? video.owner.username.slice(0, 1).toUpperCase() : "U"}
            </div>
          )}
        </Link>

        {/* Video Title & Secondary Metadata */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1.5">
            <Link to={`/videos/${video._id}`} className="block flex-1 min-w-0">
              <h3 className="font-display font-bold text-sm sm:text-[15px] leading-snug text-[#FAFAF8] line-clamp-2 transition-colors duration-150 group-hover:text-[#FF5A36]">
                {video.title}
              </h3>
            </Link>

            {/* Three dots quick action menu button */}
            <div className="relative shrink-0" ref={menuRef}>
              <button
                type="button"
                onClick={handleToggleMenu}
                title="More options"
                aria-label="More options"
                aria-expanded={isMenuOpen}
                className={`p-1 rounded-full transition-all cursor-pointer ${
                  isMenuOpen
                    ? "bg-white/15 text-[#FAFAF8]"
                    : "text-[#71717A] hover:text-[#FAFAF8] hover:bg-white/10"
                }`}
              >
                <MoreVertical size={18} />
              </button>

              {/* Quick Actions Dropdown Menu */}
              {isMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-1.5 z-50 w-48 rounded-xl bg-[#18181B] border border-white/12 shadow-2xl py-1.5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={handleSaveToPlaylist}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#FAFAF8] hover:bg-white/10 hover:text-[#FF5A36] transition cursor-pointer text-left font-medium"
                  >
                    <ListPlus size={14} className="shrink-0 text-[#A1A1AA]" />
                    <span>Save to playlist</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#FAFAF8] hover:bg-white/10 hover:text-[#FF5A36] transition cursor-pointer text-left font-medium"
                  >
                    {copied ? (
                      <Check size={14} className="shrink-0 text-emerald-400" />
                    ) : (
                      <Share2 size={14} className="shrink-0 text-[#A1A1AA]" />
                    )}
                    <span>{copied ? "Link copied!" : "Share / Copy link"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenInNewTab}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#FAFAF8] hover:bg-white/10 hover:text-[#FF5A36] transition cursor-pointer text-left font-medium"
                  >
                    <ExternalLink size={14} className="shrink-0 text-[#A1A1AA]" />
                    <span>Open in new tab</span>
                  </button>

                  {video.videoFile && (
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#FAFAF8] hover:bg-white/10 hover:text-[#FF5A36] transition cursor-pointer text-left font-medium"
                    >
                      <Download size={14} className="shrink-0 text-[#A1A1AA]" />
                      <span>Download video</span>
                    </button>
                  )}

                  {isOwner && (
                    <>
                      <div className="my-1 border-t border-white/8" />

                      <button
                        type="button"
                        onClick={handleEdit}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#FAFAF8] hover:bg-white/10 hover:text-[#FF5A36] transition cursor-pointer text-left font-medium"
                      >
                        <Pencil size={14} className="shrink-0 text-[#A1A1AA]" />
                        <span>Edit video</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition cursor-pointer text-left font-medium disabled:opacity-50"
                      >
                        <Trash2 size={14} className="shrink-0 text-rose-400" />
                        <span>{deleteMutation.isPending ? "Deleting..." : "Delete video"}</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Channel Name */}
          <div className="mt-1 flex items-center gap-1.5 truncate text-xs font-medium text-[#A1A1AA] hover:text-[#FAFAF8] transition-colors">
            <Link
              to={video.owner?.username ? `/c/${video.owner.username}` : "#"}
              className="truncate hover:underline"
            >
              {video.owner?.fullName || video.owner?.username || "Creator"}
            </Link>
          </div>

          {/* Metrics Line (Views • Timestamp) */}
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-mono text-[#71717A]">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>
              {video.createdAt
                ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })
                : "Recently"}
            </span>
          </div>
        </div>
      </div>

      {/* Save to Playlist Modal */}
      {isPlaylistModalOpen && (
        <SaveToPlaylistModal
          isOpen={isPlaylistModalOpen}
          onClose={() => setIsPlaylistModalOpen(false)}
          videoId={video._id}
        />
      )}
    </div>
  );
};

export default VideoCard;
