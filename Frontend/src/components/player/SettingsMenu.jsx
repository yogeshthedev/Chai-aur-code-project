import { Settings, Check, ChevronRight, RotateCcw, Gauge, Keyboard } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

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
        <div className="absolute bottom-12 right-0 z-30 w-52 rounded-2xl border border-white/15 bg-zinc-900/95 p-1.5 text-white shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          {activeTab === "main" && (
            <div className="space-y-0.5">
              {/* Playback Speed */}
              <button
                type="button"
                onClick={() => setActiveTab("speed")}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold hover:bg-white/10 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Gauge size={15} className="text-indigo-400" />
                  <span>Playback Speed</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 font-normal">
                  <span>{playbackRate === 1 ? "Normal" : `${playbackRate}x`}</span>
                  <ChevronRight size={14} />
                </div>
              </button>

              {/* Loop Video */}
              <button
                type="button"
                onClick={onToggleLoop}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold hover:bg-white/10 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw size={15} className="text-indigo-400" />
                  <span>Loop Video</span>
                </div>
                <div
                  className={`h-4 w-7 rounded-full p-0.5 transition-colors ${
                    isLooping ? "bg-indigo-600" : "bg-white/20"
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
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold hover:bg-white/10 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Keyboard size={15} className="text-indigo-400" />
                  <span>Keyboard Shortcuts</span>
                </div>
              </button>
            </div>
          )}

          {activeTab === "speed" && (
            <div className="space-y-3 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("main")}
                className="flex w-full items-center gap-1.5 rounded-xl border-b border-white/10 px-2 py-1.5 text-xs font-bold text-slate-300 hover:bg-white/10 transition cursor-pointer"
              >
                <ChevronRight size={14} className="rotate-180" />
                <span>Playback Speed</span>
              </button>

              {/* Live Speed Value Display & Reset */}
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] text-slate-400 font-medium">Speed</span>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-indigo-600/80 px-2 py-0.5 text-xs font-bold font-mono text-white">
                    {Number(playbackRate).toFixed(2)}x
                  </span>
                  {playbackRate !== 1 && (
                    <button
                      type="button"
                      onClick={() => onPlaybackRateChange(1)}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                    >
                      Reset (1x)
                    </button>
                  )}
                </div>
              </div>

              {/* Interactive Smooth Slider */}
              <div className="px-1 space-y-1">
                <input
                  type="range"
                  min="0.25"
                  max="2.5"
                  step="0.05"
                  value={playbackRate}
                  onChange={(e) => onPlaybackRateChange(parseFloat(e.target.value))}
                  className="h-1.5 w-full appearance-none rounded-full bg-white/20 accent-indigo-500 cursor-pointer outline-none"
                  style={{
                    background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${
                      ((playbackRate - 0.25) / (2.5 - 0.25)) * 100
                    }%, rgba(255,255,255,0.2) ${
                      ((playbackRate - 0.25) / (2.5 - 0.25)) * 100
                    }%, rgba(255,255,255,0.2) 100%)`,
                  }}
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
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
                    className={`rounded-lg py-1 text-[11px] font-semibold transition cursor-pointer ${
                      playbackRate === rate
                        ? "bg-indigo-600 text-white font-bold shadow-xs"
                        : "bg-white/5 text-slate-300 hover:bg-white/15"
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
