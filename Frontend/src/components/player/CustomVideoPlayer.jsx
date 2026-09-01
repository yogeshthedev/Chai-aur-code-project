import { useRef, useState, useImperativeHandle } from "react";
import { Play, Pause, RotateCcw, RotateCw, Loader2 } from "lucide-react";
import { useVideoPlayer } from "./useVideoPlayer";
import PlayerControls from "./PlayerControls";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";

const CustomVideoPlayer = ({
  src,
  poster,
  autoPlay = true,
  onVideoEnd,
  onTimeUpdate,
  chapters = [],
  playerRef,
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
  });

  useImperativeHandle(playerRef, () => ({
    seek,
    togglePlay,
    getCurrentTime: () => currentTime,
    getDuration: () => duration,
    videoElement: videoRef.current,
  }));

  const handleVideoClick = (e) => {
    // Single click toggles play/pause
    togglePlay();
  };

  const handleDoubleClick = (e) => {
    toggleFullscreen();
  };

  return (
    <>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className={`group relative overflow-hidden bg-black select-none rounded-3xl shadow-2xl transition-all duration-300 ${
          isTheaterMode ? "aspect-[21/9] max-h-[75vh]" : "aspect-video"
        } ${className}`}
      >
        {/* Ambient Glow behind player in fullscreen or theater */}
        <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none opacity-50" />

        {/* Video Element */}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          onClick={handleVideoClick}
          onDoubleClick={handleDoubleClick}
          className="h-full w-full object-contain cursor-pointer"
        />

        {/* Buffering Indicator */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none z-10 backdrop-blur-2xs">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-indigo-400 shadow-xl ring-1 ring-white/20">
              <Loader2 size={32} className="animate-spin" />
            </div>
          </div>
        )}

        {/* Center Flash Action Ripple (Play, Pause, Fast-forward, Rewind) */}
        {flashAction && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 text-white shadow-2xl backdrop-blur-xs ring-1 ring-white/20 animate-out fade-out zoom-out duration-500">
              {flashAction === "play" && <Play size={28} className="fill-current ml-1" />}
              {flashAction === "pause" && <Pause size={28} className="fill-current" />}
              {flashAction === "forward" && (
                <div className="flex items-center gap-0.5">
                  <RotateCw size={24} />
                  <span className="text-[10px] font-bold">10s</span>
                </div>
              )}
              {flashAction === "rewind" && (
                <div className="flex items-center gap-0.5">
                  <RotateCcw size={24} />
                  <span className="text-[10px] font-bold">10s</span>
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
          volume={volume}
          isMuted={isMuted}
          playbackRate={playbackRate}
          isFullscreen={isFullscreen}
          isPiP={isPiP}
          isLooping={isLooping}
          isTheaterMode={isTheaterMode}
          showControls={showControls}
          onTogglePlay={togglePlay}
          onSeek={seek}
          onSeekRelative={seekRelative}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
          onPlaybackRateChange={setPlaybackRate}
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
