import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Film,
  Heart,
  Users,
  Upload,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Clock,
  Search,
  CheckCircle2,
  VideoOff,
  Pencil
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getDashboardStatsApi, getDashboardVideosApi } from "../api/dashboard.api";
import { deleteVideoApi, togglePublishStatusApi } from "../api/video.api";
import { confirmToast } from "../utils/confirmToast";
import { formatTime } from "../components/player/useVideoPlayer";

const formatNumber = (num = 0) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [tableSearch, setTableSearch] = useState("");

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStatsApi,
    select: (response) => response?.data,
  });

  const { data: videosData, isLoading: videosLoading } = useQuery({
    queryKey: ["dashboard-videos"],
    queryFn: getDashboardVideosApi,
    select: (response) => response?.data ?? [],
  });

  const deleteVideoMutation = useMutation({
    mutationFn: deleteVideoApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-videos"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Video deleted successfully");
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to delete video";
      toast.error(msg);
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: togglePublishStatusApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-videos"] });
      const isPub = response?.data?.isPublished;
      toast.success(isPub ? "Video is now Public" : "Video set to Draft");
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to toggle publish status";
      toast.error(msg);
    },
  });

  const stats = statsData || {
    totalVideos: 0,
    totalSubscribers: 0,
    totalLikes: 0,
  };

  const rawVideos = Array.isArray(videosData) ? videosData : [];

  const filteredVideos = rawVideos.filter((v) =>
    tableSearch ? v.title?.toLowerCase().includes(tableSearch.toLowerCase()) : true
  );

  const handleDeleteVideo = (video) => {
    confirmToast({
      title: `Delete "${video.title}"?`,
      message: "This video will be permanently removed from your channel.",
      confirmText: "Delete Video",
      onConfirm: () => {
        deleteVideoMutation.mutate(video._id);
      },
    });
  };

  return (
    <div className="w-full space-y-7 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/8 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#FAFAF8]">
              Creator Studio
            </h1>
            <span className="rounded-xs bg-[#FF5A36]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#FF5A36] border border-[#FF5A36]/20">
              Channel Overview
            </span>
          </div>
          <p className="text-xs font-mono text-[#71717A] mt-1">
            Real-time channel performance metrics, uploaded video registry, and content management.
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex items-center gap-2 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] px-4 py-2 font-mono text-xs font-bold transition active:scale-95 cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <Upload size={14} />
          <span>Upload Video</span>
        </Link>
      </div>

      {/* 3 Real KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Videos */}
        <div className="rounded-lg border border-white/8 bg-[#121212] p-5 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-[#71717A] uppercase tracking-wider">
            <span>Total Videos</span>
            <Film size={15} className="text-[#FF5A36]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-black text-[#FAFAF8]">
              {stats.totalVideos ?? 0}
            </span>
            <span className="font-mono text-[11px] text-[#71717A]">uploaded</span>
          </div>
        </div>

        {/* Total Subscribers */}
        <div className="rounded-lg border border-white/8 bg-[#121212] p-5 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-[#71717A] uppercase tracking-wider">
            <span>Subscribers</span>
            <Users size={15} className="text-[#2DD4BF]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-black text-[#FAFAF8]">
              {formatNumber(stats.totalSubscribers ?? 0)}
            </span>
            <span className="font-mono text-[11px] text-[#71717A]">members</span>
          </div>
        </div>

        {/* Total Likes */}
        <div className="rounded-lg border border-white/8 bg-[#121212] p-5 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-[#71717A] uppercase tracking-wider">
            <span>Total Likes</span>
            <Heart size={15} className="text-[#E5A93C]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-black text-[#FAFAF8]">
              {formatNumber(stats.totalLikes ?? 0)}
            </span>
            <span className="font-mono text-[11px] text-[#71717A]">community likes</span>
          </div>
        </div>
      </div>

      {/* Publication Ledger Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/8 pb-3">
          <div className="flex items-center gap-2">
            <Film size={16} className="text-[#FF5A36]" />
            <h2 className="font-display font-bold text-base text-[#FAFAF8]">
              Channel Videos ({rawVideos.length})
            </h2>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Filter by title..."
              className="w-full rounded-md border border-white/10 bg-[#121212] px-3 py-1.5 text-xs text-[#FAFAF8] placeholder:text-[#71717A] outline-none focus:border-[#FF5A36]"
            />
            <Search size={13} className="absolute right-2.5 top-2.5 text-[#71717A] pointer-events-none" />
          </div>
        </div>

        {videosLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-16 w-full rounded-md bg-[#121212] border border-white/6 animate-pulse" />
            ))}
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="rounded-lg border border-white/8 bg-[#121212] p-12 text-center space-y-3.5">
            <VideoOff size={36} className="mx-auto text-[#71717A]" />
            <h3 className="font-display font-bold text-base text-[#FAFAF8]">
              {tableSearch ? "No videos matched your filter" : "No videos published yet"}
            </h3>
            <p className="font-mono text-xs text-[#71717A] max-w-sm mx-auto">
              Upload your first video to start viewing audience metrics and channel management tools.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] px-4 py-2 font-mono text-xs font-bold text-[#0A0A0A]"
            >
              <Upload size={13} />
              <span>Upload Video</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-white/8 bg-[#121212]">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/8 bg-[#18181B] text-[#71717A]">
                  <th className="py-3 px-4 uppercase tracking-wider font-semibold">Video</th>
                  <th className="py-3 px-4 uppercase tracking-wider font-semibold">Status</th>
                  <th className="py-3 px-4 uppercase tracking-wider font-semibold">Views</th>
                  <th className="py-3 px-4 uppercase tracking-wider font-semibold">Date</th>
                  <th className="py-3 px-4 uppercase tracking-wider font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {filteredVideos.map((video) => (
                  <tr key={video._id} className="hover:bg-[#18181B]/50 transition-colors">
                    {/* Video Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/videos/${video._id}`}
                          className="relative aspect-video h-12 w-20 shrink-0 overflow-hidden rounded bg-[#18181B] border border-white/8"
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="h-full w-full object-cover"
                          />
                          {video.duration !== undefined && (
                            <span className="absolute bottom-0.5 right-0.5 rounded-xs bg-black/90 px-1 py-0.2 text-[8px] text-[#FAFAF8]">
                              {formatTime(video.duration)}
                            </span>
                          )}
                        </Link>
                        <div className="min-w-0 max-w-xs sm:max-w-md">
                          <Link
                            to={`/videos/${video._id}`}
                            className="font-display font-bold text-xs text-[#FAFAF8] hover:text-[#FF5A36] transition-colors line-clamp-1 block"
                          >
                            {video.title}
                          </Link>
                          <p className="font-sans text-[11px] text-[#71717A] line-clamp-1 mt-0.5">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => togglePublishMutation.mutate(video._id)}
                        disabled={togglePublishMutation.isPending}
                        title={video.isPublished ? "Click to unpublish (set to Draft)" : "Click to publish"}
                        className={`inline-flex items-center gap-1 rounded-xs px-2 py-0.5 text-[10px] font-semibold border transition cursor-pointer ${
                          video.isPublished
                            ? "bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/20 hover:bg-[#2DD4BF]/20"
                            : "bg-[#E5A93C]/10 text-[#E5A93C] border-[#E5A93C]/20 hover:bg-[#E5A93C]/20"
                        }`}
                      >
                        {video.isPublished ? <CheckCircle2 size={10} /> : <EyeOff size={10} />}
                        <span>{video.isPublished ? "Public" : "Draft"}</span>
                      </button>
                    </td>

                    {/* Views */}
                    <td className="py-3 px-4 text-[#FAFAF8]">
                      {formatNumber(video.views || 0)}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-[#71717A]">
                      {video.createdAt
                        ? new Date(video.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recently"}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/videos/${video._id}/edit`}
                          className="p-1.5 rounded text-[#71717A] hover:text-[#FF5A36] hover:bg-white/6 transition"
                          title="Edit video"
                        >
                          <Pencil size={13} />
                        </Link>

                        <Link
                          to={`/videos/${video._id}`}
                          className="p-1.5 rounded text-[#71717A] hover:text-[#FAFAF8] hover:bg-white/6 transition"
                          title="View on site"
                        >
                          <ExternalLink size={13} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(video)}
                          disabled={deleteVideoMutation.isPending}
                          className="p-1.5 rounded text-[#71717A] hover:text-[#EF4444] hover:bg-white/6 transition cursor-pointer"
                          title="Delete video"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
