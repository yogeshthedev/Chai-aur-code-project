import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  UserCircle,
  VideoOff,
  Sparkles,
  Share2,
  Film,
  Layers,
  Info,
  Check,
  Calendar,
  Tv,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserChannelProfileApi } from "../api/user.api";
import { getVideosApi } from "../api/video.api";
import { getUserPlaylistsApi } from "../api/playlist.api";
import SubscribeButton from "../components/SubscribeButton";
import VideoCard from "../components/video/VideoCard";

const Channel = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("videos"); // 'videos' | 'playlists' | 'about'
  const [copied, setCopied] = useState(false);

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["channel", username],
    queryFn: () => getUserChannelProfileApi(username),
    enabled: Boolean(username),
  });

  const profile = profileData?.data;

  const { data: videosData, isLoading: videosLoading } = useQuery({
    queryKey: ["channel-videos", profile?._id],
    queryFn: () => getVideosApi({ page: 1, limit: 30, userId: profile?._id }),
    enabled: Boolean(profile?._id),
    select: (response) => response?.data?.videos ?? [],
  });

  const { data: playlistsData } = useQuery({
    queryKey: ["channel-playlists", profile?._id],
    queryFn: () => getUserPlaylistsApi(profile?._id),
    enabled: Boolean(profile?._id),
    select: (response) => response?.data ?? [],
  });

  const videos = videosData ?? [];
  const playlists = playlistsData ?? [];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Channel link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (profileLoading) {
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
        <h2 className="text-lg font-bold text-rose-700 dark:text-rose-300">Channel not found</h2>
        <p className="mt-2 text-xs text-rose-600/80 dark:text-rose-400/80">
          The channel @{username} does not exist or has been removed.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-300 dark:border-zinc-700 px-5 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-700 transition shadow-xs"
        >
          <ArrowLeft size={14} /> Back to explore
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Top Breadcrumb */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft size={15} /> Back to feed
      </Link>

      {/* Channel Header Banner Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        {/* Cover Art Banner */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800">
          {profile.coverImage ? (
            <img
              src={profile.coverImage}
              alt="Channel cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-radial from-indigo-500/30 via-transparent to-black/40" />
          )}
        </div>

        {/* Channel Info & Meta */}
        <div className="relative px-6 sm:px-8 pb-7 pt-0">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              {/* Creator Avatar */}
              <div className="relative -mt-16 sm:-mt-20 shrink-0 self-start rounded-full ring-4 ring-white dark:ring-zinc-900 bg-white dark:bg-zinc-900 shadow-xl">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.username}
                    className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-zinc-800 text-3xl font-extrabold dark:text-zinc-200">
                    {profile.username?.slice(0, 1).toUpperCase() || <UserCircle size={48} />}
                  </div>
                )}
              </div>

              {/* Identity & Numbers */}
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
                    <strong className="text-slate-900 dark:text-zinc-200">{profile.subscribersCount || 0}</strong> subscribers
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-900 dark:text-zinc-200">{videos.length}</strong> videos
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-900 dark:text-zinc-200">{playlists.length}</strong> playlists
                  </span>
                </div>
              </div>
            </div>

            {/* Subscribe & Share Actions */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-xs font-bold text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 active:scale-95 transition shadow-2xs cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                <span>{copied ? "Link Copied" : "Share"}</span>
              </button>

              <SubscribeButton
                channelId={profile._id}
                isSubscribed={Boolean(profile.isSubscribed)}
                subscriberCount={profile.subscribersCount || 0}
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
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
            Videos ({videos.length})
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
            About Channel
          </button>
        </div>
      </div>

      {/* Tab 1: Videos Grid */}
      {activeTab === "videos" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
            Channel Videos ({videos.length})
          </h2>

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
            <div className="flex min-h-60 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/20 p-10 text-center text-slate-500 dark:text-zinc-400">
              <VideoOff size={32} className="mb-2 text-slate-400 dark:text-zinc-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">No videos published yet</h3>
              <p className="mt-1 text-xs">This creator hasn't published any videos yet.</p>
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
          <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
            Public Playlists ({playlists.length})
          </h2>

          {playlists.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/20 p-8 text-center text-slate-500 dark:text-zinc-400">
              <Layers size={32} className="mb-2 text-slate-400 dark:text-zinc-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">No public playlists</h3>
              <p className="mt-1 text-xs">This channel doesn't have any playlists yet.</p>
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

      {/* Tab 3: About Channel */}
      {activeTab === "about" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              <Tv size={15} className="text-indigo-600 dark:text-indigo-400" />
              <span>Channel Statistics</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">
              {profile.subscribersCount || 0} Subscribers
            </p>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {videos.length} videos published
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              <Info size={15} className="text-indigo-600 dark:text-indigo-400" />
              <span>Channel Handle</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 font-mono">
              @{profile.username}
            </p>
            <span className="inline-block text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              Verified Creator Profile
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              <Calendar size={15} className="text-indigo-600 dark:text-indigo-400" />
              <span>Channel Status</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">
              Active Channel
            </p>
            <span className="inline-block text-[11px] text-slate-400 dark:text-zinc-500">
              Broadcasting on VideoFlow
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Channel;


