import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { formatTime } from "../player/useVideoPlayer";

const formatViews = (views = 0) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
};

const VideoCard = ({ video }) => {
  if (!video) return null;

  return (
    <div className="group flex flex-col min-w-0 transition-colors duration-150">
      {/* Video Thumbnail Frame (16:9 ratio, 8px radius, subtle border) */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[#121212] border border-white/8 transition-all duration-200 group-hover:border-white/20">
        <Link to={`/videos/${video._id}`} className="block h-full w-full">
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-75 transition-opacity duration-200" />

          {/* Center Play Icon on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF5A36] text-[#0A0A0A] shadow-xl">
              <Play size={18} className="fill-current ml-0.5" />
            </div>
          </div>
        </Link>

        {/* Bottom Duration Badge (JetBrains Mono) */}
        {video.duration !== undefined && (
          <div className="absolute bottom-2 right-2 rounded-xs bg-[#0A0A0A]/90 px-1.5 py-0.5 text-[10px] font-mono text-[#FAFAF8] border border-white/10 backdrop-blur-md">
            {formatTime(video.duration)}
          </div>
        )}
      </div>

      {/* Video Details & Meta Information */}
      <div className="mt-3 flex gap-3 min-w-0">
        {/* Channel Avatar */}
        <Link
          to={video.owner?.username ? `/c/${video.owner.username}` : "#"}
          className="shrink-0 pt-0.5 group/avatar"
        >
          {video.owner?.avatar ? (
            <img
              src={video.owner.avatar}
              alt={video.owner.username || "Channel"}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10 group-hover/avatar:ring-[#FF5A36] transition-all duration-150"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-[#FAFAF8] ring-1 ring-white/10">
              {video.owner?.username ? video.owner.username.slice(0, 1).toUpperCase() : "U"}
            </div>
          )}
        </Link>

        {/* Video Title & Secondary Metadata */}
        <div className="min-w-0 flex-1">
          <Link to={`/videos/${video._id}`} className="block">
            <h3 className="font-display font-bold text-sm sm:text-[15px] leading-snug text-[#FAFAF8] line-clamp-2 transition-colors duration-150 group-hover:text-[#FF5A36]">
              {video.title}
            </h3>
          </Link>

          {/* Channel Name */}
          <div className="mt-1 flex items-center gap-1.5 truncate text-xs font-medium text-[#A1A1AA] hover:text-[#FAFAF8] transition-colors">
            <Link
              to={video.owner?.username ? `/c/${video.owner.username}` : "#"}
              className="truncate hover:underline"
            >
              {video.owner?.fullName || video.owner?.username || "Creator"}
            </Link>
          </div>

          {/* Metrics Line (Views • Timestamp) */}
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-mono text-[#71717A]">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>
              {video.createdAt
                ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })
                : "Recently"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
