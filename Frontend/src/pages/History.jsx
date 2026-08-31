import { useQuery } from "@tanstack/react-query";
import { Trash2, Clock, Play, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getWatchHistoryApi } from "../api/user.api";
import VideoCard from "../components/video/VideoCard";
import axiosInstance from "../api/axiosInstance";
import { USER_ENDPOINTS } from "../utils/constants";
import { confirmToast } from "../utils/confirmToast";

const History = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["watch-history"],
    queryFn: getWatchHistoryApi,
  });

  const videos = data?.data ?? [];
  const firstVideo = videos[0];

  const clearHistory = () => {
    confirmToast({
      title: "Clear Watch History?",
      message: "All watched video history will be permanently cleared.",
      confirmText: "Clear All",
      onConfirm: () => {
        const promise = axiosInstance.delete(USER_ENDPOINTS.WATCH_HISTORY);
        toast.promise(promise, {
          loading: "Clearing watch history...",
          success: () => {
            refetch();
            return "Watch history cleared";
          },
          error: (error) => error?.response?.data?.message || "Unable to clear watch history",
        });
      },
    });
  };

  return (
    <div className="w-full space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            <Clock size={13} />
            <span>Activity Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
            Watch History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Videos and content you've previously watched
          </p>
        </div>

        {videos.length > 0 && (
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {firstVideo && (
              <Link
                to={`/videos/${firstVideo._id}`}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold shadow-md shadow-indigo-500/25 active:scale-95 transition cursor-pointer"
              >
                <Play size={14} className="fill-current" />
                <span>Resume</span>
              </Link>
            )}

            <button
              type="button"
              onClick={clearHistory}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 dark:border-rose-900/40 bg-rose-50/60 dark:bg-rose-950/30 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 active:scale-95 transition cursor-pointer shadow-xs"
            >
              <Trash2 size={13} />
              <span>Clear History</span>
            </button>
          </div>
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
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300/90 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/20 p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 mb-3 shadow-md">
            <Clock size={26} />
          </div>
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            No watch history recorded
          </h2>
          <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-zinc-400">
            Videos you watch will automatically be saved here so you can easily jump back in anytime.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition"
          >
            <Compass size={14} />
            <span>Explore Videos</span>
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

export default History;


