import { Settings, ChevronRight, RotateCcw, Gauge, Keyboard } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const SettingsMenu = ({
  playbackRate = 1,
  onPlaybackRateChange,
  isLooping = false,
  onToggleLoop,
  onOpenShortcuts,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("main"); // 'main' | 'speed'
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveTab("main");
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setActiveTab("main");
        }}
        aria-label="Settings"
        title="Settings"
        className={`flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:text-white hover:bg-white/15 active:scale-95 transition cursor-pointer ${
          isOpen ? "bg-white/20 text-white" : ""
        }`}
      >
        <Settings
          size={18}
          className={`transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
        />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 z-30 w-52 rounded-lg border border-white/15 bg-[#121212]/95 p-2 text-white shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          {activeTab === "main" && (
            <div className="space-y-0.5">
              {/* Playback Speed */}
              <button
                type="button"
                onClick={() => setActiveTab("speed")}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-mono font-medium hover:bg-white/10 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Gauge size={14} className="text-[#FF5A36]" />
                  <span>Playback Speed</span>
                </div>
                <div className="flex items-center gap-1 text-[#71717A] font-normal">
                  <span>{playbackRate === 1 ? "1.0x" : `${playbackRate}x`}</span>
                  <ChevronRight size={13} />
                </div>
              </button>

              {/* Loop Video */}
              <button
                type="button"
                onClick={onToggleLoop}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-mono font-medium hover:bg-white/10 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw size={14} className="text-[#FF5A36]" />
                  <span>Loop Video</span>
                </div>
                <div
                  className={`h-4 w-7 rounded-full p-0.5 transition-colors ${
                    isLooping ? "bg-[#FF5A36]" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`h-3 w-3 rounded-full bg-white transition-transform ${
                      isLooping ? "translate-x-3" : "translate-x-0"
                    }`}
                  />
                </div>
              </button>

              {/* Shortcuts */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenShortcuts) onOpenShortcuts();
                }}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-mono font-medium hover:bg-white/10 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Keyboard size={14} className="text-[#FF5A36]" />
                  <span>Shortcuts</span>
                </div>
              </button>
            </div>
          )}

          {activeTab === "speed" && (
            <div className="space-y-3 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("main")}
                className="flex w-full items-center gap-1.5 rounded-md border-b border-white/10 px-2 py-1.5 font-mono text-xs font-bold text-[#A1A1AA] hover:bg-white/10 transition cursor-pointer"
              >
                <ChevronRight size={13} className="rotate-180" />
                <span>Speed Settings</span>
              </button>

              {/* Live Speed Value Display & Reset */}
              <div className="flex items-center justify-between px-1 font-mono text-xs">
                <span className="text-[#71717A]">Rate</span>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#FF5A36] px-1.5 py-0.2 text-[11px] font-bold text-[#0A0A0A]">
                    {Number(playbackRate).toFixed(2)}x
                  </span>
                  {playbackRate !== 1 && (
                    <button
                      type="button"
                      onClick={() => onPlaybackRateChange(1)}
                      className="text-[10px] text-[#FF5A36] hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Interactive Slider */}
              <div className="px-1 space-y-1">
                <input
                  type="range"
                  min="0.25"
                  max="2.5"
                  step="0.05"
                  value={playbackRate}
                  onChange={(e) => onPlaybackRateChange(parseFloat(e.target.value))}
                  className="h-1.5 w-full appearance-none rounded-full bg-white/20 accent-[#FF5A36] cursor-pointer outline-none"
                />
                <div className="flex justify-between text-[9px] text-[#71717A] font-mono">
                  <span>0.25x</span>
                  <span>1.0x</span>
                  <span>2.5x</span>
                </div>
              </div>

              {/* Fast Preset Chips */}
              <div className="grid grid-cols-4 gap-1 pt-1 border-t border-white/10">
                {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => onPlaybackRateChange(rate)}
                    className={`rounded py-1 font-mono text-[10px] transition cursor-pointer ${
                      playbackRate === rate
                        ? "bg-[#FF5A36] text-[#0A0A0A] font-bold shadow-xs"
                        : "bg-white/5 text-[#A1A1AA] hover:bg-white/15"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
