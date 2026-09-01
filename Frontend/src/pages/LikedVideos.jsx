import { useQuery } from "@tanstack/react-query";
import { Play, VideoOff } from "lucide-react";
import { Link } from "react-router-dom";
import { getLikedVideosApi } from "../api/like.api";
import VideoCard from "../components/video/VideoCard";

const LikedVideos = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["liked-videos"],
    queryFn: () => getLikedVideosApi().catch(() => null),
  });

  const rawVideos = data?.data ?? [];
  const videos = Array.isArray(rawVideos)
    ? rawVideos.map((item) => item.video || item).filter(Boolean)
    : [];
  const firstVideo = videos[0];

  return (
    <div className="w-full space-y-7 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/8 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#FAFAF8]">
              Liked Publications
            </h1>
            <span className="rounded-xs bg-[#FF5A36]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#FF5A36] border border-[#FF5A36]/20">
              {videos.length} Saved
            </span>
          </div>
          <p className="text-xs font-mono text-[#71717A] mt-1">
            Personal vault of bookmarked masterclasses, technical papers, and lab demonstrations.
          </p>
        </div>

        {firstVideo && (
          <Link
            to={`/videos/${firstVideo._id}`}
            className="inline-flex items-center gap-2 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] px-4 py-2 text-xs font-mono font-bold transition active:scale-95 cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <Play size={14} className="fill-current" />
            <span>Play Vault Sequence</span>
          </Link>
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
            No liked videos yet
          </h2>
          <p className="font-mono text-xs text-[#71717A] max-w-sm mx-auto">
            Explore publications and like videos to save them to your personal collection.
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

export default LikedVideos;



