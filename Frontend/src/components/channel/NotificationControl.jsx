import React, { useState, useRef, useEffect } from "react";
import { Bell, BellRing, BellOff, ChevronDown, Check } from "lucide-react";

/**
 * 3-State Per-Channel Notification Control
 * - All: Immediate notifications for all releases & streams
 * - Personalized: Algorithmically curated digest
 * - None: Muted notifications
 */
const NotificationControl = ({
  initialLevel = "personalized",
  onChange = null,
  compact = false
}) => {
  const [level, setLevel] = useState(initialLevel);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newLevel, e) => {
    e.stopPropagation();
    setLevel(newLevel);
    setIsOpen(false);
    if (onChange) onChange(newLevel);
  };

  const getIcon = () => {
    switch (level) {
      case "all":
        return <BellRing size={14} className="text-[#FF5A36]" />;
      case "none":
        return <BellOff size={14} className="text-[#71717A]" />;
      case "personalized":
      default:
        return <Bell size={14} className="text-[#A1A1AA]" />;
    }
  };

  const getLabel = () => {
    switch (level) {
      case "all":
        return "All";
      case "none":
        return "Muted";
      case "personalized":
      default:
        return "Personalized";
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#18181B] px-2.5 py-1 text-xs font-medium text-[#FAFAF8] hover:bg-[#222226] hover:border-white/20 transition-all duration-150 cursor-pointer ${
          compact ? "h-7 px-2" : "h-8"
        }`}
        title={`Notifications: ${getLabel()}`}
      >
        {getIcon()}
        {!compact && <span className="text-[12px]">{getLabel()}</span>}
        <ChevronDown size={12} className={`text-[#71717A] transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-52 origin-top-right rounded-md border border-white/15 bg-[#18181B] p-1 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#71717A] border-b border-white/8">
            Channel Notifications
          </div>

          <div className="py-1 space-y-0.5">
            <button
              type="button"
              onClick={(e) => handleSelect("all", e)}
              className={`flex w-full items-center justify-between px-2.5 py-2 rounded text-xs text-left cursor-pointer transition-colors ${
                level === "all" ? "bg-[#FF5A36]/15 text-[#FF5A36] font-semibold" : "text-[#FAFAF8] hover:bg-[#222226]"
              }`}
            >
              <div className="flex items-center gap-2">
                <BellRing size={14} className={level === "all" ? "text-[#FF5A36]" : "text-[#A1A1AA]"} />
                <div>
                  <div className="font-medium">All uploads</div>
                  <div className="text-[10px] text-[#71717A]">Get notified immediately</div>
                </div>
              </div>
              {level === "all" && <Check size={14} />}
            </button>

            <button
              type="button"
              onClick={(e) => handleSelect("personalized", e)}
              className={`flex w-full items-center justify-between px-2.5 py-2 rounded text-xs text-left cursor-pointer transition-colors ${
                level === "personalized" ? "bg-white/8 text-[#FAFAF8] font-semibold" : "text-[#FAFAF8] hover:bg-[#222226]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-[#A1A1AA]" />
                <div>
                  <div className="font-medium">Personalized</div>
                  <div className="text-[10px] text-[#71717A]">Weekly digest & key drops</div>
                </div>
              </div>
              {level === "personalized" && <Check size={14} />}
            </button>

            <button
              type="button"
              onClick={(e) => handleSelect("none", e)}
              className={`flex w-full items-center justify-between px-2.5 py-2 rounded text-xs text-left cursor-pointer transition-colors ${
                level === "none" ? "bg-white/8 text-[#FAFAF8] font-semibold" : "text-[#FAFAF8] hover:bg-[#222226]"
              }`}
            >
              <div className="flex items-center gap-2">
                <BellOff size={14} className="text-[#71717A]" />
                <div>
                  <div className="font-medium">None</div>
                  <div className="text-[10px] text-[#71717A]">Turn off all alerts</div>
                </div>
              </div>
              {level === "none" && <Check size={14} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationControl;