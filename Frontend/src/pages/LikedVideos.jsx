import { useQuery } from "@tanstack/react-query";
import { Heart, Play, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { getLikedVideosApi } from "../api/like.api";
import VideoCard from "../components/video/VideoCard";

const LikedVideos = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["liked-videos"],
    queryFn: getLikedVideosApi,
  });

  const videos = data?.data ?? [];
  const firstVideo = videos[0];

  return (
    <div className="w-full space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            <Heart size={13} className="fill-current" />
            <span>Personal Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
            Liked Videos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            {videos.length} {videos.length === 1 ? "video" : "videos"} you have saved and liked
          </p>
        </div>

        {firstVideo && (
          <Link
            to={`/videos/${firstVideo._id}`}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-indigo-500/25 active:scale-95 transition cursor-pointer self-start sm:self-auto"
          >
            <Play size={15} className="fill-current" />
            <span>Play All</span>
          </Link>
        )}
      </div>

      {/* Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-x-5 gap-y-8">
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className="animate-pulse space-y-3.5">
              <div className="aspect-video rounded-2xl bg-slate-200/80 dark:bg-zinc-800" />
              <div className="h-4 w-4/5 rounded bg-slate-200/80 dark:bg-zinc-800" />
              <div className="h-3 w-2/5 rounded bg-slate-200/80 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-3xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/50 p-6 text-center text-xs text-rose-700 dark:bg-rose-950/20 dark:text-rose-300 shadow-xs">
          Unable to load liked videos.
        </div>
      )}

      {!isLoading && !isError && videos.length === 0 && (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300/90 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/20 p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 mb-3 shadow-md">
            <Heart size={26} className="fill-current" />
          </div>
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            No liked videos yet
          </h2>
          <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-zinc-400">
            Hit the like button on videos you enjoy while watching to automatically collect them here.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition"
          >
            <Compass size={14} />
            <span>Discover Videos</span>
          </Link>
        </div>
      )}

      {!isLoading && !isError && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-x-5 gap-y-8">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedVideos;


