import { VideoOff, RefreshCw, Sparkles, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getVideosApi } from "../api/video.api";
import VideoCard from "../components/video/VideoCard";

const CATEGORIES = [
  "All",
  "Gaming",
  "Coding",
  "Music",
  "Tech",
  "Podcasts",
  "Design",
  "Tutorials",
  "AI & ML",
  "Vlogs",
  "Web Dev",
];

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const activeCategory = searchParams.get("category") || "All";

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["videos", { page: 1, limit: 24, query }],
    queryFn: () => getVideosApi({ page: 1, limit: 24, query }),
  });

  const videos = data?.data?.videos ?? [];

  const handleCategoryClick = (category) => {
    if (category === "All") {
      searchParams.delete("category");
      searchParams.delete("q");
    } else {
      searchParams.set("category", category);
      searchParams.set("q", category);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="w-full space-y-6">
      {/* Category Filter Chips Carousel */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
        {CATEGORIES.map((category) => {
          const isActive =
            (category === "All" && !query && activeCategory === "All") ||
            activeCategory === category ||
            query.toLowerCase() === category.toLowerCase();

          return (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-xs shadow-indigo-500/20"
                  : "bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Header section (if search query active) */}
      {query && (
        <div className="flex items-center justify-between pt-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            Results for <span className="text-indigo-600 dark:text-indigo-400 font-semibold">"{query}"</span>
          </h1>
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            {videos.length} {videos.length === 1 ? "video" : "videos"}
          </span>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-x-5 gap-y-8">
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className="animate-pulse space-y-3.5">
              <div className="aspect-video w-full rounded-2xl bg-slate-200/80 dark:bg-zinc-800/80" />
              <div className="flex gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200/80 dark:bg-zinc-800/80" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 w-4/5 rounded-md bg-slate-200/80 dark:bg-zinc-800/80" />
                  <div className="h-3 w-1/2 rounded-md bg-slate-200/80 dark:bg-zinc-800/80" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-3xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 p-8 text-center max-w-lg mx-auto my-12 shadow-xs">
          <h2 className="font-bold text-base text-rose-700 dark:text-rose-400">
            Unable to load video feed
          </h2>
          <p className="mt-1.5 text-xs text-rose-600/80 dark:text-rose-400/80">
            Please make sure the backend server is running, then try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Try again</span>
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && videos.length === 0 && (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 p-8 text-center bg-white/50 dark:bg-zinc-900/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-zinc-400 mb-3 shadow-xs">
            <VideoOff size={24} />
          </div>
          <h2 className="font-bold text-base text-slate-900 dark:text-zinc-100">
            {query ? "No matching videos found" : "No videos published yet"}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 max-w-xs">
            {query
              ? "Try searching for a different keyword or browse all categories."
              : "Be the first creator to upload and share videos with the community."}
          </p>
        </div>
      )}

      {/* Video Grid - Full Width Adaptive */}
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

export default Home;


