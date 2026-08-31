import { useState } from "react";
import {
  Camera,
  PencilLine,
  UserCircle,
  Mail,
  AtSign,
  Tv,
  Film,
  Sparkles,
  ExternalLink,
  Upload,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  getCurrentUserApi,
  updateAccountDetailsApi,
  updateAvatarApi,
  updateCoverImageApi,
} from "../api/auth.api";
import { getVideosApi } from "../api/video.api";
import { getUserPlaylistsApi } from "../api/playlist.api";
import EditProfileModal from "../components/EditProfileModal";
import VideoCard from "../components/video/VideoCard";

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("videos"); // 'videos' | 'playlists' | 'about'
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUserApi,
    enabled: !!user,
    select: (response) => response?.data,
  });

  const profile = data || user;

  // Fetch creator's uploaded videos
  const { data: videosData, isLoading: videosLoading } = useQuery({
    queryKey: ["user-videos", profile?._id],
    queryFn: () => getVideosApi({ page: 1, limit: 30, userId: profile?._id }),
    enabled: Boolean(profile?._id),
    select: (response) => response?.data?.videos ?? [],
  });

  // Fetch creator's playlists
  const { data: playlistsData } = useQuery({
    queryKey: ["playlists", profile?._id],
    queryFn: () => getUserPlaylistsApi(profile?._id),
    enabled: Boolean(profile?._id),
    select: (response) => response?.data ?? [],
  });

  const videos = videosData ?? [];
  const playlists = playlistsData ?? [];

  const handleSaveProfile = async (formData) => {
    try {
      const response = await updateAccountDetailsApi(formData);
      const updatedUser = response?.data;
      setUser(updatedUser);
      queryClient.setQueryData(["current-user"], { data: updatedUser });
      toast.success("Profile updated successfully!");
    } catch (error) {
      const message = error?.response?.data?.message || "Unable to update profile";
      toast.error(message);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const promise = updateAvatarApi(file);
    toast.promise(promise, {
      loading: "Uploading avatar...",
      success: (res) => {
        const updatedUser = res?.data;
        setUser(updatedUser);
        queryClient.setQueryData(["current-user"], { data: updatedUser });
        return "Avatar updated successfully!";
      },
      error: (err) => err?.response?.data?.message || "Unable to update avatar",
    });
  };

  const handleCoverChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const promise = updateCoverImageApi(file);
    toast.promise(promise, {
      loading: "Uploading cover banner...",
      success: (res) => {
        const updatedUser = res?.data;
        setUser(updatedUser);
        queryClient.setQueryData(["current-user"], { data: updatedUser });
        return "Cover banner updated successfully!";
      },
      error: (err) => err?.response?.data?.message || "Unable to update cover photo",
    });
  };

  const handleCopyLink = () => {
    const channelUrl = `${window.location.origin}/c/${profile?.username}`;
    navigator.clipboard.writeText(channelUrl);
    setCopied(true);
    toast.success("Channel link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading && !profile) {
    return (
      <div className="w-full space-y-6">
        <div className="h-56 w-full animate-pulse rounded-3xl bg-slate-200/80 dark:bg-zinc-800/80" />
        <div className="h-32 w-full animate-pulse rounded-3xl bg-slate-200/80 dark:bg-zinc-800/80" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 p-8 text-center my-12 shadow-xs">
        <h2 className="text-base font-bold text-rose-700 dark:text-rose-300">Sign in Required</h2>
        <p className="mt-1 text-xs text-rose-600/80 dark:text-rose-400/80">
          You need to be signed in to manage your creator profile and channel.
        </p>
        <Link
          to="/login"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Profile Header Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        {/* Cover Banner */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800">
          {profile.coverImage ? (
            <img src={profile.coverImage} alt="Cover" className="h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-radial from-indigo-500/30 via-transparent to-black/40" />
          )}

          {/* Edit Cover Action */}
          <label className="absolute right-4 top-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-black/65 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-black/85 active:scale-95 shadow-md">
            <Camera size={14} />
            <span>Edit Cover</span>
            <input type="file" accept="image/*" hidden onChange={handleCoverChange} />
          </label>
        </div>

        {/* Profile Info Bar */}
        <div className="relative px-6 sm:px-8 pb-7 pt-0">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              {/* Avatar with Camera badge */}
              <div className="relative -mt-16 sm:-mt-20 shrink-0 self-start rounded-full ring-4 ring-white dark:ring-zinc-900 bg-white dark:bg-zinc-900 shadow-xl">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.username}
                    className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-zinc-800 dark:text-zinc-200 text-3xl font-extrabold">
                    {profile.username?.slice(0, 1).toUpperCase() || <UserCircle size={48} />}
                  </div>
                )}

                <label className="absolute bottom-1.5 right-1.5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 active:scale-95 transition ring-2 ring-white dark:ring-zinc-900">
                  <Camera size={15} />
                  <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                </label>
              </div>

              {/* Identity & Metadata */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
                    {profile.fullName || profile.username}
                  </h1>
                  <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    Creator
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-zinc-400">
                  @{profile.username}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500 dark:text-zinc-400">
                  <span>
                    <strong className="text-slate-900 dark:text-zinc-200">{videos.length}</strong> videos
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-900 dark:text-zinc-200">{playlists.length}</strong> playlists
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-900 dark:text-zinc-200">{profile.subscribersCount || 0}</strong> subscribers
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Profile Actions */}
            <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
              <Link
                to={`/c/${profile.username}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-xs font-bold text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 active:scale-95 transition shadow-2xs"
              >
                <ExternalLink size={13} />
                <span>View Public Channel</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition cursor-pointer"
              >
                <PencilLine size={13} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-6 border-t border-slate-100 dark:border-zinc-800/80 px-6 sm:px-8 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("videos")}
            className={`py-3.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === "videos"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
            }`}
          >
            Your Videos ({videos.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("playlists")}
            className={`py-3.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === "playlists"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
            }`}
          >
            Playlists ({playlists.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("about")}
            className={`py-3.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === "about"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
            }`}
          >
            Account Details
          </button>
        </div>
      </div>

      {/* Tab 1: Uploaded Videos */}
      {activeTab === "videos" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
              Uploaded Videos
            </h2>
            <Link
              to="/upload"
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 text-xs font-bold shadow-xs active:scale-95 transition"
            >
              <Upload size={13} />
              <span>Upload Video</span>
            </Link>
          </div>

          {videosLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-x-5 gap-y-8">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="animate-pulse space-y-3.5">
                  <div className="aspect-video rounded-2xl bg-slate-200/80 dark:bg-zinc-800" />
                  <div className="h-4 w-4/5 rounded bg-slate-200/80 dark:bg-zinc-800" />
                  <div className="h-3 w-2/5 rounded bg-slate-200/80 dark:bg-zinc-800" />
                </div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/20 p-10 text-center">
              <Film size={32} className="mb-2 text-slate-400 dark:text-zinc-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">No videos published yet</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 max-w-xs">
                Share your first video with the community to start growing your channel.
              </p>
              <Link
                to="/upload"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition"
              >
                <Upload size={15} />
                <span>Upload First Video</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-x-5 gap-y-8">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Playlists */}
      {activeTab === "playlists" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
              Your Playlists
            </h2>
            <Link
              to="/playlists"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Manage Playlists →
            </Link>
          </div>

          {playlists.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/20 p-8 text-center">
              <Layers size={32} className="mb-2 text-slate-400 dark:text-zinc-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">No playlists yet</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                Organize videos into custom playlists.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {playlists.map((playlist) => (
                <Link
                  key={playlist._id}
                  to={`/playlists/${playlist._id}`}
                  className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-zinc-700 transition-all hover:-translate-y-1"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {playlist.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
                      {playlist.description || "No description provided."}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-slate-500">
                    <span>{playlist.videos?.length || 0} videos</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">View Deck →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Account & Channel Details */}
      {activeTab === "about" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              <Mail size={15} className="text-indigo-600 dark:text-indigo-400" />
              <span>Email Address</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">
              {profile.email || "Not available"}
            </p>
            <span className="inline-block text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Verified Account
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              <AtSign size={15} className="text-indigo-600 dark:text-indigo-400" />
              <span>Channel Handle</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">
              @{profile.username || "username"}
            </p>
            <span className="inline-block text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              Unique Creator Handle
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                <Tv size={15} className="text-indigo-600 dark:text-indigo-400" />
                <span>Share Link</span>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate font-mono text-xs">
              /c/{profile.username}
            </p>
            <span className="inline-block text-[11px] text-slate-400 dark:text-zinc-500">
              Click copy to share with friends
            </span>
          </div>
        </div>
      )}

      {/* Edit Profile Modal Dialog */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Profile;
