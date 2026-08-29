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
        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500 mb-2">
          <Heart size={13} className="fill-current" />
          <span>Library</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
          Liked Videos
        </h1>
        <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
          {videos.length} {videos.length === 1 ? "video" : "videos"} you have liked
        </p>
      </div>

      {/* Skeletons */}
      {isLoading && (
        <div className="grid gap-x-4 gap-y-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="animate-pulse space-y-3">
              <div className="aspect-video rounded-2xl bg-slate-200/70 dark:bg-zinc-800/80" />
              <div className="h-4 w-4/5 rounded bg-slate-200/70 dark:bg-zinc-800/80" />
              <div className="h-3 w-2/5 rounded bg-slate-200/70 dark:bg-zinc-800/80" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-3xl border border-red-200/80 dark:border-red-900/40 bg-red-50/50 p-6 text-center text-xs text-red-700 dark:bg-red-950/20 dark:text-red-300">
          Unable to load liked videos.
        </div>
      )}

      {!isLoading && !isError && videos.length === 0 && (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/30 p-8 text-center text-slate-600 dark:text-zinc-400">
          <Heart size={28} className="mb-2 text-slate-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">No liked videos yet</h2>
          <p className="mt-1 text-xs">Hit the like button on videos you enjoy to save them here.</p>
        </div>
      )}

      {!isLoading && !isError && videos.length > 0 && (
        <div className="grid gap-x-4 gap-y-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedVideos;


