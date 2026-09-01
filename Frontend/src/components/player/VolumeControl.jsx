import { Volume2, Volume1, VolumeX } from "lucide-react";
import { useState } from "react";

const VolumeControl = ({ volume = 1, isMuted = false, onVolumeChange, onToggleMute }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  const effectiveVolume = isMuted ? 0 : volume;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center gap-1.5"
    >
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={isMuted ? "Unmute (M)" : "Mute (M)"}
        title={isMuted ? "Unmute (M)" : "Mute (M)"}
        className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:text-white hover:bg-white/15 active:scale-95 transition cursor-pointer"
      >
        {getVolumeIcon()}
      </button>

      {/* Slider Container */}
      <div
        className={`flex items-center overflow-hidden transition-all duration-200 ease-out ${
          isHovered ? "w-20 opacity-100 mr-1" : "w-0 opacity-0"
        }`}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.02"
          value={effectiveVolume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="h-1.5 w-20 appearance-none rounded-full bg-white/30 accent-[#FF5A36] cursor-pointer outline-none transition"
          style={{
            background: `linear-gradient(to right, #FF5A36 0%, #FF5A36 ${effectiveVolume * 100}%, rgba(255,255,255,0.25) ${effectiveVolume * 100}%, rgba(255,255,255,0.25) 100%)`,
          }}
        />
      </div>
    </div>
  );
};

export default VolumeControl;
