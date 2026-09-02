import { useRef, useState, useImperativeHandle } from "react";
import { Play, Pause, RotateCcw, RotateCw, Loader2, FastForward, Lock } from "lucide-react";
import { useVideoPlayer } from "./useVideoPlayer";
import PlayerControls from "./PlayerControls";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";

/**
 * 🎓 CUSTOM VIDEO PLAYER:
 *
 * Exposes full imperative control (playVideo, pauseVideo, seekTo)
 * and direct callbacks for user-driven interactions (onUserPlay, onUserPause, onUserSeek).
 */

const CustomVideoPlayer = ({
  src,
  poster,
  autoPlay = false,
  onVideoEnd,
  onTimeUpdate,
  chapters = [],
  segments = [],
  playerRef,
  ref: propRef,
  isControlsLocked = false,
  onLockedAttempt,
  onUserPlay,
  onUserPause,
  onUserSeek,
  className = "",
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const {
    isPlaying,
    currentTime,
    duration,
    bufferedPercent,
    volume,
    isMuted,
    playbackRate,
    isFullscreen,
    isPiP,
    isLooping,
    isTheaterMode,
    showControls,
    isBuffering,
    flashAction,
    togglePlay,
    seek,
    seekRelative,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleFullscreen,
    togglePiP,
    toggleLoop,
    toggleTheaterMode,
    handleMouseMove,
    setShowControls,
  } = useVideoPlayer({
    videoRef,
    containerRef,
    autoPlay,
    onVideoEnd,
    onTimeUpdate,
    onUserPlay: (time, rate) => {
      if (isControlsLocked) {
        onLockedAttempt?.();
        return;
      }
      onUserPlay?.(time, rate);
    },
    onUserPause: (time) => {
      if (isControlsLocked) {
        onLockedAttempt?.();
        return;
      }
      onUserPause?.(time);
    },
    onUserSeek: (time) => {
      if (isControlsLocked) {
        onLockedAttempt?.();
        return;
      }
      onUserSeek?.(time);
    },
  });

  // Expose imperative API for external synchronization
  const targetRef = playerRef || propRef;
  useImperativeHandle(targetRef, () => ({
    playVideo: () => {
      const v = videoRef.current;
      if (v) {
        v.play().catch(() => {
          // If browser blocked unmuted autoplay, mute and play
          v.muted = true;
          v.play().catch(() => {});
        });
      }
    },
    pauseVideo: () => {
      const v = videoRef.current;
      if (v && !v.paused) {
        v.pause();
      }
    },
    seekTo: (time) => {
      const v = videoRef.current;
      if (v && !isNaN(time)) {
        v.currentTime = Math.max(0, Math.min(time, v.duration || 999999));
      }
    },
    getCurrentTime: () => {
      return videoRef.current ? videoRef.current.currentTime : 0;
    },
    getDuration: () => {
      return videoRef.current ? videoRef.current.duration : 0;
    },
    isPaused: () => {
      return videoRef.current ? videoRef.current.paused : true;
    },
    videoElement: videoRef.current,
  }));

  const handleVideoClick = () => {
    if (isControlsLocked) {
      onLockedAttempt?.();
      return;
    }
    togglePlay();
  };

  const handleDoubleClick = () => {
    toggleFullscreen();
  };

  // Skip segments (SponsorBlock)
  const activeSegment = segments.find(
    (seg) => currentTime >= seg.start && currentTime < seg.end
  );

  const handleSkipCurrentSegment = () => {
    if (isControlsLocked) {
      onLockedAttempt?.();
      return;
    }
    if (activeSegment) {
      seek(activeSegment.end + 0.1);
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className={`group relative overflow-hidden bg-[#0A0A0A] select-none rounded-lg border border-white/10 shadow-2xl transition-all duration-300 ${
          isTheaterMode ? "aspect-[21/9] max-h-[75vh]" : "aspect-video"
        } ${className}`}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          preload="auto"
          onClick={handleVideoClick}
          onDoubleClick={handleDoubleClick}
          className="h-full w-full object-contain cursor-pointer"
        />

        {/* Lock Overlay Badge if Host-Only Playback is Active for Viewer */}
        {isControlsLocked && (
          <div className="absolute top-4 left-4 z-30 pointer-events-none animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 rounded-md bg-[#0A0A0A]/90 border border-[#E5A93C]/40 px-2.5 py-1 text-[11px] font-mono text-[#E5A93C] shadow-2xl backdrop-blur-md">
              <Lock size={12} />
              <span>Host-Only Playback</span>
            </div>
          </div>
        )}

        {/* Active Skip Segment Prompt */}
        {activeSegment && (
          <div className="absolute top-4 right-4 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              type="button"
              onClick={handleSkipCurrentSegment}
              className="flex items-center gap-2 rounded-md bg-[#0A0A0A]/90 border border-[#E5A93C]/40 px-3 py-1.5 text-xs font-mono text-[#FAFAF8] shadow-2xl backdrop-blur-md hover:bg-[#18181B] hover:border-[#E5A93C] transition cursor-pointer group/skip"
            >
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ backgroundColor: activeSegment.color || "#E5A93C" }}
              />
              <span>Skip {activeSegment.label || activeSegment.type}</span>
              <FastForward size={13} className="text-[#E5A93C] group-hover/skip:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}

        {/* Buffering Indicator */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none z-10 backdrop-blur-2xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-black/80 text-[#FF5A36] border border-white/15">
              <Loader2 size={24} className="animate-spin" />
            </div>
          </div>
        )}

        {/* Center Flash Action Ripple */}
        {flashAction && !isControlsLocked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/70 text-[#FAFAF8] border border-white/20 animate-out fade-out zoom-out duration-500">
              {flashAction === "play" && <Play size={24} className="fill-current ml-0.5" />}
              {flashAction === "pause" && <Pause size={24} className="fill-current" />}
              {flashAction === "forward" && (
                <div className="flex items-center gap-0.5 font-mono">
                  <RotateCw size={20} />
                  <span className="text-[9px] font-bold">10s</span>
                </div>
              )}
              {flashAction === "rewind" && (
                <div className="flex items-center gap-0.5 font-mono">
                  <RotateCcw size={20} />
                  <span className="text-[9px] font-bold">10s</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Floating Player Controls */}
        <PlayerControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          bufferedPercent={bufferedPercent}
          chapters={chapters}
          segments={segments}
          volume={volume}
          isMuted={isMuted}
          playbackRate={playbackRate}
          isFullscreen={isFullscreen}
          isPiP={isPiP}
          isLooping={isLooping}
          isTheaterMode={isTheaterMode}
          showControls={showControls}
          onTogglePlay={() => {
            if (isControlsLocked) {
              onLockedAttempt?.();
              return;
            }
            togglePlay();
          }}
          onSeek={(time) => {
            if (isControlsLocked) {
              onLockedAttempt?.();
              return;
            }
            seek(time);
          }}
          onSeekRelative={(delta) => {
            if (isControlsLocked) {
              onLockedAttempt?.();
              return;
            }
            seekRelative(delta);
          }}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
          onPlaybackRateChange={(rate) => {
            if (isControlsLocked) {
              onLockedAttempt?.();
              return;
            }
            setPlaybackRate(rate);
          }}
          onToggleFullscreen={toggleFullscreen}
          onTogglePiP={togglePiP}
          onToggleLoop={toggleLoop}
          onToggleTheaterMode={toggleTheaterMode}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />
      </div>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </>
  );
};

export default CustomVideoPlayer;
