import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const formatViews = (views = 0) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
};

const formatDuration = (duration = 0) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const VideoCard = ({ video }) => {
  if (!video) return null;

  return (
    <div className="group flex flex-col min-w-0">
      {/* Video Thumbnail Link */}
      <Link
        to={`/videos/${video._id}`}
        className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-800 shadow-2xs"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />

        {/* Hover Play Icon Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 dark:bg-zinc-900/90 text-slate-900 dark:text-white shadow-lg backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
            <Play size={18} className="fill-current ml-0.5 text-red-600" />
          </div>
        </div>

        {/* Duration Badge */}
        {video.duration !== undefined && (
          <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/80 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md">
            {formatDuration(video.duration)}
          </span>
        )}
      </Link>

      {/* Video Meta Info */}
      <div className="mt-3 flex gap-3 min-w-0">
        {/* Channel Avatar */}
        <Link
          to={video.owner?.username ? `/c/${video.owner.username}` : "#"}
          className="shrink-0 transition-transform hover:scale-105 active:scale-95"
          onClick={(e) => e.stopPropagation()}
        >
          {video.owner?.avatar ? (
            <img
              src={video.owner.avatar}
              alt={video.owner.username || "Channel"}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-zinc-800"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 dark:bg-zinc-800 text-xs font-bold text-slate-800 dark:text-zinc-100">
              {video.owner?.username ? video.owner.username.slice(0, 1).toUpperCase() : "V"}
            </div>
          )}
        </Link>

        {/* Title & Metadata */}
        <div className="min-w-0 flex-1">
          <Link to={`/videos/${video._id}`}>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 dark:text-zinc-100 transition-colors group-hover:text-red-600 dark:group-hover:text-red-500">
              {video.title}
            </h3>
          </Link>

          <Link
            to={video.owner?.username ? `/c/${video.owner.username}` : "#"}
            className="mt-1 block truncate text-xs font-medium text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {video.owner?.fullName || video.owner?.username || "Unknown Channel"}
          </Link>

          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-500">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>
              {video.createdAt
                ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })
                : "Just now"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

