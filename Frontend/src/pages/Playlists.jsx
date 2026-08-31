import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  ListVideo,
  Play,
  Sparkles,
  Layers,
  Film,
  X,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { createPlaylistApi, deletePlaylistApi, getUserPlaylistsApi } from "../api/playlist.api";
import { useAuthStore } from "../store/useAuthStore";
import { confirmToast } from "../utils/confirmToast";

const Playlists = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["playlists", user?._id],
    queryFn: () => getUserPlaylistsApi(user?._id),
    enabled: Boolean(user?._id),
    select: (response) => response?.data ?? [],
  });

  const playlists = data ?? [];

  const createMutation = useMutation({
    mutationFn: createPlaylistApi,
    onSuccess: () => {
      toast.success("Playlist created successfully!");
      setName("");
      setDescription("");
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["playlists", user?._id] });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Unable to create playlist";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlaylistApi,
    onSuccess: () => {
      toast.success("Playlist deleted");
      queryClient.invalidateQueries({ queryKey: ["playlists", user?._id] });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Unable to delete playlist";
      toast.error(message);
    },
  });

  const handleCreate = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a playlist name");
      return;
    }
    createMutation.mutate({ name: name.trim(), description: description.trim() });
  };

  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            <Sparkles size={13} />
            <span>Curated Collections</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
            Playlists
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Organize, categorize, and loop your favorite videos in custom collections
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 active:scale-95 transition-all duration-200 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="animate-pulse space-y-3">
              <div className="aspect-video w-full rounded-2xl bg-slate-200/80 dark:bg-zinc-800/80" />
              <div className="h-4 w-3/4 rounded-md bg-slate-200/80 dark:bg-zinc-800/80" />
              <div className="h-3 w-1/2 rounded-md bg-slate-200/80 dark:bg-zinc-800/80" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-3xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 p-8 text-center max-w-lg mx-auto my-12 shadow-xs">
          <h2 className="font-bold text-base text-rose-700 dark:text-rose-400">
            Unable to load playlists
          </h2>
          <p className="mt-1 text-xs text-rose-600/80 dark:text-rose-400/80">
            Check your network connection or server status and try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && playlists.length === 0 && (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300/90 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/20 p-10 text-center backdrop-blur-xs">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-md">
            <Layers size={32} />
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold shadow-xs">
              +
            </div>
          </div>
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            No playlists created yet
          </h2>
          <p className="mt-1.5 max-w-xs text-xs text-slate-500 dark:text-zinc-400">
            Create custom playlists to group tutorials, music, podcasts, or your favorite videos in one place.
          </p>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-indigo-500/25 active:scale-95 transition cursor-pointer"
          >
            <Plus size={15} />
            <span>Create Your First Playlist</span>
          </button>
        </div>
      )}

      {/* Playlists Grid - High-Aesthetic Decks */}
      {!isLoading && !isError && playlists.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6">
          {playlists.map((playlist) => {
            const videoCount = playlist.videos?.length || 0;
            const firstVideo = playlist.videos?.[0];
            const coverImage = firstVideo?.thumbnail;

            return (
              <div
                key={playlist._id}
                className="group relative flex flex-col rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-300 ease-out hover:-translate-y-1"
              >
                {/* Visual Cover / Deck Preview */}
                <Link
                  to={`/playlists/${playlist._id}`}
                  className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 flex items-center justify-center"
                >
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={playlist.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white/90 gap-1.5 p-4 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md shadow-inner">
                        <ListVideo size={24} />
                      </div>
                      <span className="text-[11px] font-bold tracking-wider uppercase opacity-80">Empty Deck</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Play Overlay on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-indigo-600 shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                      <Play size={20} className="fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Top Right Video Count Badge */}
                  <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                    <Film size={12} />
                    <span>{videoCount} {videoCount === 1 ? "video" : "videos"}</span>
                  </div>
                </Link>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/playlists/${playlist._id}`} className="min-w-0 flex-1">
                        <h3 className="line-clamp-1 text-sm font-bold text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {playlist.name}
                        </h3>
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          confirmToast({
                            title: `Delete "${playlist.name}"?`,
                            message: "This playlist collection will be deleted.",
                            confirmText: "Delete",
                            onConfirm: () => {
                              const promise = deleteMutation.mutateAsync(playlist._id);
                              toast.promise(promise, {
                                loading: "Deleting playlist...",
                                success: "Playlist deleted",
                                error: "Unable to delete playlist",
                              });
                            },
                          });
                        }}
                        aria-label="Delete playlist"
                        title="Delete playlist"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {playlist.description || "No description provided."}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                      Collection
                    </span>
                    <Link
                      to={`/playlists/${playlist._id}`}
                      className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                    >
                      <span>View Deck</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Playlist Modal (Smooth Popover Dialog) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsCreateModalOpen(false)}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-7 shadow-2xl transition-all duration-300 transform scale-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400">
                  <ListVideo size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                    Create New Playlist
                  </h2>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                    Add a title and description for your collection
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  Playlist Title <span className="text-indigo-600 dark:text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Chill Beats, JavaScript Mastery..."
                  autoFocus
                  className="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-800/70 px-4 py-2.5 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  Description <span className="text-xs font-normal text-slate-400 dark:text-zinc-500">(Optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the vibes or theme of this playlist..."
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-800/70 px-4 py-2.5 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || !name.trim()}
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{createMutation.isPending ? "Creating..." : "Create Playlist"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlists;


