import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  VideoOff,
  X,
  ListVideo,
  Play,
  Film,
  Share2,
  Check
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  deletePlaylistApi,
  getPlaylistByIdApi,
  removeVideoFromPlaylistApi,
  updatePlaylistApi,
} from "../api/playlist.api";
import { confirmToast } from "../utils/confirmToast";
import { formatTime } from "../components/player/useVideoPlayer";
import { useAuthStore } from "../store/useAuthStore";

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: () => getPlaylistByIdApi(playlistId),
    enabled: Boolean(playlistId),
    select: (response) => response?.data,
  });

  const playlist = data;
  const isOwner = Boolean(user?._id && (playlist?.owner?._id === user._id || playlist?.owner === user._id));

  const updateMutation = useMutation({
    mutationFn: updatePlaylistApi,
    onSuccess: () => {
      toast.success("Playlist updated successfully");
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to update playlist";
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlaylistApi,
    onSuccess: () => {
      toast.success("Playlist deleted");
      navigate("/playlists");
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to delete playlist";
      toast.error(msg);
    },
  });

  const removeVideoMutation = useMutation({
    mutationFn: removeVideoFromPlaylistApi,
    onSuccess: () => {
      toast.success("Video removed from playlist");
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to remove video";
      toast.error(msg);
    },
  });

  const handleSave = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a title");
      return;
    }

    updateMutation.mutate({
      playlistId,
      payload: {
        name: name.trim(),
        description: description.trim(),
      },
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Playlist link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="h-6 w-32 animate-pulse rounded bg-[#18181B]" />
        <div className="h-48 w-full animate-pulse rounded-lg bg-[#18181B]" />
      </div>
    );
  }

  if (isError || !playlist) {
    return (
      <div className="rounded-lg border border-white/8 bg-[#121212] p-12 text-center space-y-4 my-10 max-w-lg mx-auto">
        <h2 className="font-display font-bold text-lg text-[#FAFAF8]">Playlist Not Found</h2>
        <p className="font-mono text-xs text-[#71717A]">
          This playlist does not exist or may have been deleted.
        </p>
        <Link
          to="/playlists"
          className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] px-4 py-2 font-mono text-xs font-bold text-[#0A0A0A]"
        >
          <ArrowLeft size={13} />
          <span>Back to Playlists</span>
        </Link>
      </div>
    );
  }

  const videos = playlist.videos || [];
  const firstVideo = videos[0];
  const coverImage = firstVideo?.thumbnail;

  return (
    <div className="w-full space-y-7 pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-white/8 pb-3">
        <Link
          to="/playlists"
          className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#A1A1AA] hover:text-[#FF5A36] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Playlists</span>
          <span className="text-white/20">/</span>
          <span className="text-[#FAFAF8] truncate max-w-xs">{playlist.name}</span>
        </Link>
      </div>

      {/* Playlist Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Playlist Card */}
        <div className="lg:col-span-4 rounded-lg border border-white/8 bg-[#121212] p-5 space-y-5 lg:sticky lg:top-20">
          {/* Cover Artwork */}
          <div className="relative aspect-video lg:aspect-4/3 w-full overflow-hidden rounded-md bg-[#18181B] border border-white/8 flex items-center justify-center group">
            {coverImage ? (
              <img
                src={coverImage}
                alt={playlist.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#71717A] gap-2 p-6 text-center">
                <ListVideo size={36} />
                <span className="font-mono text-xs uppercase">Empty Playlist</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />

            {firstVideo && (
              <Link
                to={`/videos/${firstVideo._id}`}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF5A36] text-[#0A0A0A] shadow-xl hover:scale-105 transition-transform">
                  <Play size={20} className="fill-current ml-0.5" />
                </div>
              </Link>
            )}
          </div>

          {/* Metadata */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="rounded-xs bg-[#FF5A36]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#FF5A36] border border-[#FF5A36]/20">
                Collection
              </span>
              <span className="font-mono text-xs text-[#71717A]">
                {videos.length} {videos.length === 1 ? "video" : "videos"}
              </span>
            </div>

            <h1 className="font-display font-black text-xl sm:text-2xl text-[#FAFAF8] leading-snug">
              {playlist.name}
            </h1>

            {playlist.description && (
              <p className="font-sans text-xs leading-relaxed text-[#A1A1AA]">
                {playlist.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="pt-3 border-t border-white/6 flex flex-col gap-2">
              {firstVideo && (
                <Link
                  to={`/videos/${firstVideo._id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] py-2.5 px-4 font-mono text-xs font-bold transition active:scale-95 cursor-pointer shadow-sm"
                >
                  <Play size={14} className="fill-current" />
                  <span>Play All</span>
                </Link>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-white/10 bg-[#18181B] hover:bg-[#222226] py-2 text-xs font-mono text-[#FAFAF8] transition cursor-pointer"
                >
                  {copied ? <Check size={13} className="text-[#2DD4BF]" /> : <Share2 size={13} />}
                  <span>{copied ? "Copied" : "Share"}</span>
                </button>

                {isOwner && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setName(playlist.name || "");
                        setDescription(playlist.description || "");
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 rounded-md border border-white/10 bg-[#18181B] hover:bg-[#222226] text-[#FAFAF8] transition cursor-pointer"
                      title="Edit playlist"
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        confirmToast({
                          title: `Delete "${playlist.name}"?`,
                          message: "This playlist will be permanently deleted.",
                          confirmText: "Delete",
                          onConfirm: () => {
                            deleteMutation.mutate(playlistId);
                          },
                        });
                      }}
                      className="p-2 rounded-md border border-rose-900/30 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 transition cursor-pointer"
                      title="Delete playlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Video Sequence List */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between border-b border-white/8 pb-3">
            <div className="flex items-center gap-2">
              <Film size={15} className="text-[#FF5A36]" />
              <h2 className="font-display font-bold text-base text-[#FAFAF8]">
                Playlist Videos ({videos.length})
              </h2>
            </div>
          </div>

          {videos.length === 0 ? (
            <div className="rounded-lg border border-white/8 bg-[#121212] p-12 text-center space-y-3">
              <VideoOff size={32} className="mx-auto text-[#71717A]" />
              <h3 className="font-display font-bold text-sm text-[#FAFAF8]">
                No videos in this playlist
              </h3>
              <p className="font-mono text-xs text-[#71717A] max-w-xs mx-auto">
                Save videos to this playlist while browsing to build your collection.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] px-4 py-2 font-mono text-xs font-bold text-[#0A0A0A]"
              >
                Browse Videos
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {videos.map((video, idx) => {
                const numStr = (idx + 1).toString().padStart(2, "0");
                return (
                  <div
                    key={video._id}
                    className="flex items-center gap-3.5 rounded-lg border border-white/6 bg-[#121212] hover:bg-[#18181B] hover:border-white/16 p-3 transition-colors group"
                  >
                    {/* Track Number */}
                    <span className="font-mono text-xs font-bold text-[#71717A] group-hover:text-[#FF5A36] transition-colors w-6 text-center shrink-0">
                      {numStr}
                    </span>

                    {/* Thumbnail */}
                    <Link
                      to={`/videos/${video._id}`}
                      className="relative aspect-video h-16 w-28 shrink-0 overflow-hidden rounded bg-[#18181B] border border-white/8 cursor-pointer"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {video.duration !== undefined && (
                        <span className="absolute bottom-1 right-1 rounded-xs bg-black/90 px-1 py-0.2 font-mono text-[9px] text-[#FAFAF8]">
                          {formatTime(video.duration)}
                        </span>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/videos/${video._id}`}
                        className="font-display font-bold text-xs sm:text-sm text-[#FAFAF8] group-hover:text-[#FF5A36] transition-colors line-clamp-1 block"
                      >
                        {video.title}
                      </Link>

                      <div className="flex flex-wrap items-center gap-2 mt-1 font-mono text-[11px] text-[#71717A]">
                        <span className="text-[#A1A1AA]">
                          {video.owner?.fullName || video.owner?.username || "Creator"}
                        </span>
                      </div>
                    </div>

                    {/* Remove Action */}
                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => {
                          confirmToast({
                            title: "Remove from playlist?",
                            message: `Remove "${video.title}" from this playlist?`,
                            confirmText: "Remove",
                            onConfirm: () => {
                              removeVideoMutation.mutate({ playlistId, videoId: video._id });
                            },
                          });
                        }}
                        className="p-1.5 rounded text-[#71717A] hover:text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                        title="Remove from playlist"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Details Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setIsEditModalOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-lg border border-white/12 bg-[#121212] p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <h2 className="font-display font-bold text-sm text-[#FAFAF8]">
                Edit Playlist Details
              </h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded text-[#71717A] hover:text-[#FAFAF8]"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-mono text-xs text-[#71717A] uppercase tracking-wider">
                  Playlist Title
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#FAFAF8] outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs text-[#71717A] uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#FAFAF8] outline-none focus:border-[#FF5A36] resize-none"
                />
              </div>

              <div className="pt-2 border-t border-white/8 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 font-mono text-xs text-[#71717A] hover:text-[#FAFAF8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="rounded-md bg-[#FF5A36] hover:bg-[#FF704E] px-4 py-1.5 font-mono text-xs font-bold text-[#0A0A0A]"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;
