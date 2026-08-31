import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ListPlus, X, Plus } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { addVideoToPlaylistApi, getUserPlaylistsApi } from "../api/playlist.api";
import { useAuthStore } from "../store/useAuthStore";

const SaveToPlaylistModal = ({ isOpen, onClose, videoId }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["playlists", user?._id],
    queryFn: () => getUserPlaylistsApi(user?._id),
    enabled: Boolean(isOpen && user?._id),
    select: (response) => response?.data ?? [],
  });

  const playlists = data ?? [];

  const mutation = useMutation({
    mutationFn: addVideoToPlaylistApi,
    onSuccess: (_, variables) => {
      toast.success("Video added to playlist!");
      queryClient.invalidateQueries({ queryKey: ["playlist", variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ["playlists", user?._id] });
      onClose();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Unable to save to playlist";
      toast.error(message);
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (playlistId) => {
    if (!videoId || !playlistId) return;
    mutation.mutate({ playlistId, videoId });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-7 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Save to Playlist</h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400">Choose a playlist collection</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition cursor-pointer"
            aria-label="Close playlist modal"
          >
            <X size={16} />
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-2xl bg-slate-100 dark:bg-zinc-800" />
            ))}
          </div>
        ) : playlists.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800 p-8 text-center bg-slate-50 dark:bg-zinc-900/40">
            <ListPlus className="mx-auto mb-2 text-slate-500 dark:text-zinc-500" size={24} />
            <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100">No playlists yet</p>
            <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-0.5">Go to Playlists in the sidebar to create one.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {playlists.map((playlist) => (
              <button
                key={playlist._id}
                type="button"
                onClick={() => handleSave(playlist._id)}
                disabled={mutation.isPending}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 dark:border-zinc-800/80 bg-slate-50/80 dark:bg-zinc-800/40 px-4 py-3 text-left transition hover:border-indigo-500 hover:bg-slate-100 dark:hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-50 cursor-pointer group shadow-2xs"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {playlist.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    {playlist.videos?.length || 0} videos
                  </p>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 dark:bg-zinc-700/60 text-slate-700 dark:text-zinc-300 group-hover:bg-indigo-600 group-hover:text-white transition shadow-xs">
                  <Plus size={14} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveToPlaylistModal;


