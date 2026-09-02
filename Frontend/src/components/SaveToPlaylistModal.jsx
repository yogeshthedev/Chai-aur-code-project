import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ListPlus, X, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { addVideoToPlaylistApi, createPlaylistApi, getUserPlaylistsApi } from "../api/playlist.api";
import { useAuthStore } from "../store/useAuthStore";

const SaveToPlaylistModal = ({ isOpen, onClose, videoId }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");

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
      toast.success("Video saved to playlist!");
      queryClient.invalidateQueries({ queryKey: ["playlist", variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ["playlists", user?._id] });
      onClose();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Unable to save to playlist";
      toast.error(message);
    },
  });

  const createPlaylistMutation = useMutation({
    mutationFn: (name) => createPlaylistApi({ name, description: "" }),
    onSuccess: (res) => {
      const createdId = res?.data?._id;
      if (createdId) {
        mutation.mutate({ playlistId: createdId, videoId });
      }
      queryClient.invalidateQueries({ queryKey: ["playlists", user?._id] });
      setShowCreate(false);
      setNewTitle("");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create playlist");
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

  const handleQuickCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a playlist title");
      return;
    }
    createPlaylistMutation.mutate(newTitle.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md rounded-lg border border-white/12 bg-[#121212] p-6 shadow-2xl z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/8">
          <div>
            <h2 className="font-display font-bold text-sm text-[#FAFAF8]">Save to Playlist</h2>
            <p className="font-mono text-[11px] text-[#71717A]">Add to your personal video collections</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#71717A] hover:text-[#FAFAF8] transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={15} />
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-12 animate-pulse rounded-md bg-[#18181B] border border-white/6" />
            ))}
          </div>
        ) : playlists.length === 0 && !showCreate ? (
          <div className="rounded-lg border border-dashed border-white/10 p-8 text-center bg-[#18181B]/50 space-y-3">
            <ListPlus className="mx-auto text-[#FF5A36]" size={28} />
            <div>
              <p className="font-display font-bold text-xs text-[#FAFAF8]">No playlists created yet</p>
              <p className="font-mono text-[11px] text-[#71717A] mt-0.5">Create one right now to save this video.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] hover:bg-coral-hover px-4 py-1.5 font-mono text-xs font-bold text-[#0A0A0A] active:scale-95 transition cursor-pointer shadow-xs"
            >
              <Plus size={13} />
              <span>Create New Playlist</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {playlists.map((playlist) => (
                <button
                  key={playlist._id}
                  type="button"
                  onClick={() => handleSave(playlist._id)}
                  disabled={mutation.isPending}
                  className="flex w-full items-center justify-between rounded-md border border-white/8 bg-[#18181B] px-3.5 py-2.5 text-left transition hover:border-white/20 hover:bg-[#222226] active:scale-[0.99] disabled:opacity-50 cursor-pointer group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-bold text-xs text-[#FAFAF8] group-hover:text-[#FF5A36] transition-colors truncate">
                      {playlist.name}
                    </p>
                    <p className="font-mono text-[10px] text-[#71717A]">
                      {playlist.videos?.length || 0} {playlist.videos?.length === 1 ? "video" : "videos"}
                    </p>
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/6 text-[#71717A] group-hover:bg-[#FF5A36] group-hover:text-[#0A0A0A] transition shrink-0 ml-2">
                    <Plus size={13} />
                  </div>
                </button>
              ))}
            </div>

            {/* Quick create section */}
            {showCreate ? (
              <form onSubmit={handleQuickCreate} className="pt-2 border-t border-white/8 space-y-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="New playlist name..."
                  autoFocus
                  className="w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#FAFAF8] placeholder:text-[#71717A] outline-none focus:border-[#FF5A36]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="px-3 py-1 font-mono text-xs text-[#71717A] hover:text-[#FAFAF8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createPlaylistMutation.isPending || !newTitle.trim()}
                    className="rounded-md bg-[#FF5A36] hover:bg-coral-hover px-3.5 py-1 font-mono text-xs font-bold text-[#0A0A0A] disabled:opacity-50"
                  >
                    {createPlaylistMutation.isPending ? "Creating..." : "Create & Add"}
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2 font-mono text-xs font-bold text-[#FF5A36] hover:bg-[#FF5A36]/10 rounded-md border border-dashed border-[#FF5A36]/30 transition cursor-pointer"
              >
                <Plus size={13} />
                <span>Create New Playlist</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveToPlaylistModal;
