import { VideoOff, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getVideosApi } from "../api/video.api";
import VideoCard from "../components/video/VideoCard";

const Home = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["videos", { page: 1, limit: 16, query }],
    queryFn: () => getVideosApi({ page: 1, limit: 16, query }),
  });

  const videos = data?.data?.videos ?? [];

  return (
    <div className="w-full space-y-6">

      {/* Header section (if search query active) */}
      {query && (
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            Search results for <span className="text-red-500 font-semibold">"{query}"</span>
          </h1>
          <span className="text-xs text-slate-600 dark:text-zinc-400">
            {videos.length} {videos.length === 1 ? "result" : "results"}
          </span>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid gap-x-4 gap-y-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className="animate-pulse space-y-3">
              <div className="aspect-video w-full rounded-2xl bg-slate-200/70 dark:bg-zinc-800/80" />
              <div className="flex gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full bg-slate-200/70 dark:bg-zinc-800/80" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-4/5 rounded-md bg-slate-200/70 dark:bg-zinc-800/80" />
                  <div className="h-3 w-1/2 rounded-md bg-slate-200/70 dark:bg-zinc-800/80" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-2xl border border-red-200/80 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 p-6 text-center max-w-lg mx-auto my-8">
          <h2 className="font-semibold text-red-700 dark:text-red-400">
            Unable to load video feed
          </h2>
          <p className="mt-1 text-xs text-red-600/80 dark:text-red-400/80">
            Please make sure the backend server is running, then try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm shadow-red-500/20 hover:bg-red-700 active:scale-95 transition cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Try again</span>
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && videos.length === 0 && (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 p-8 text-center bg-slate-50 dark:bg-zinc-900/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200/70 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 mb-3">
            <VideoOff size={24} />
          </div>
          <h2 className="font-bold text-base text-slate-900 dark:text-zinc-100">
            {query ? "No matching videos found" : "No videos published yet"}
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400 max-w-xs">
            {query
              ? "Try searching for a different keyword or browse all videos."
              : "Be the first to upload and share videos with the community."}
          </p>
        </div>
      )}

      {/* Video Grid */}
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

export default Home;


