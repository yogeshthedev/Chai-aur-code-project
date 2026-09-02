import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Play, VideoOff } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getWatchHistoryApi, clearWatchHistoryApi } from "../api/user.api";
import VideoCard from "../components/video/VideoCard";
import { confirmToast } from "../utils/confirmToast";

const History = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["watch-history"],
    queryFn: () => getWatchHistoryApi().catch(() => null),
  });

  const clearHistoryMutation = useMutation({
    mutationFn: clearWatchHistoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watch-history"] });
      toast.success("Watch history cleared");
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to clear watch history";
      toast.error(msg);
    },
  });

  const rawVideos = data?.data ?? [];
  const videos = Array.isArray(rawVideos)
    ? rawVideos.map((item) => item.video || item).filter(Boolean)
    : [];
  const firstVideo = videos[0];

  const clearHistory = () => {
    confirmToast({
      title: "Clear Playback History?",
      message: "All watch logs and progress markers will be permanently cleared from this device.",
      confirmText: "Clear All Logs",
      onConfirm: () => {
        clearHistoryMutation.mutate();
      },
    });
  };

  return (
    <div className="w-full space-y-7 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/8 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#FAFAF8]">
              Playback Stream Log
            </h1>
            <span className="rounded-xs bg-[#FF5A36]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#FF5A36] border border-[#FF5A36]/20">
              {videos.length} Sessions
            </span>
          </div>
          <p className="text-xs font-mono text-[#71717A] mt-1">
            Chronological watch sessions with timestamped bookmarking and sponsor-skipped progress.
          </p>
        </div>

        {videos.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {firstVideo && (
              <Link
                to={`/videos/${firstVideo._id}`}
                className="inline-flex items-center gap-2 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] px-4 py-2 text-xs font-mono font-bold transition active:scale-95 cursor-pointer shadow-sm"
              >
                <Play size={14} className="fill-current" />
                <span>Resume Last Session</span>
              </Link>
            )}

            <button
              type="button"
              onClick={clearHistory}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#18181B] hover:bg-[#222226] text-[#FAFAF8] px-3.5 py-2 text-xs font-mono transition cursor-pointer"
            >
              <Trash2 size={13} className="text-[#EF4444]" />
              <span>Clear Log</span>
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="aspect-video rounded-lg bg-[#18181B] border border-white/6 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && videos.length === 0 && (
        <div className="rounded-lg border border-white/8 bg-[#121212] p-12 text-center space-y-3.5">
          <VideoOff size={36} className="mx-auto text-[#71717A]" />
          <h2 className="font-display font-bold text-base text-[#FAFAF8]">
            No watch history recorded
          </h2>
          <p className="font-mono text-xs text-[#71717A] max-w-sm mx-auto">
            Videos you watch will appear here so you can easily resume playback.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] px-4 py-2 font-mono text-xs font-bold transition cursor-pointer"
          >
            <span>Explore Videos</span>
          </Link>
        </div>
      )}

      {/* Grid */}
      {!isLoading && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;



