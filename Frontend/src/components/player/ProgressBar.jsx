import { useState, useRef, useCallback } from "react";
import { formatTime } from "./useVideoPlayer";

const ProgressBar = ({
  currentTime = 0,
  duration = 0,
  bufferedPercent = 0,
  chapters = [],
  segments = [],
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

  // Find active skip segment for hover tooltip
  const activeHoverSegment =
    segments && segments.length > 0
      ? segments.find((s) => hoverTime >= s.start && hoverTime <= s.end)
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
      <div className="relative h-1.5 w-full rounded-sm bg-white/20 backdrop-blur-xs transition-all duration-150 group-hover:h-2 overflow-hidden">
        {/* Buffered Range Bar */}
        <div
          style={{ width: `${Math.min(100, Math.max(0, bufferedPercent))}%` }}
          className="absolute inset-y-0 left-0 bg-white/30 transition-all duration-300"
        />

        {/* Crowd-Sourced Skip Segments on scrubber */}
        {duration > 0 &&
          segments &&
          segments.map((seg, idx) => {
            const leftPct = (seg.start / duration) * 100;
            const widthPct = ((seg.end - seg.start) / duration) * 100;
            return (
              <div
                key={idx}
                style={{
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  backgroundColor: seg.color || (seg.type === "sponsor" ? "#E5A93C" : "#2DD4BF"),
                }}
                className="absolute inset-y-0 opacity-80 group-hover:opacity-100 transition-opacity z-10"
                title={`${seg.label} (${formatTime(seg.start)} - ${formatTime(seg.end)})`}
              />
            );
          })}

        {/* Hover Highlight Bar */}
        {hoverPosition !== null && (
          <div
            style={{ width: `${hoverPosition}px` }}
            className="absolute inset-y-0 left-0 bg-white/20 pointer-events-none"
          />
        )}

        {/* Played Progress Bar (Warm Coral #FF5A36) */}
        <div
          style={{ width: `${Math.min(100, Math.max(0, playedPercent))}%` }}
          className="absolute inset-y-0 left-0 bg-[#FF5A36] transition-all duration-75 z-15"
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
                className="absolute top-0 bottom-0 w-0.5 bg-[#0A0A0A] z-20 pointer-events-none"
                title={ch.title}
              />
            );
          })}
      </div>

      {/* Scrub Handle / Thumb */}
      <div
        style={{ left: `${Math.min(100, Math.max(0, playedPercent))}%` }}
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FAFAF8] shadow-lg transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-150 z-30 pointer-events-none"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-[#FF5A36]" />
      </div>

      {/* Floating Hover Time & Chapter/Segment Tooltip */}
      {hoverPosition !== null && duration > 0 && (
        <div
          style={{ left: `${hoverPosition}px` }}
          className="absolute -top-8 -translate-x-1/2 pointer-events-none z-40 rounded-md bg-[#121212] px-2.5 py-1 text-[11px] font-mono text-[#FAFAF8] shadow-2xl border border-white/15 whitespace-nowrap flex items-center gap-1.5"
        >
          <span>{formatTime(hoverTime)}</span>
          {activeHoverSegment && (
            <span
              className="px-1.5 py-0.2 rounded text-[10px] font-sans font-medium uppercase tracking-wider"
              style={{
                backgroundColor: `${activeHoverSegment.color}25`,
                color: activeHoverSegment.color,
              }}
            >
              {activeHoverSegment.type}
            </span>
          )}
          {activeHoverChapter && (
            <>
              <span className="text-[#71717A]">•</span>
              <span className="text-[#A1A1AA] font-sans text-xs max-w-[160px] truncate">
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

