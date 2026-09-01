import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Share2,
  ListPlus,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  MessageSquare,
  BookOpen,
  ListOrdered,
  Check,
  VideoOff
} from "lucide-react";
import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getVideoByIdApi, getVideosApi } from "../api/video.api";
import { toggleVideoLikeApi } from "../api/like.api";
import CommentSection from "../components/CommentSection";
import SaveToPlaylistModal from "../components/SaveToPlaylistModal";
import SubscribeButton from "../components/SubscribeButton";
import { CustomVideoPlayer } from "../components/player";
import { formatTime } from "../components/player/useVideoPlayer";
import { VideoNotesSection } from "../components/notes";
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
  const playerRef = useRef(null);
  const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
  const [activeBottomTab, setActiveBottomTab] = useState("discussion"); // 'discussion' | 'notes' | 'chapters'
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideoByIdApi(videoId),
    enabled: Boolean(videoId),
    select: (response) => response?.data,
  });

  // Fetch recommended videos from backend
  const { data: recommendedData } = useQuery({
    queryKey: ["videos", { page: 1, limit: 8 }],
    queryFn: () => getVideosApi({ page: 1, limit: 8 }),
    select: (response) => response?.data?.videos ?? [],
  });

  const video = data;

  const currentUserId = user?._id?.toString();
  const videoOwnerId = (video?.owner?._id || video?.owner)?.toString();
  const isOwnVideo = Boolean(currentUserId && videoOwnerId && currentUserId === videoOwnerId);

  const likeMutation = useMutation({
    mutationFn: () => toggleVideoLikeApi(videoId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["video", videoId] });
      const previous = queryClient.getQueryData(["video", videoId]);

      queryClient.setQueryData(["video", videoId], (old) => {
        if (!old) return old;
        const currentVideo = old.data || old;
        const currentIsLiked = Boolean(currentVideo.isLiked);
        const currentCount = currentVideo.likesCount ?? currentVideo.likeCount ?? 0;
        const nextCount = currentIsLiked ? Math.max(0, currentCount - 1) : currentCount + 1;
        const nextIsLiked = !currentIsLiked;

        if (old.data) {
          return {
            ...old,
            data: {
              ...old.data,
              isLiked: nextIsLiked,
              likesCount: nextCount,
              likeCount: nextCount,
            },
          };
        }
        return {
          ...old,
          isLiked: nextIsLiked,
          likesCount: nextCount,
          likeCount: nextCount,
        };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["video", videoId], context.previous);
      }
      toast.error("Failed to update like status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
      queryClient.invalidateQueries({ queryKey: ["liked-videos"] });
    },
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Video link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSeek = (time) => {
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(time);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="aspect-video w-full rounded-md bg-[#18181B] border border-white/6 animate-pulse" />
        <div className="h-20 w-full rounded-md bg-[#18181B] border border-white/6 animate-pulse" />
      </div>
    );
  }

  if (isError || !video) {
    return (
      <div className="rounded-lg border border-white/8 bg-[#121212] p-12 text-center space-y-4 my-10 max-w-lg mx-auto">
        <VideoOff size={36} className="mx-auto text-[#71717A]" />
        <h2 className="font-display font-bold text-lg text-[#FAFAF8]">Video Not Found</h2>
        <p className="font-mono text-xs text-[#71717A]">
          This video may have been removed, or the link is broken.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] px-4 py-2 font-mono text-xs font-bold text-[#0A0A0A]"
        >
          <ArrowLeft size={13} />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  const chapters = video.chapters || [];
  const recommendedVideos = (recommendedData || []).filter((v) => v._id !== videoId);

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-white/8 pb-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#A1A1AA] hover:text-[#FF5A36] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Home</span>
          <span className="text-white/20">/</span>
          <span className="text-[#FAFAF8] truncate max-w-xs">{video.title}</span>
        </Link>
      </div>

      {/* Main 12-Column Responsive Cinema Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8-Column Player & Work Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Custom Cinema Player */}
          <div className="overflow-hidden rounded-lg border border-white/8 bg-black shadow-2xl">
            <CustomVideoPlayer
              ref={playerRef}
              src={video.videoFile}
              poster={video.thumbnail}
              title={video.title}
              onTimeUpdate={setPlayerCurrentTime}
            />
          </div>

          {/* Video Title & Quick Actions */}
          <div className="space-y-4">
            <h1 className="font-display font-black text-xl sm:text-2xl text-[#FAFAF8] leading-tight">
              {video.title}
            </h1>

            {/* Author Strip & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/8 pb-4">
              {/* Channel Info */}
              <div className="flex items-center gap-3">
                <Link
                  to={video.owner?.username ? `/c/${video.owner.username}` : "#"}
                  className="relative shrink-0 rounded-full ring-2 ring-white/10 overflow-hidden"
                >
                  {video.owner?.avatar ? (
                    <img
                      src={video.owner.avatar}
                      alt={video.owner.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center bg-[#18181B] text-[#FAFAF8] text-sm font-bold font-display">
                      {video.owner?.username?.slice(0, 1).toUpperCase() || "U"}
                    </div>
                  )}
                </Link>

                <div>
                  <Link
                    to={video.owner?.username ? `/c/${video.owner.username}` : "#"}
                    className="flex items-center gap-1.5 font-display font-bold text-sm text-[#FAFAF8] hover:text-[#FF5A36] transition-colors"
                  >
                    <span>{video.owner?.fullName || video.owner?.username || "Creator"}</span>
                    <ShieldCheck size={14} className="text-[#FF5A36]" />
                  </Link>

                  <p className="font-mono text-xs text-[#71717A]">
                    @{video.owner?.username || "creator"}
                  </p>
                </div>

                {!isOwnVideo && video.owner?._id && (
                  <div className="ml-2">
                    <SubscribeButton
                      channelId={video.owner._id}
                      isSubscribed={video.owner?.isSubscribed ?? video.isSubscribed}
                      subscriberCount={video.owner?.subscribersCount ?? video.owner?.subscriberCount ?? 0}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons: Like, Save to Playlist, Share */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (!user) {
                      toast.error("Please sign in to like videos");
                      return;
                    }
                    likeMutation.mutate();
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-xs font-mono transition-colors cursor-pointer ${
                    video.isLiked
                      ? "bg-[#FF5A36] text-[#0A0A0A] font-bold"
                      : "bg-[#18181B] text-[#FAFAF8] border border-white/10 hover:bg-[#222226]"
                  }`}
                >
                  <ThumbsUp size={14} className={video.isLiked ? "fill-current" : ""} />
                  <span>{video.likesCount ?? video.likeCount ?? 0}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!user) {
                      toast.error("Please sign in to save videos to playlists");
                      return;
                    }
                    setIsPlaylistModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#18181B] hover:bg-[#222226] px-3.5 py-2 text-xs font-mono text-[#FAFAF8] transition cursor-pointer"
                >
                  <ListPlus size={14} />
                  <span>Save</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#18181B] hover:bg-[#222226] px-3.5 py-2 text-xs font-mono text-[#FAFAF8] transition cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-[#2DD4BF]" /> : <Share2 size={14} />}
                  <span>{copied ? "Copied" : "Share"}</span>
                </button>
              </div>
            </div>

            {/* Description Box */}
            <div className="rounded-lg border border-white/8 bg-[#121212] p-4 space-y-2">
              <div className="flex items-center gap-3 font-mono text-xs text-[#71717A]">
                <span>{formatViews(video.views)} views</span>
                <span>•</span>
                <span>
                  {video.createdAt
                    ? new Date(video.createdAt).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recently published"}
                </span>
              </div>

              <div
                className={`font-sans text-xs text-[#D4D4D8] leading-relaxed whitespace-pre-wrap ${
                  !isDescriptionExpanded && "line-clamp-3"
                }`}
              >
                {video.description}
              </div>

              {video.description && video.description.length > 150 && (
                <button
                  type="button"
                  onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-1 font-mono text-xs text-[#FF5A36] hover:underline pt-1 cursor-pointer"
                >
                  <span>{isDescriptionExpanded ? "Show less" : "Show more"}</span>
                  {isDescriptionExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              )}
            </div>
          </div>

          {/* Interactive Bottom Tabs: Discussion | Personal Code Notes | Chapters */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-white/8 pb-2">
              <button
                type="button"
                onClick={() => setActiveBottomTab("discussion")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs transition cursor-pointer ${
                  activeBottomTab === "discussion"
                    ? "bg-[#FF5A36]/12 text-[#FF5A36] border border-[#FF5A36]/40 font-semibold"
                    : "text-[#71717A] hover:text-[#FAFAF8]"
                }`}
              >
                <MessageSquare size={13} />
                <span>Discussion</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveBottomTab("notes")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs transition cursor-pointer ${
                  activeBottomTab === "notes"
                    ? "bg-[#FF5A36]/12 text-[#FF5A36] border border-[#FF5A36]/40 font-semibold"
                    : "text-[#71717A] hover:text-[#FAFAF8]"
                }`}
              >
                <BookOpen size={13} />
                <span>Personal Code Notes</span>
              </button>

              {chapters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveBottomTab("chapters")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs transition cursor-pointer ${
                    activeBottomTab === "chapters"
                      ? "bg-[#FF5A36]/12 text-[#FF5A36] border border-[#FF5A36]/40 font-semibold"
                      : "text-[#71717A] hover:text-[#FAFAF8]"
                  }`}
                >
                  <ListOrdered size={13} />
                  <span>Chapters ({chapters.length})</span>
                </button>
              )}
            </div>

            {/* Tab 1: Comments */}
            {activeBottomTab === "discussion" && (
              <CommentSection videoId={videoId} />
            )}

            {/* Tab 2: Notes */}
            {activeBottomTab === "notes" && (
              <VideoNotesSection
                videoId={videoId}
                playerCurrentTime={playerCurrentTime}
                onSeek={handleSeek}
              />
            )}

            {/* Tab 3: Chapters */}
            {activeBottomTab === "chapters" && (
              <div className="rounded-lg border border-white/8 bg-[#121212] divide-y divide-white/6">
                {chapters.map((chap, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSeek(chap.startTime)}
                    className="w-full p-3.5 flex items-center justify-between hover:bg-[#18181B] transition text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#FF5A36] bg-[#FF5A36]/10 px-2 py-0.5 rounded border border-[#FF5A36]/20">
                        {formatTime(chap.startTime)}
                      </span>
                      <span className="font-display font-bold text-xs sm:text-sm text-[#FAFAF8] group-hover:text-[#FF5A36] transition-colors">
                        {chap.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 4-Column Recommended Publications */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between border-b border-white/8 pb-2">
            <h3 className="font-display font-bold text-sm text-[#FAFAF8]">
              Recommended
            </h3>
            <span className="font-mono text-xs text-[#71717A]">
              {recommendedVideos.length} videos
            </span>
          </div>

          <div className="space-y-3">
            {recommendedVideos.map((rec) => (
              <Link
                key={rec._id}
                to={`/videos/${rec._id}`}
                className="flex gap-3 group p-2 rounded-md hover:bg-[#121212] transition"
              >
                {/* 16:9 Mini Thumbnail */}
                <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded bg-[#18181B] border border-white/8">
                  <img
                    src={rec.thumbnail}
                    alt={rec.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {rec.duration !== undefined && (
                    <span className="absolute bottom-1 right-1 rounded-xs bg-black/90 px-1 py-0.2 font-mono text-[9px] text-[#FAFAF8]">
                      {formatTime(rec.duration)}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <h4 className="font-display font-bold text-xs text-[#FAFAF8] group-hover:text-[#FF5A36] transition-colors line-clamp-2 leading-snug">
                    {rec.title}
                  </h4>
                  <p className="font-mono text-[11px] text-[#71717A] truncate">
                    {rec.owner?.fullName || rec.owner?.username || "Creator"}
                  </p>
                  <p className="font-mono text-[10px] text-[#71717A]">
                    {formatViews(rec.views)} views
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Save to Playlist Modal */}
      <SaveToPlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        videoId={videoId}
      />
    </div>
  );
};

export default VideoDetail;
