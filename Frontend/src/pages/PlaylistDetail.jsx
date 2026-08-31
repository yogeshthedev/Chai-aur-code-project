import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  VideoOff,
  X,
  ListVideo,
  Sparkles,
  Play,
  Film,
  Layers,
  User,
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
import VideoCard from "../components/video/VideoCard";
import { confirmToast } from "../utils/confirmToast";

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: () => getPlaylistByIdApi(playlistId),
    enabled: Boolean(playlistId),
    select: (response) => response?.data,
  });

  const playlist = data;

  const updateMutation = useMutation({
    mutationFn: updatePlaylistApi,
    onSuccess: () => {
      toast.success("Playlist updated successfully");
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Unable to update playlist";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlaylistApi,
    onSuccess: () => {
      toast.success("Playlist deleted");
      navigate("/playlists");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Unable to delete playlist";
      toast.error(message);
    },
  });

  const removeVideoMutation = useMutation({
    mutationFn: removeVideoFromPlaylistApi,
    onSuccess: () => {
      toast.success("Video removed from playlist");
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Unable to remove video";
      toast.error(message);
    },
  });

  const handleSave = (event) => {
    event.preventDefault();
    if (!name.trim() && !description.trim()) {
      toast.error("Enter a name or description to update");
      return;
    }

    updateMutation.mutate({
      playlistId,
      payload: {
        ...(name.trim() ? { name: name.trim() } : {}),
        ...(description.trim() ? { description: description.trim() } : {}),
      },
    });
  };

  const handleDeletePlaylist = () => {
    confirmToast({
      title: `Delete playlist "${playlist?.name}"?`,
      message: "This playlist collection will be permanently deleted.",
      confirmText: "Delete Playlist",
      onConfirm: () => {
        const promise = deleteMutation.mutateAsync(playlistId);
        toast.promise(promise, {
          loading: "Deleting playlist...",
          success: "Playlist deleted",
          error: "Unable to delete playlist",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="h-6 w-32 animate-pulse rounded-lg bg-slate-200/80 dark:bg-zinc-800" />
        <div className="h-64 w-full animate-pulse rounded-3xl bg-slate-200/80 dark:bg-zinc-800" />
      </div>
    );
  }

  if (isError || !playlist) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/50 p-8 text-center my-12 shadow-xs">
        <h2 className="text-lg font-bold text-rose-700 dark:text-rose-300">Playlist not found</h2>
        <p className="mt-1 text-xs text-rose-600/80 dark:text-rose-400/80">
          This playlist may have been deleted or does not exist.
        </p>
        <Link
          to="/playlists"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-300 dark:border-zinc-700 px-5 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-700 transition shadow-xs"
        >
          <ArrowLeft size={14} /> Back to playlists
        </Link>
      </div>
    );
  }

  const videos = playlist.videos || [];
  const firstVideo = videos[0];
  const coverImage = firstVideo?.thumbnail;

  return (
    <div className="w-full space-y-8">
      {/* Top Breadcrumb */}
      <Link
        to="/playlists"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft size={15} /> Back to collections
      </Link>

      {/* Playlist Hero Showcase Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-gradient-to-br from-indigo-50/80 via-white to-slate-50/80 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-950 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
          {/* Album Cover Art */}
          <div className="relative aspect-video md:aspect-square w-full md:w-56 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-800 shadow-xl flex items-center justify-center group">
            {coverImage ? (
              <img
                src={coverImage}
                alt={playlist.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-white/90 gap-2 p-6 text-center">
                <ListVideo size={36} />
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">Collection</span>
              </div>
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {firstVideo && (
                <Link
                  to={`/videos/${firstVideo._id}`}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-indigo-600 shadow-xl transform scale-90 group-hover:scale-100 transition-transform"
                >
                  <Play size={20} className="fill-current ml-0.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Playlist Info & Meta */}
          <div className="min-w-0 flex-1 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <Sparkles size={13} />
              <span>Playlist Collection</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 leading-tight">
              {playlist.name}
            </h1>

            <p className="text-xs md:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              {playlist.description || "No description provided."}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500 dark:text-zinc-400">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {videos.length} {videos.length === 1 ? "video" : "videos"}
              </span>
              <span>•</span>
              <span>
                Created {playlist.createdAt ? new Date(playlist.createdAt).toLocaleDateString() : "recently"}
              </span>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {firstVideo && (
                <Link
                  to={`/videos/${firstVideo._id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-indigo-500/25 active:scale-95 transition cursor-pointer"
                >
                  <Play size={15} className="fill-current" />
                  <span>Play All</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setName(playlist.name || "");
                  setDescription(playlist.description || "");
                  setIsEditModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 active:scale-95 transition cursor-pointer shadow-xs"
              >
                <Edit3 size={14} />
                <span>Edit Playlist</span>
              </button>

              <button
                type="button"
                onClick={handleDeletePlaylist}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 dark:border-rose-900/40 bg-rose-50/60 dark:bg-rose-950/30 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 active:scale-95 transition cursor-pointer shadow-xs"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-800/80 pb-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
            Playlist Videos ({videos.length})
          </h2>
        </div>

        {videos.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/20 p-8 text-center text-slate-500 dark:text-zinc-400">
            <VideoOff size={32} className="mb-2 text-slate-400 dark:text-zinc-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">No videos in this playlist</h3>
            <p className="mt-1 text-xs max-w-xs">
              Browse videos in the feed and click "Save" on any video to add it to this collection.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition"
            >
              Browse Videos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-x-5 gap-y-8">
            {videos.map((video) => (
              <div key={video._id} className="relative group">
                <VideoCard video={video} />
                <button
                  type="button"
                  onClick={() => {
                    confirmToast({
                      title: "Remove from playlist?",
                      message: `Remove "${video.title}" from this collection?`,
                      confirmText: "Remove",
                      onConfirm: () => {
                        const promise = removeVideoMutation.mutateAsync({ playlistId, videoId: video._id });
                        toast.promise(promise, {
                          loading: "Removing video...",
                          success: "Video removed from playlist",
                          error: "Unable to remove video",
                        });
                      },
                    });
                  }}
                  className="absolute right-2.5 top-2.5 z-10 rounded-full bg-black/80 hover:bg-rose-600 p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer shadow-md backdrop-blur-xs"
                  aria-label="Remove video from playlist"
                  title="Remove from playlist"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Details Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsEditModalOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-3xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800/80">
              <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                Edit Playlist Details
              </h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  Playlist Title
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-800/70 px-4 py-2.5 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-800/70 px-4 py-2.5 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition cursor-pointer"
                >
                  <span>{updateMutation.isPending ? "Saving..." : "Save Changes"}</span>
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


