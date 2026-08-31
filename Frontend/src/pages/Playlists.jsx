import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, FolderOpen, Trash2, ArrowRight, ListVideo, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { createPlaylistApi, deletePlaylistApi, getUserPlaylistsApi } from "../api/playlist.api";
import { useAuthStore } from "../store/useAuthStore";

const Playlists = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data, isLoading, isError } = useQuery({
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
      toast.error("Playlist name is required");
      return;
    }

    createMutation.mutate({ name, description });
  };

  return (
    <div className="w-full space-y-7">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
          <Sparkles size={13} />
          <span>Collections</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
          Playlists
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Organize and group your favorite videos into custom playlists
        </p>
      </div>

      {/* Create Playlist Form */}
      <form
        onSubmit={handleCreate}
        className="rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-5 md:p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-[1fr_1.3fr_auto] md:items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
              Playlist Name <span className="text-indigo-600 dark:text-indigo-400">*</span>
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/80 transition"
              placeholder="e.g., Coding Tutorials"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
              Description (Optional)
            </label>
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/80 transition"
              placeholder="What is this playlist about?"
            />
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition cursor-pointer"
          >
            <Plus size={15} />
            <span>{createMutation.isPending ? "Creating..." : "Create Playlist"}</span>
          </button>
        </div>
      </form>

      {/* Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-5">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-zinc-800/80" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-3xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/50 p-6 text-center text-xs text-rose-700 dark:bg-rose-950/20 dark:text-rose-300 shadow-xs">
          Unable to load playlists at this time.
        </div>
      )}

      {!isLoading && !isError && playlists.length === 0 && (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 p-8 text-center">
          <FolderOpen size={28} className="text-slate-400 dark:text-zinc-500 mb-2" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">No playlists yet</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">Create your first playlist using the form above.</p>
        </div>
      )}

      {!isLoading && !isError && playlists.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-5">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-5 shadow-sm transition hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                      <ListVideo size={16} />
                    </div>
                    <h2 className="truncate text-sm font-bold text-slate-900 dark:text-zinc-100">
                      {playlist.name}
                    </h2>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
                    {playlist.description || "No description provided."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(playlist._id)}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition cursor-pointer"
                  aria-label="Delete playlist"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800/80 pt-3 text-xs text-slate-500 dark:text-zinc-400">
                <span className="font-semibold text-slate-600 dark:text-zinc-300">{playlist.videos?.length || 0} videos</span>
                <Link
                  to={`/playlists/${playlist._id}`}
                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition"
                >
                  <span>View</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlists;


