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
        <div className="h-6 w-32 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-44 w-full animate-pulse rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  if (isError || !playlist) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-red-200/80 dark:border-red-900/40 bg-red-50/50 p-8 text-center my-12">
        <h2 className="text-lg font-bold text-red-700 dark:text-red-300">Playlist not found</h2>
        <p className="mt-1 text-xs text-red-600/80 dark:text-red-400/80">
          This playlist may have been deleted or does not exist.
        </p>
        <Link
          to="/playlists"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-xs font-semibold hover:opacity-90 transition"
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
        className="inline-flex items-center gap-2 text-xs font-semibold text-(--text-muted) hover:text-(--text-primary) transition-colors"
      >
        <ArrowLeft size={15} /> Back to playlists
      </Link>

      {/* Playlist Header Card */}
      <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500 mb-1">
              <Sparkles size={13} />
              <span>Playlist Collection</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-(--text-primary)">
              {playlist.name}
            </h1>
            <p className="text-xs text-(--text-muted) max-w-xl">
              {playlist.description || "No description provided."}
            </p>
            <p className="text-xs font-semibold text-red-500 pt-1">
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
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-xs font-semibold text-(--text-primary) hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition self-start sm:self-auto"
          >
            <Edit3 size={14} />
            <span>{showEditor ? "Close Editor" : "Edit Details"}</span>
          </button>
        </div>

        {/* Edit Form Drawer / Card */}
        {showEditor && (
          <form onSubmit={handleSave} className="mt-6 space-y-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/90 p-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-(--text-secondary)">
                Playlist Name
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-sm text-(--text-primary) outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/80 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-(--text-secondary)">
                Description
              </label>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-sm text-(--text-primary) outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/80 transition"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="rounded-full border border-zinc-200 dark:border-zinc-700 px-4 py-1.5 text-xs font-semibold text-(--text-secondary) hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="rounded-full bg-red-600 px-5 py-1.5 text-xs font-bold text-white shadow-sm shadow-red-500/20 hover:bg-red-700 active:scale-95 disabled:opacity-50 transition"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Videos List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-(--text-primary)">Playlist Videos</h2>

        {!playlist.videos || playlist.videos.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-8 text-center text-(--text-muted)">
            <VideoOff size={28} className="mb-2" />
            <h3 className="text-sm font-bold text-(--text-primary)">No videos in this playlist</h3>
            <p className="mt-1 text-xs">Save videos to this playlist while watching them.</p>
          </div>
        ) : (
          <div className="grid gap-x-4 gap-y-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
            {playlist.videos.map((video) => (
              <div key={video._id} className="relative group">
                <VideoCard video={video} />
                <button
                  type="button"
                  onClick={() => removeVideoMutation.mutate({ playlistId, videoId: video._id })}
                  className="absolute right-2 top-2 z-10 rounded-full bg-black/80 p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600 hover:scale-110 active:scale-95 cursor-pointer shadow-md"
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


