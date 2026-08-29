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
        <div className="h-48 w-full animate-pulse rounded-3xl bg-zinc-200/80 dark:bg-zinc-800/80" />
        <div className="flex items-center gap-4 px-4">
          <div className="h-20 w-20 animate-pulse rounded-full bg-zinc-200/80 dark:bg-zinc-800/80" />
          <div className="space-y-2">
            <div className="h-6 w-48 animate-pulse rounded bg-zinc-200/80 dark:bg-zinc-800/80" />
            <div className="h-4 w-32 animate-pulse rounded bg-zinc-200/80 dark:bg-zinc-800/80" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-red-200/80 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 p-8 text-center my-12">
        <h2 className="text-lg font-bold text-red-700 dark:text-red-300">Channel not found</h2>
        <p className="mt-2 text-xs text-red-600/80 dark:text-red-400/80">
          The channel @{username} does not exist or has been removed.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-xs font-semibold hover:opacity-90 transition"
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
        className="inline-flex items-center gap-2 text-xs font-semibold text-(--text-muted) hover:text-(--text-primary) transition-colors"
      >
        <ArrowLeft size={15} /> Back to feed
      </Link>

      {/* Channel Header Banner */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm">
        {profile.coverImage ? (
          <img
            src={profile.coverImage}
            alt="Channel cover"
            className="h-44 w-full object-cover sm:h-56"
          />
        ) : (
          <div className="h-36 w-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-zinc-800 dark:via-zinc-850 dark:to-zinc-900" />
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
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-slate-200 dark:bg-zinc-800 text-2xl font-bold text-slate-800 dark:text-zinc-200 ring-2 ring-slate-200 dark:ring-zinc-800">
                  {profile.username?.slice(0, 1).toUpperCase() || <UserCircle size={40} />}
                </div>
              )}

              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100 sm:text-2xl">
                  {profile.fullName || profile.username}
                </h1>
                <p className="text-xs text-slate-600 dark:text-zinc-400">@{profile.username}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-500">
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
          <div className="grid gap-x-4 gap-y-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="animate-pulse space-y-3">
                <div className="aspect-video rounded-2xl bg-slate-200 dark:bg-zinc-800" />
                <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-zinc-800" />
                <div className="h-3 w-2/5 rounded bg-slate-200 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/30 p-8 text-center text-slate-600 dark:text-zinc-400">
            <VideoOff size={28} className="mb-2 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">No videos uploaded yet</h3>
            <p className="mt-1 text-xs">This creator hasn't published any videos.</p>
          </div>
        ) : (
          <div className="grid gap-x-4 gap-y-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
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


