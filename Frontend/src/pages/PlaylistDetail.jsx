import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit3, Trash2, VideoOff, X, ListVideo, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getPlaylistByIdApi, removeVideoFromPlaylistApi, updatePlaylistApi } from "../api/playlist.api";
import VideoCard from "../components/video/VideoCard";

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showEditor, setShowEditor] = useState(false);

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
      setShowEditor(false);
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Unable to update playlist";
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

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="h-6 w-32 animate-pulse rounded-lg bg-slate-200/80 dark:bg-zinc-800" />
        <div className="h-44 w-full animate-pulse rounded-3xl bg-slate-200/80 dark:bg-zinc-800" />
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

  return (
    <div className="w-full space-y-6">
      <Link
        to="/playlists"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft size={15} /> Back to playlists
      </Link>

      {/* Playlist Header Card */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
              <Sparkles size={13} />
              <span>Playlist Collection</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              {playlist.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xl">
              {playlist.description || "No description provided."}
            </p>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 pt-1">
              {playlist.videos?.length || 0} {playlist.videos?.length === 1 ? "video" : "videos"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setName(playlist.name || "");
              setDescription(playlist.description || "");
              setShowEditor((prev) => !prev);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 active:scale-95 transition self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <Edit3 size={14} />
            <span>{showEditor ? "Close Editor" : "Edit Details"}</span>
          </button>
        </div>

        {/* Edit Form Drawer / Card */}
        {showEditor && (
          <form onSubmit={handleSave} className="mt-6 space-y-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-800/80 p-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                Playlist Name
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-slate-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/80 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                Description
              </label>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-slate-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/80 transition"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="rounded-full border border-slate-200 dark:border-zinc-700 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="rounded-full bg-indigo-600 px-5 py-1.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition cursor-pointer"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Videos List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Playlist Videos</h2>

        {!playlist.videos || playlist.videos.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 p-8 text-center text-slate-500 dark:text-zinc-400">
            <VideoOff size={28} className="mb-2 text-slate-400 dark:text-zinc-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">No videos in this playlist</h3>
            <p className="mt-1 text-xs">Save videos to this playlist while watching them.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-x-5 gap-y-8">
            {playlist.videos.map((video) => (
              <div key={video._id} className="relative group">
                <VideoCard video={video} />
                <button
                  type="button"
                  onClick={() => removeVideoMutation.mutate({ playlistId, videoId: video._id })}
                  className="absolute right-2.5 top-2.5 z-10 rounded-full bg-black/75 p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-rose-600 hover:scale-110 active:scale-95 cursor-pointer shadow-md backdrop-blur-xs"
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
    </div>
  );
};

export default PlaylistDetail;


