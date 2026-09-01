import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  ListVideo,
  Layers,
  Film,
  X,
  ArrowUpRight,
  Search,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { createPlaylistApi, deletePlaylistApi, getUserPlaylistsApi } from "../api/playlist.api";
import { useAuthStore } from "../store/useAuthStore";
import { confirmToast } from "../utils/confirmToast";

const Playlists = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["playlists", user?._id],
    queryFn: () => getUserPlaylistsApi(user?._id),
    enabled: Boolean(user?._id),
    select: (response) => response?.data ?? [],
  });

  const playlists = data ?? [];

  const createMutation = useMutation({
    mutationFn: createPlaylistApi,
    onSuccess: () => {
      toast.success("Playlist created successfully");
      setName("");
      setDescription("");
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["playlists", user?._id] });
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to create playlist";
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlaylistApi,
    onSuccess: () => {
      toast.success("Playlist deleted");
      queryClient.invalidateQueries({ queryKey: ["playlists", user?._id] });
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to delete playlist";
      toast.error(msg);
    },
  });

  const handleOpenCreate = () => {
    if (!user) {
      toast.error("Please sign in to create playlists");
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleCreate = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a playlist name");
      return;
    }
    createMutation.mutate({ name: name.trim(), description: description.trim() });
  };

  const filteredPlaylists = playlists.filter((pl) => {
    const title = pl.name || "";
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full space-y-7 pb-16">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/8 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#FAFAF8]">
              Playlists
            </h1>
            {user && (
              <span className="rounded-xs bg-[#FF5A36]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#FF5A36] border border-[#FF5A36]/20">
                {playlists.length} Collections
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-[#71717A] mt-1">
            Organize, categorize, and loop your saved videos in custom playlists.
          </p>
        </div>

        {user ? (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] px-4 py-2 text-xs font-mono font-bold transition active:scale-95 cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <Plus size={15} />
            <span>New Playlist</span>
          </button>
        ) : (
          <Link
            to="/login"
            state={{ backgroundLocation: location }}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] px-4 py-2 text-xs font-mono font-bold transition active:scale-95 cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <User size={14} />
            <span>Sign In to Create Playlists</span>
          </Link>
        )}
      </div>

      {/* Guest Callout when not logged in */}
      {!user && (
        <div className="rounded-lg border border-white/8 bg-[#121212] p-8 text-center space-y-3">
          <Layers size={32} className="mx-auto text-[#FF5A36]" />
          <h2 className="font-display font-bold text-base text-[#FAFAF8]">
            Sign In to Build Collections
          </h2>
          <p className="font-mono text-xs text-[#71717A] max-w-sm mx-auto">
            Log in with your curator handle to assemble, share, and manage video playlists.
          </p>
          <Link
            to="/login"
            state={{ backgroundLocation: location }}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#18181B] border border-white/10 hover:bg-[#222226] text-[#FAFAF8] px-4 py-2 font-mono text-xs transition"
          >
            <User size={13} className="text-[#FF5A36]" />
            <span>Sign In</span>
          </Link>
        </div>
      )}

      {/* Search Filter */}
      {user && playlists.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search playlists..."
              className="w-full rounded-md border border-white/10 bg-[#121212] px-3 py-1.5 text-xs text-[#FAFAF8] placeholder:text-[#71717A] outline-none focus:border-[#FF5A36]"
            />
            <Search size={13} className="absolute right-2.5 top-2.5 text-[#71717A] pointer-events-none" />
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="aspect-video rounded-lg bg-[#18181B] border border-white/6 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {user && !isLoading && playlists.length === 0 && (
        <div className="rounded-lg border border-white/8 bg-[#121212] p-12 text-center space-y-3.5">
          <Layers size={36} className="mx-auto text-[#71717A]" />
          <h2 className="font-display font-bold text-base text-[#FAFAF8]">
            No playlists created yet
          </h2>
          <p className="font-mono text-xs text-[#71717A] max-w-sm mx-auto">
            Create playlists to organize your favorite tutorials, music, or study sessions.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] px-4 py-2 font-mono text-xs font-bold transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Create Your First Playlist</span>
          </button>
        </div>
      )}

      {/* Playlists Grid */}
      {user && !isLoading && filteredPlaylists.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredPlaylists.map((playlist) => {
            const videoCount = playlist.videos?.length || 0;
            const firstVideo = playlist.videos?.[0];
            const coverImage = firstVideo?.thumbnail;

            return (
              <div
                key={playlist._id}
                className="group relative flex flex-col justify-between rounded-lg bg-[#121212] border border-white/8 hover:border-white/16 overflow-hidden transition"
              >
                {/* Visual Cover Preview */}
                <Link
                  to={`/playlists/${playlist._id}`}
                  className="relative aspect-video w-full overflow-hidden bg-[#18181B] flex items-center justify-center"
                >
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={playlist.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#71717A] gap-1.5 p-4 text-center">
                      <ListVideo size={24} />
                      <span className="font-mono text-[10px] uppercase">Empty</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Video Count Badge */}
                  <div className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-xs bg-black/80 px-2 py-0.5 font-mono text-[10px] text-white">
                    <Film size={11} />
                    <span>{videoCount} {videoCount === 1 ? "video" : "videos"}</span>
                  </div>
                </Link>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/playlists/${playlist._id}`} className="min-w-0 flex-1">
                        <h3 className="font-display font-bold text-sm text-[#FAFAF8] group-hover:text-[#FF5A36] transition-colors line-clamp-1">
                          {playlist.name}
                        </h3>
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          confirmToast({
                            title: `Delete "${playlist.name}"?`,
                            message: "This playlist will be permanently deleted.",
                            confirmText: "Delete",
                            onConfirm: () => {
                              deleteMutation.mutate(playlist._id);
                            },
                          });
                        }}
                        className="p-1 rounded text-[#71717A] hover:text-[#EF4444] transition cursor-pointer"
                        title="Delete playlist"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <p className="font-sans text-xs text-[#71717A] line-clamp-2 mt-1">
                      {playlist.description || "No description provided."}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/6 flex items-center justify-between font-mono text-xs text-[#71717A]">
                    <span>Collection</span>
                    <Link
                      to={`/playlists/${playlist._id}`}
                      className="text-[#FF5A36] group-hover:underline inline-flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Playlist Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setIsCreateModalOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-lg border border-white/12 bg-[#121212] p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-[#FF5A36]" />
                <h2 className="font-display font-bold text-sm text-[#FAFAF8]">
                  Create New Playlist
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded text-[#71717A] hover:text-[#FAFAF8] transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-mono text-xs text-[#71717A] uppercase tracking-wider">
                  Playlist Title <span className="text-[#FF5A36]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Web Development Tutorials"
                  autoFocus
                  className="w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#FAFAF8] placeholder:text-[#71717A] outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs text-[#71717A] uppercase tracking-wider">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the content of this playlist..."
                  rows={3}
                  className="w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#FAFAF8] placeholder:text-[#71717A] outline-none focus:border-[#FF5A36] resize-none"
                />
              </div>

              <div className="pt-2 border-t border-white/8 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 font-mono text-xs text-[#71717A] hover:text-[#FAFAF8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || !name.trim()}
                  className="rounded-md bg-[#FF5A36] hover:bg-[#FF704E] px-4 py-1.5 font-mono text-xs font-bold text-[#0A0A0A] disabled:opacity-40 transition cursor-pointer"
                >
                  {createMutation.isPending ? "Creating..." : "Create Playlist"}
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
