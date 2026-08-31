import { useQuery } from "@tanstack/react-query";
import { Trash2, VideoOff, Clock, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { getWatchHistoryApi } from "../api/user.api";
import VideoCard from "../components/video/VideoCard";
import axiosInstance from "../api/axiosInstance";
import { USER_ENDPOINTS } from "../utils/constants";

const History = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["watch-history"],
    queryFn: getWatchHistoryApi,
  });

  const videos = data?.data ?? [];

  const clearHistory = async () => {
    try {
      await axiosInstance.delete(USER_ENDPOINTS.WATCH_HISTORY);
      toast.success("Watch history cleared");
      refetch();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Unable to clear watch history";
      toast.error(message);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
            <Clock size={13} />
            <span>Activity</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            Watch History
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Videos and content you've previously watched
          </p>
        </div>

        {videos.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 active:scale-95 transition self-start sm:self-auto cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>
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
          Unable to load watch history.
        </div>
      )}

      {!isLoading && !isError && videos.length === 0 && (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 p-8 text-center text-slate-500 dark:text-zinc-400">
          <Clock size={28} className="mb-2 text-slate-400 dark:text-zinc-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">No watch history</h2>
          <p className="mt-1 text-xs">Videos you watch will be saved here for easy access.</p>
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

export default History;


