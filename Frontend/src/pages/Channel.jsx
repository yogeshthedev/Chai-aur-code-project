import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, UserCircle, VideoOff } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getUserChannelProfileApi } from "../api/user.api";
import { getVideosApi } from "../api/video.api";
import SubscribeButton from "../components/SubscribeButton";
import VideoCard from "../components/video/VideoCard";

const Channel = () => {
  const { username } = useParams();

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["channel", username],
    queryFn: () => getUserChannelProfileApi(username),
    enabled: Boolean(username),
  });

  const profile = profileData?.data;

  const { data: videosData, isLoading: videosLoading } = useQuery({
    queryKey: ["channel-videos", profile?._id],
    queryFn: () => getVideosApi({ page: 1, limit: 20, userId: profile?._id }),
    enabled: Boolean(profile?._id),
    select: (response) => response?.data?.videos ?? [],
  });

  const videos = videosData ?? [];

  if (profileLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="h-48 w-full animate-pulse rounded-3xl bg-slate-200/80 dark:bg-zinc-800/80" />
        <div className="flex items-center gap-4 px-4">
          <div className="h-20 w-20 animate-pulse rounded-full bg-slate-200/80 dark:bg-zinc-800/80" />
          <div className="space-y-2">
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200/80 dark:bg-zinc-800/80" />
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200/80 dark:bg-zinc-800/80" />
          </div>
        </div>
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
    <div className="w-full space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft size={15} /> Back to feed
      </Link>

      {/* Channel Header Banner */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 shadow-sm">
        {profile.coverImage ? (
          <img
            src={profile.coverImage}
            alt="Channel cover"
            className="h-44 w-full object-cover sm:h-56"
          />
        ) : (
          <div className="h-36 w-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 dark:from-indigo-950/40 dark:via-zinc-850 dark:to-zinc-900" />
        )}

        <div className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-200 dark:ring-zinc-800 sm:h-20 sm:w-20"
                />
              ) : (
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-zinc-800 text-2xl font-bold dark:text-zinc-200 ring-2 ring-slate-200 dark:ring-zinc-800">
                  {profile.username?.slice(0, 1).toUpperCase() || <UserCircle size={40} />}
                </div>
              )}

              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100 sm:text-2xl">
                  {profile.fullName || profile.username}
                </h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400">@{profile.username}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                  <span>{profile.subscribersCount || 0} subscribers</span>
                  <span>•</span>
                  <span>{videos.length} videos</span>
                </div>
              </div>
            </div>

            <SubscribeButton
              channelId={profile._id}
              isSubscribed={Boolean(profile.isSubscribed)}
              subscriberCount={profile.subscribersCount || 0}
            />
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Channel Videos</h2>

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
          <div className="flex min-h-52 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 p-8 text-center text-slate-500 dark:text-zinc-400">
            <VideoOff size={28} className="mb-2 text-slate-400 dark:text-zinc-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">No videos uploaded yet</h3>
            <p className="mt-1 text-xs">This creator hasn't published any videos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-x-5 gap-y-8">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;


