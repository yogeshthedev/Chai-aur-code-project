import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Share2,
  ListPlus,
  UserCircle,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getVideoByIdApi, getVideosApi } from "../api/video.api";
import { toggleVideoLikeApi } from "../api/like.api";
import CommentSection from "../components/CommentSection";
import SaveToPlaylistModal from "../components/SaveToPlaylistModal";
import SubscribeButton from "../components/SubscribeButton";
import { useAuthStore } from "../store/useAuthStore";

const formatViews = (views = 0) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
};

const VideoDetail = () => {
  const { videoId } = useParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideoByIdApi(videoId),
    enabled: Boolean(videoId),
  });

  // Fetch recommended videos
  const { data: recommendedData } = useQuery({
    queryKey: ["videos", { page: 1, limit: 8, query: "" }],
    queryFn: () => getVideosApi({ page: 1, limit: 8, query: "" }),
  });

  const video = data?.data;
  const recommendedVideos = (recommendedData?.data?.videos ?? []).filter(
    (v) => v._id !== videoId
  );

  const toggleLikeMutation = useMutation({
    mutationFn: () => toggleVideoLikeApi(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
      queryClient.invalidateQueries({ queryKey: ["liked-videos"] });
    },
  });

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      toast.error("Unable to copy link");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="h-6 w-32 animate-pulse rounded-lg bg-slate-200/80 dark:bg-zinc-800" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video w-full animate-pulse rounded-3xl bg-slate-200/80 dark:bg-zinc-800" />
            <div className="h-7 w-3/4 animate-pulse rounded-lg bg-slate-200/80 dark:bg-zinc-800" />
            <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-200/80 dark:bg-zinc-800" />
          </div>
          <div className="lg:col-span-1 space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-20 w-36 rounded-2xl bg-slate-200/80 dark:bg-zinc-800 shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 w-full rounded bg-slate-200/80 dark:bg-zinc-800" />
                  <div className="h-3 w-1/2 rounded bg-slate-200/80 dark:bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !video) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/60 dark:bg-rose-950/20 p-8 text-center my-12 shadow-xs">
        <h2 className="text-lg font-bold text-rose-700 dark:text-rose-300">Video not found</h2>
        <p className="mt-2 text-xs text-rose-600/80 dark:text-rose-400/80">
          This video may have been removed or is currently unavailable.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-300 dark:border-zinc-700 px-5 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-700 transition shadow-xs"
        >
          <ArrowLeft size={14} /> Back to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Top breadcrumb navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft size={15} /> Back to feed
        </Link>
        <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
          Playing in Cinema Mode
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-7 lg:gap-8 items-start">
        {/* Main Watch Column: Player + Details + Comments */}
        <div className="xl:col-span-8 2xl:col-span-8 3xl:col-span-9 space-y-5">
          {/* Cinema Video Player Container */}
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-slate-200/90 dark:border-zinc-800 bg-black shadow-2xl shadow-indigo-500/5 group">
            <video
              controls
              autoPlay
              src={video.videoFile}
              poster={video.thumbnail}
              className="h-full w-full object-contain bg-black"
            />
          </div>

          {/* Title & Metadata Action Bar */}
          <div className="space-y-4 pt-1">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 leading-snug">
              {video.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-zinc-800/80">
              {/* Creator Info & Subscription */}
              <div className="flex items-center gap-3.5">
                <Link
                  to={video.owner?.username ? `/c/${video.owner.username}` : "#"}
                  className="flex items-center gap-3 group"
                >
                  <div className="relative">
                    {video.owner?.avatar ? (
                      <img
                        src={video.owner.avatar}
                        alt={video.owner.fullName || video.owner.username || "Channel"}
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-200 dark:ring-zinc-800 transition-transform group-hover:scale-105 shadow-sm"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 dark:bg-zinc-800 text-sm font-bold text-indigo-700 dark:text-zinc-200 ring-2 ring-slate-200 dark:ring-zinc-800">
                        {video.owner?.username ? video.owner.username.slice(0, 1).toUpperCase() : "C"}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {video.owner?.fullName || video.owner?.username || "Unknown Channel"}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                      {formatViews(video.owner?.subscriberCount || 0)} subscribers
                    </p>
                  </div>
                </Link>

                {video.owner?._id && user?._id !== video.owner._id && (
                  <div className="ml-2">
                    <SubscribeButton
                      channelId={video.owner._id}
                      isSubscribed={Boolean(video.owner.isSubscribed)}
                      subscriberCount={video.owner.subscriberCount || 0}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons Group */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Like Button */}
                <button
                  type="button"
                  onClick={() => toggleLikeMutation.mutate()}
                  disabled={toggleLikeMutation.isPending}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs ${
                    video.isLiked
                      ? "bg-indigo-50 text-indigo-600 border border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/60"
                      : "bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <ThumbsUp size={15} className={video.isLiked ? "fill-current" : ""} />
                  <span>{formatViews(video.likeCount)}</span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-800 px-4 py-2 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <Share2 size={15} />
                  <span>Share</span>
                </button>

                {/* Save to playlist */}
                <button
                  type="button"
                  onClick={() => setIsPlaylistModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-800 px-4 py-2 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <ListPlus size={15} />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div
            onClick={() => setIsDescriptionExpanded((p) => !p)}
            className="cursor-pointer rounded-3xl border border-slate-200/80 bg-white/90 hover:bg-white dark:border-zinc-800/90 dark:bg-zinc-900/60 dark:hover:bg-zinc-900/80 p-5 md:p-6 transition shadow-xs space-y-3"
          >
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-zinc-400">
              <span className="font-bold text-slate-900 dark:text-zinc-100">{formatViews(video.views)} views</span>
              <span>•</span>
              <span>
                {video.createdAt
                  ? new Date(video.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Recently"}
              </span>
            </div>

            <p
              className={`whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-zinc-300 ${
                isDescriptionExpanded ? "" : "line-clamp-3"
              }`}
            >
              {video.description || "No description provided."}
            </p>

            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              {isDescriptionExpanded ? (
                <>
                  Show less <ChevronUp size={14} />
                </>
              ) : (
                <>
                  Show more <ChevronDown size={14} />
                </>
              )}
            </button>
          </div>

          {/* Comments Section */}
          <CommentSection
            videoId={videoId}
            likeCount={video.likeCount || 0}
            isLiked={Boolean(video.isLiked)}
            videoOwnerId={video.owner?._id}
          />
        </div>

        {/* Sidebar - Up Next (Sticky on Desktop) */}
        <div className="xl:col-span-4 2xl:col-span-4 3xl:col-span-3 space-y-4 xl:sticky xl:top-20">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Related Videos
            </h2>
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
              {recommendedVideos.length} recommendations
            </span>
          </div>

          <div className="space-y-3">
            {recommendedVideos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 p-6 text-center text-xs text-slate-500 dark:text-zinc-500">
                No related videos found at this moment.
              </div>
            ) : (
              recommendedVideos.map((rec) => (
                <Link
                  key={rec._id}
                  to={`/videos/${rec._id}`}
                  className="group flex gap-3.5 rounded-2xl p-2.5 transition-all duration-200 bg-white/60 hover:bg-white dark:bg-zinc-900/40 dark:hover:bg-zinc-900 border border-slate-200/70 hover:border-slate-300 dark:border-zinc-800/80 dark:hover:border-zinc-700 shadow-2xs hover:shadow-xs"
                >
                  <div className="relative aspect-video h-20 w-36 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-800">
                    <img
                      src={rec.thumbnail}
                      alt={rec.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-center py-0.5">
                    <h3 className="line-clamp-2 text-xs font-bold leading-snug text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {rec.title}
                    </h3>
                    <p className="mt-1 truncate text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                      {rec.owner?.fullName || rec.owner?.username || "Creator"}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                      {formatViews(rec.views)} views
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <SaveToPlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        videoId={videoId}
      />
    </div>
  );
};

export default VideoDetail;


