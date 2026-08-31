import { useQuery } from "@tanstack/react-query";
import { Heart, VideoOff, Sparkles } from "lucide-react";
import { getLikedVideosApi } from "../api/like.api";
import VideoCard from "../components/video/VideoCard";

const LikedVideos = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["liked-videos"],
    queryFn: getLikedVideosApi,
  });

  const videos = data?.data ?? [];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
          <Heart size={13} className="fill-current" />
          <span>Library</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
          Liked Videos
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          {videos.length} {videos.length === 1 ? "video" : "videos"} you have liked
        </p>
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
        <div className="flex min-h-60 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 p-8 text-center text-slate-500 dark:text-zinc-400">
          <Heart size={28} className="mb-2 text-slate-400 dark:text-zinc-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">No liked videos yet</h2>
          <p className="mt-1 text-xs">Hit the like button on videos you enjoy to save them here.</p>
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


