import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Upload,
  RefreshCw,
  VideoOff
} from "lucide-react";
import { getVideosApi } from "../api/video.api";
import VideoCard from "../components/video/VideoCard";

const CATEGORIES = [
  "All",
  "Technology",
  "Programming",
  "Design",
  "Music",
  "Education",
  "Gaming",
  "Science",
];

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const activeCategory = searchParams.get("category") || "All";

  // Query backend for real videos
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["videos", { page: 1, limit: 30, query }],
    queryFn: () => getVideosApi({ page: 1, limit: 30, query }),
  });

  const videos = data?.data?.videos ?? [];

  // Filter based on active category (case-insensitive description or title match if category field isn't stored)
  const filteredVideos = videos.filter((v) => {
    if (activeCategory === "All") return true;
    const cat = activeCategory.toLowerCase();
    const titleMatch = v.title?.toLowerCase().includes(cat);
    const descMatch = v.description?.toLowerCase().includes(cat);
    const catMatch = v.category?.toLowerCase() === cat;
    return titleMatch || descMatch || catMatch;
  });

  const handleCategoryClick = (cat) => {
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="w-full space-y-7 pb-16">
      {/* 1. Category Filter Strip */}
      <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-0.5">
          {CATEGORIES.map((cat) => {
            const isActive =
              (cat === "All" && (!activeCategory || activeCategory === "All")) ||
              activeCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`shrink-0 rounded-md px-3.5 py-1.5 text-xs font-mono transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-[#FF5A36] text-[#0A0A0A] font-bold shadow-xs"
                    : "bg-[#121212] text-[#A1A1AA] border border-white/8 hover:text-[#FAFAF8] hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Video Count Indicator */}
        <span className="hidden sm:inline-block font-mono text-xs text-[#71717A] shrink-0">
          {filteredVideos.length} {filteredVideos.length === 1 ? "video" : "videos"}
        </span>
      </div>

      {/* 2. Active Search Query Header */}
      {query && (
        <div className="flex items-center justify-between border-b border-white/8 pb-3">
          <h1 className="font-display font-bold text-xl text-[#FAFAF8]">
            Search Results for: <span className="text-[#FF5A36]">"{query}"</span>
          </h1>
          <span className="font-mono text-xs text-[#71717A]">
            {filteredVideos.length} matching
          </span>
        </div>
      )}

      {/* 3. Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-7">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="aspect-video w-full rounded-md bg-[#18181B] border border-white/6" />
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-[#18181B] shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-4/5 rounded bg-[#18181B]" />
                  <div className="h-3 w-1/2 rounded bg-[#18181B]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Error State */}
      {isError && (
        <div className="rounded-lg border border-white/8 bg-[#121212] p-8 text-center space-y-3">
          <p className="font-mono text-xs text-[#EF4444]">
            Unable to connect to the backend server to load publications.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#18181B] hover:bg-[#222226] border border-white/10 font-mono text-xs text-[#FAFAF8] cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* 5. Empty State */}
      {!isLoading && !isError && filteredVideos.length === 0 && (
        <div className="rounded-lg border border-white/8 bg-[#121212] p-12 text-center space-y-3.5">
          <VideoOff size={36} className="mx-auto text-[#71717A]" />
          <h2 className="font-display font-bold text-base text-[#FAFAF8]">
            No publications found
          </h2>
          <p className="font-mono text-xs text-[#71717A] max-w-sm mx-auto">
            {query
              ? `No videos matched "${query}". Try searching for another topic or clear the filter.`
              : "No videos have been uploaded yet. Be the first to publish a video to the platform!"}
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] px-4 py-2 font-mono text-xs font-bold transition cursor-pointer"
          >
            <Upload size={14} />
            <span>Upload Video</span>
          </Link>
        </div>
      )}

      {/* 6. Clean Real Video Grid */}
      {!isLoading && !isError && filteredVideos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-7">
          {filteredVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;




