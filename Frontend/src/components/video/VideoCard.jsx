import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { Play, CheckCircle2 } from "lucide-react";

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
    <div className="group flex flex-col min-w-0 transition-transform duration-200">
      {/* Video Thumbnail Link */}
      <Link
        to={`/videos/${video._id}`}
        className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs group-hover:shadow-md transition-all duration-300"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Subtle gradient vignette on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 dark:bg-zinc-900/90 text-indigo-600 dark:text-indigo-400 shadow-xl backdrop-blur-md transform scale-90 group-hover:scale-100 transition-transform duration-200">
            <Play size={20} className="fill-current ml-0.5" />
          </div>
        </div>

        {/* Duration Badge */}
        {video.duration !== undefined && (
          <span className="absolute bottom-2.5 right-2.5 rounded-lg bg-black/75 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-md shadow-sm">
            {formatDuration(video.duration)}
          </span>
        )}
      </Link>

      {/* Video Meta Info */}
      <div className="mt-3.5 flex gap-3 min-w-0">
        {/* Channel Avatar */}
        <Link
          to={video.owner?.username ? `/c/${video.owner.username}` : "#"}
          className="shrink-0 transition-transform hover:scale-105 active:scale-95 pt-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          {video.owner?.avatar ? (
            <img
              src={video.owner.avatar}
              alt={video.owner.username || "Channel"}
              className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-zinc-800"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-zinc-800 text-xs font-bold text-indigo-700 dark:text-zinc-200 ring-1 ring-slate-200 dark:ring-zinc-800">
              {video.owner?.username ? video.owner.username.slice(0, 1).toUpperCase() : "V"}
            </div>
          )}
        </Link>

        {/* Title & Metadata */}
        <div className="min-w-0 flex-1">
          <Link to={`/videos/${video._id}`} className="block">
            <h3 className="line-clamp-2 text-[15px] sm:text-base font-bold leading-snug tracking-tight text-slate-900 dark:text-zinc-100 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              {video.title}
            </h3>
          </Link>

          <Link
            to={video.owner?.username ? `/c/${video.owner.username}` : "#"}
            className="mt-1 inline-flex items-center gap-1 truncate text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{video.owner?.fullName || video.owner?.username || "Unknown Creator"}</span>
          </Link>

          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-500">
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


