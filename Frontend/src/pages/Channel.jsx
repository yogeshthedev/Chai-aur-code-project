import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Share2,
  Check,
  ShieldCheck,
  Search,
  VideoOff,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserChannelProfileApi } from "../api/user.api";
import { getVideosApi } from "../api/video.api";
import { getUserPlaylistsApi } from "../api/playlist.api";
import SubscribeButton from "../components/SubscribeButton";
import NotificationControl from "../components/channel/NotificationControl";
import VideoCard from "../components/video/VideoCard";

const Channel = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("videos"); // 'videos' | 'playlists'
  const [copied, setCopied] = useState(false);
  const [channelSearch, setChannelSearch] = useState("");

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["channel", username],
    queryFn: () => getUserChannelProfileApi(username),
    enabled: Boolean(username),
  });

  const profile = profileData?.data;

  const { data: videosData, isLoading: videosLoading } = useQuery({
    queryKey: ["channel-videos", profile?._id],
    queryFn: () => getVideosApi({ page: 1, limit: 50, userId: profile?._id }),
    enabled: Boolean(profile?._id),
  });

  const { data: playlistsData, isLoading: playlistsLoading } = useQuery({
    queryKey: ["channel-playlists", profile?._id],
    queryFn: () => getUserPlaylistsApi(profile?._id),
    enabled: Boolean(profile?._id),
  });

  const videos = videosData?.data?.videos ?? [];
  const playlists = playlistsData?.data ?? [];

  const filteredVideos = videos.filter((v) =>
    channelSearch ? v.title?.toLowerCase().includes(channelSearch.toLowerCase()) : true
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Channel URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (profileLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="h-48 sm:h-64 w-full animate-pulse rounded-md bg-[#18181B] border border-white/6" />
        <div className="h-24 w-full animate-pulse rounded-md bg-[#18181B] border border-white/6" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-lg border border-white/8 bg-[#121212] p-12 text-center space-y-4 my-10 max-w-lg mx-auto">
        <h2 className="font-display font-bold text-lg text-[#FAFAF8]">Channel Not Found</h2>
        <p className="font-mono text-xs text-[#71717A]">
          The channel @{username} does not exist or has been removed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] px-4 py-2 font-mono text-xs font-bold text-[#0A0A0A]"
        >
          <ArrowLeft size={13} />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-white/8 pb-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#A1A1AA] hover:text-[#FF5A36] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Home</span>
          <span className="text-white/20">/</span>
          <span className="text-[#FAFAF8]">@{profile.username}</span>
        </Link>
      </div>

      {/* Channel Header Banner Container */}
      <div className="overflow-hidden rounded-lg border border-white/8 bg-[#121212]">
        {/* Cover Art Banner */}
        <div className="relative h-44 sm:h-56 lg:h-64 w-full overflow-hidden bg-[#18181B] border-b border-white/8">
          {profile.coverImage ? (
            <img
              src={profile.coverImage}
              alt={profile.fullName || profile.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-[#18181B] flex items-center justify-center text-white/10 font-display font-black text-6xl">
              {profile.username?.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-90" />
        </div>

        {/* Identity & Subscribe Bar */}
        <div className="px-6 sm:px-8 pb-6 pt-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              {/* Avatar */}
              <div className="relative -mt-14 sm:-mt-16 shrink-0 self-start rounded-full ring-4 ring-[#121212] bg-[#18181B] overflow-hidden">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.fullName || profile.username}
                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center bg-[#18181B] text-[#FAFAF8] text-2xl font-bold font-display">
                    {profile.username?.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Identity Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-black text-xl sm:text-2xl text-[#FAFAF8]">
                    {profile.fullName || profile.username}
                  </h1>
                  <ShieldCheck size={18} className="text-[#FF5A36]" />
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#71717A]">
                  <span className="text-[#A1A1AA]">@{profile.username}</span>
                  <span>•</span>
                  <span>{profile.subscribersCount || 0} subscribers</span>
                  <span>•</span>
                  <span>{videos.length} videos</span>
                </div>

                {profile.bio && (
                  <p className="font-sans text-xs text-[#D4D4D8] max-w-2xl leading-relaxed pt-1">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Subscribe & Share Actions */}
            <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#18181B] hover:bg-[#222226] px-3 py-2 text-xs font-mono text-[#FAFAF8] transition cursor-pointer"
              >
                {copied ? <Check size={13} className="text-[#2DD4BF]" /> : <Share2 size={13} />}
                <span>{copied ? "Copied" : "Share"}</span>
              </button>

              <NotificationControl initialLevel="personalized" />

              <SubscribeButton
                channelId={profile._id}
                isSubscribed={profile.isSubscribed}
                subscriberCount={profile.subscribersCount || 0}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center justify-between border-t border-white/6 px-6 sm:px-8 text-xs font-mono">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("videos")}
              className={`py-3 transition border-b-2 cursor-pointer ${
                activeTab === "videos"
                  ? "border-[#FF5A36] text-[#FF5A36] font-bold"
                  : "border-transparent text-[#71717A] hover:text-[#FAFAF8]"
              }`}
            >
              Videos ({videos.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("playlists")}
              className={`py-3 transition border-b-2 cursor-pointer ${
                activeTab === "playlists"
                  ? "border-[#FF5A36] text-[#FF5A36] font-bold"
                  : "border-transparent text-[#71717A] hover:text-[#FAFAF8]"
              }`}
            >
              Playlists ({playlists.length})
            </button>
          </div>

          {/* Search inside channel */}
          {activeTab === "videos" && videos.length > 0 && (
            <div className="relative py-2">
              <input
                type="text"
                value={channelSearch}
                onChange={(e) => setChannelSearch(e.target.value)}
                placeholder="Search channel..."
                className="w-36 sm:w-48 rounded-md border border-white/8 bg-[#18181B] px-2.5 py-1 text-xs text-[#FAFAF8] placeholder:text-[#71717A] outline-none focus:border-[#FF5A36]"
              />
              <Search size={11} className="absolute right-2 top-3 text-[#71717A] pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* Tab 1: Videos */}
      {activeTab === "videos" && (
        <div className="space-y-4">
          {videosLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="aspect-video w-full rounded-md bg-[#18181B] border border-white/6" />
                  <div className="h-3 w-4/5 rounded bg-[#18181B]" />
                </div>
              ))}
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="rounded-lg border border-white/8 bg-[#121212] p-12 text-center space-y-3">
              <VideoOff size={32} className="mx-auto text-[#71717A]" />
              <h3 className="font-display font-bold text-sm text-[#FAFAF8]">
                {channelSearch ? "No matching videos found in this channel" : "No videos uploaded yet"}
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredVideos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Playlists */}
      {activeTab === "playlists" && (
        <div className="space-y-4">
          {playlistsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="aspect-video w-full rounded-md bg-[#18181B] animate-pulse" />
              ))}
            </div>
          ) : playlists.length === 0 ? (
            <div className="rounded-lg border border-white/8 bg-[#121212] p-12 text-center space-y-3">
              <Layers size={32} className="mx-auto text-[#71717A]" />
              <h3 className="font-display font-bold text-sm text-[#FAFAF8]">
                No public playlists created by this channel
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {playlists.map((pl) => (
                <Link
                  key={pl._id}
                  to={`/playlists/${pl._id}`}
                  className="group rounded-lg border border-white/8 bg-[#121212] hover:bg-[#18181B] hover:border-white/16 p-4 transition space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#FAFAF8] group-hover:text-[#FF5A36] transition-colors">
                      {pl.name}
                    </h3>
                    <p className="font-sans text-xs text-[#71717A] line-clamp-2 mt-1">
                      {pl.description || "No description provided."}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/6 flex items-center justify-between font-mono text-[11px] text-[#71717A]">
                    <span>{pl.videos?.length || 0} videos</span>
                    <span className="text-[#FF5A36] group-hover:underline">View Playlist →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Channel;
