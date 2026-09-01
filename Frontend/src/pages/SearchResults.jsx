import { useQuery } from "@tanstack/react-query";
import {
  VideoOff,
  ListPlus,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getVideosApi } from "../api/video.api";
import { formatTime } from "../components/player/useVideoPlayer";
import SaveToPlaylistModal from "../components/SaveToPlaylistModal";
import { useAuthStore } from "../store/useAuthStore";

const formatViews = (views = 0) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
};

const SearchResults = () => {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [selectedVideoForPlaylist, setSelectedVideoForPlaylist] = useState(null);

  const { data: videosData, isLoading, isError } = useQuery({
    queryKey: ["videos", { page: 1, limit: 50, query }],
    queryFn: () => getVideosApi({ page: 1, limit: 50, query }),
    enabled: Boolean(query),
  });

  const videos = videosData?.data?.videos ?? [];

  return (
    <div className="w-full space-y-7 pb-16">
      {/* Search Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/8 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#FAFAF8]">
              Search: <span className="text-[#FF5A36]">"{query}"</span>
            </h1>
            <span className="rounded-xs bg-[#FF5A36]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#FF5A36] border border-[#FF5A36]/20">
              {videos.length} Results
            </span>
          </div>
          <p className="text-xs font-mono text-[#71717A] mt-1">
            Videos matching your search query from the database.
          </p>
        </div>
      </div>

      {/* Main Video Results List */}
      <div className="space-y-4">
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-32 w-full rounded-md bg-[#121212] border border-white/6 animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && !isError && videos.length === 0 && (
          <div className="rounded-lg border border-white/8 bg-[#121212] p-12 text-center space-y-3">
            <VideoOff size={36} className="mx-auto text-[#71717A]" />
            <h3 className="font-display font-bold text-base text-[#FAFAF8]">
              No videos found matching "{query}"
            </h3>
            <p className="font-mono text-xs text-[#71717A] max-w-sm mx-auto">
              Try searching with different keywords or check out the home feed.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] px-4 py-2 font-mono text-xs font-bold text-[#0A0A0A]"
            >
              Browse All Videos
            </Link>
          </div>
        )}

        {!isLoading && videos.length > 0 && (
          <div className="space-y-3">
            {videos.map((video) => (
              <div
                key={video._id}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-white/8 bg-[#121212] hover:bg-[#18181B] hover:border-white/16 transition-colors group"
              >
                {/* 16:9 Thumbnail */}
                <Link
                  to={`/videos/${video._id}`}
                  className="relative aspect-video w-full sm:w-64 sm:h-36 shrink-0 overflow-hidden rounded-md bg-[#18181B] border border-white/8 cursor-pointer"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {video.duration !== undefined && (
                    <span className="absolute bottom-1.5 right-1.5 rounded-xs bg-[#0A0A0A]/90 px-1.5 py-0.5 font-mono text-[10px] text-[#FAFAF8] border border-white/10">
                      {formatTime(video.duration)}
                    </span>
                  )}
                </Link>

                {/* Content & Metadata */}
                <div className="min-w-0 flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#71717A] uppercase tracking-wider">
                      <span>{formatViews(video.views)} views</span>
                      <span>•</span>
                      <span>
                        {video.createdAt
                          ? new Date(video.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Recently"}
                      </span>
                    </div>

                    <Link
                      to={`/videos/${video._id}`}
                      className="font-display font-bold text-sm sm:text-base text-[#FAFAF8] group-hover:text-[#FF5A36] transition-colors leading-snug line-clamp-1"
                    >
                      {video.title}
                    </Link>

                    <p className="font-sans text-xs text-[#A1A1AA] line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  {/* Channel Strip & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/6 font-mono text-xs">
                    <Link
                      to={video.owner?.username ? `/c/${video.owner.username}` : "#"}
                      className="flex items-center gap-2 hover:text-[#FF5A36] text-[#D4D4D8] transition"
                    >
                      {video.owner?.avatar ? (
                        <img
                          src={video.owner.avatar}
                          alt={video.owner.username}
                          className="h-5 w-5 rounded-full object-cover ring-1 ring-white/10"
                        />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-[#18181B] text-[9px] font-bold flex items-center justify-center text-[#FAFAF8]">
                          {video.owner?.username?.slice(0, 1).toUpperCase() || "U"}
                        </div>
                      )}
                      <span className="font-semibold text-xs">
                        {video.owner?.fullName || video.owner?.username || "Creator"}
                      </span>
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!user) {
                            toast.error("Please sign in to save videos to playlists");
                            return;
                          }
                          setSelectedVideoForPlaylist(video._id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#18181B] hover:bg-[#222226] text-[#FAFAF8] border border-white/8 text-[11px] transition cursor-pointer"
                      >
                        <ListPlus size={12} />
                        <span>Save</span>
                      </button>

                      <Link
                        to={`/videos/${video._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] font-bold text-[11px] transition cursor-pointer"
                      >
                        <span>Watch</span>
                        <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SaveToPlaylistModal
        isOpen={Boolean(selectedVideoForPlaylist)}
        onClose={() => setSelectedVideoForPlaylist(null)}
        videoId={selectedVideoForPlaylist}
      />
    </div>
  );
};

export default SearchResults;
