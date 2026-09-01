import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  PictureInPicture2,
  Tv,
} from "lucide-react";
import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";
import SettingsMenu from "./SettingsMenu";
import { formatTime } from "./useVideoPlayer";

const PlayerControls = ({
  isPlaying,
  currentTime,
  duration,
  bufferedPercent,
  chapters = [],
  volume,
  isMuted,
  playbackRate,
  isFullscreen,
  isPiP,
  isLooping,
  isTheaterMode,
  showControls,
  onTogglePlay,
  onSeek,
  onSeekRelative,
  onVolumeChange,
  onToggleMute,
  onPlaybackRateChange,
  onToggleFullscreen,
  onTogglePiP,
  onToggleLoop,
  onToggleTheaterMode,
  onOpenShortcuts,
}) => {
  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 pb-3 pt-12 transition-opacity duration-300 ${
        showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Dynamic Scrub Progress Bar with Chapters & Hover Tooltip */}
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        bufferedPercent={bufferedPercent}
        chapters={chapters}
        onSeek={onSeek}
      />

      {/* 2. Control Actions Row */}
      <div className="mt-1 flex items-center justify-between gap-2 text-white">
        {/* Left Side: Play, Skips, Volume, Timer */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Play/Pause */}
          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={isPlaying ? "Pause (Space)" : "Play (Space)"}
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/95 hover:text-white hover:bg-white/15 active:scale-90 transition cursor-pointer"
          >
            {isPlaying ? (
              <Pause size={20} className="fill-current" />
            ) : (
              <Play size={20} className="fill-current ml-0.5" />
            )}
          </button>

          {/* Rewind 10s */}
          <button
            type="button"
            onClick={() => onSeekRelative(-10)}
            aria-label="Rewind 10 seconds (J)"
            title="Rewind 10 seconds (J)"
            className="relative flex h-8 w-8 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/15 active:scale-95 transition cursor-pointer"
          >
            <RotateCcw size={16} />
            <span className="absolute text-[8px] font-bold mt-0.5">10</span>
          </button>

          {/* Forward 10s */}
          <button
            type="button"
            onClick={() => onSeekRelative(10)}
            aria-label="Forward 10 seconds (L)"
            title="Forward 10 seconds (L)"
            className="relative flex h-8 w-8 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/15 active:scale-95 transition cursor-pointer"
          >
            <RotateCw size={16} />
            <span className="absolute text-[8px] font-bold mt-0.5">10</span>
          </button>

          {/* Volume Control */}
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={onVolumeChange}
            onToggleMute={onToggleMute}
          />

          {/* Time Display */}
          <div className="ml-1 text-[11px] sm:text-xs font-medium text-slate-200 select-none tracking-tight">
            <span>{formatTime(currentTime)}</span>
            <span className="mx-1 text-white/40">/</span>
            <span className="text-white/60">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Side: Speed, PiP, Theater, Settings, Fullscreen */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Quick Playback Speed Indicator */}
          {playbackRate !== 1 && (
            <span className="rounded-md bg-indigo-600/80 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white">
              {playbackRate}x
            </span>
          )}

          {/* Picture in Picture */}
          {document.pictureInPictureEnabled && (
            <button
              type="button"
              onClick={onTogglePiP}
              aria-label="Picture in Picture (P)"
              title="Picture in Picture (P)"
              className={`hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/15 active:scale-95 transition cursor-pointer ${
                isPiP ? "text-indigo-400 bg-white/15" : ""
              }`}
            >
              <PictureInPicture2 size={18} />
            </button>
          )}

          {/* Theater Mode */}
          <button
            type="button"
            onClick={onToggleTheaterMode}
            aria-label="Theater Mode (T)"
            title="Theater Mode (T)"
            className={`hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/15 active:scale-95 transition cursor-pointer ${
              isTheaterMode ? "text-indigo-400 bg-white/15" : ""
            }`}
          >
            <Tv size={18} />
          </button>

          {/* Settings Menu */}
          <SettingsMenu
            playbackRate={playbackRate}
            onPlaybackRateChange={onPlaybackRateChange}
            isLooping={isLooping}
            onToggleLoop={onToggleLoop}
            onOpenShortcuts={onOpenShortcuts}
          />

          {/* Fullscreen */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
            title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:text-white hover:bg-white/15 active:scale-95 transition cursor-pointer"
          >
            {isFullscreen ? <Minimize size={19} /> : <Maximize size={19} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
