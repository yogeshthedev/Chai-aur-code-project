import { useState, useRef, useCallback } from "react";
import { formatTime } from "./useVideoPlayer";

const ProgressBar = ({
  currentTime = 0,
  duration = 0,
  bufferedPercent = 0,
  chapters = [],
  onSeek,
}) => {
  const [hoverPosition, setHoverPosition] = useState(null);
  const [hoverTime, setHoverTime] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const barRef = useRef(null);

  const calculateTimeFromEvent = useCallback(
    (e) => {
      const bar = barRef.current;
      if (!bar || duration <= 0) return 0;
      const rect = bar.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const ratio = clickX / rect.width;
      return ratio * duration;
    },
    [duration]
  );

  const handleMouseMove = (e) => {
    const bar = barRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setHoverPosition(pos);
    setHoverTime(calculateTimeFromEvent(e));
  };

  const handleMouseLeave = () => {
    if (!isScrubbing) {
      setHoverPosition(null);
    }
  };

  const handleMouseDown = (e) => {
    setIsScrubbing(true);
    const targetTime = calculateTimeFromEvent(e);
    if (onSeek) onSeek(targetTime);

    const onDocMouseMove = (moveEvent) => {
      const scrubTime = calculateTimeFromEvent(moveEvent);
      if (onSeek) onSeek(scrubTime);
    };

    const onDocMouseUp = () => {
      setIsScrubbing(false);
      setHoverPosition(null);
      document.removeEventListener("mousemove", onDocMouseMove);
      document.removeEventListener("mouseup", onDocMouseUp);
    };

    document.addEventListener("mousemove", onDocMouseMove);
    document.addEventListener("mouseup", onDocMouseUp);
  };

  const playedPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Find active chapter for hover tooltip
  const activeHoverChapter =
    chapters && chapters.length > 0
      ? [...chapters]
          .sort((a, b) => b.startTime - a.startTime)
          .find((c) => hoverTime >= c.startTime)
      : null;

  return (
    <div
      ref={barRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      className="group relative flex h-4 w-full cursor-pointer items-center select-none py-1.5"
    >
      {/* Background Track */}
      <div className="relative h-1.5 w-full rounded-full bg-white/20 backdrop-blur-xs transition-all duration-150 group-hover:h-2">
        {/* Buffered Range Bar */}
        <div
          style={{ width: `${Math.min(100, Math.max(0, bufferedPercent))}%` }}
          className="absolute inset-y-0 left-0 rounded-full bg-white/35 transition-all duration-300"
        />

        {/* Hover Highlight Bar */}
        {hoverPosition !== null && (
          <div
            style={{ width: `${hoverPosition}px` }}
            className="absolute inset-y-0 left-0 rounded-full bg-white/25 pointer-events-none"
          />
        )}

        {/* Played Progress Bar */}
        <div
          style={{ width: `${Math.min(100, Math.max(0, playedPercent))}%` }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-500 shadow-sm"
        />

        {/* Chapter Breakpoint Notches */}
        {duration > 0 &&
          chapters &&
          chapters.map((ch, idx) => {
            if (ch.startTime <= 0) return null;
            const pct = (ch.startTime / duration) * 100;
            if (pct <= 0 || pct >= 100) return null;
            return (
              <div
                key={idx}
                style={{ left: `${pct}%` }}
                className="absolute top-0 bottom-0 w-0.5 bg-black/80 z-10 pointer-events-none"
                title={ch.title}
              />
            );
          })}

        {/* Scrub Handle / Thumb */}
        <div
          style={{ left: `${Math.min(100, Math.max(0, playedPercent))}%` }}
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white shadow-md transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-150 z-20"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
        </div>
      </div>

      {/* Floating Hover Time & Chapter Tooltip */}
      {hoverPosition !== null && duration > 0 && (
        <div
          style={{ left: `${hoverPosition}px` }}
          className="absolute -top-7 -translate-x-1/2 pointer-events-none z-30 rounded-md bg-black/90 px-2 py-0.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-xs ring-1 ring-white/10 whitespace-nowrap flex items-center gap-1.5"
        >
          <span>{formatTime(hoverTime)}</span>
          {activeHoverChapter && (
            <>
              <span className="text-slate-400">•</span>
              <span className="text-indigo-300 font-semibold max-w-[150px] truncate">
                {activeHoverChapter.title}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
