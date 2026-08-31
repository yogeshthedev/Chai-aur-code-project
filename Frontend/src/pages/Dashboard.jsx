import { useQuery } from "@tanstack/react-query";
import { BarChart3, Film, Heart, Users, Upload, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getDashboardStatsApi, getDashboardVideosApi } from "../api/dashboard.api";
import VideoCard from "../components/video/VideoCard";

const Dashboard = () => {
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

  const stats = statsData ?? {
    totalVideos: 0,
    totalSubscribers: 0,
    totalLikes: 0,
  };

  const cards = [
    { label: "Total Videos", value: stats.totalVideos, icon: Film, color: "text-indigo-600 bg-indigo-500/10 dark:text-indigo-400 dark:bg-indigo-500/20" },
    { label: "Subscribers", value: stats.totalSubscribers, icon: Users, color: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/20" },
    { label: "Total Likes", value: stats.totalLikes, icon: Heart, color: "text-violet-600 bg-violet-500/10 dark:text-violet-400 dark:bg-violet-500/20" },
  ];

  return (
    <div className="w-full space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
            <Sparkles size={13} />
            <span>Channel Analytics</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            Creator Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Monitor your channel metrics, audience growth, and content performance
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition self-start sm:self-auto cursor-pointer"
        >
          <Upload size={15} />
          <span>Upload Video</span>
        </Link>
      </div>

      {/* Metric Cards */}
      {statsLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-zinc-800/80" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-5 md:p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  {label}
                </span>
                <div className={`rounded-xl p-2.5 ${color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-zinc-100">
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Videos Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Your Uploads</h2>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              ({videosData?.length || 0})
            </span>
          </div>
        </div>

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
        ) : videosData?.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 p-8 text-center">
            <Film size={28} className="text-slate-400 dark:text-zinc-500 mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">No videos uploaded yet</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 max-w-xs">
              Upload your first video to start building your channel audience and stats.
            </p>
            <Link
              to="/upload"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition cursor-pointer"
            >
              <Upload size={14} /> Upload First Video
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-x-5 gap-y-8">
            {videosData.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


