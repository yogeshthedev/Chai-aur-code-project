import { X, Keyboard } from "lucide-react";

const SHORTCUTS = [
  { key: "Space / K", description: "Play or Pause video" },
  { key: "J / L", description: "Seek backward or forward 10 seconds" },
  { key: "← / →", description: "Seek backward or forward 5 seconds" },
  { key: "↑ / ↓", description: "Increase or decrease volume by 10%" },
  { key: "M", description: "Mute or Unmute audio" },
  { key: "F", description: "Toggle Fullscreen" },
  { key: "P", description: "Toggle Picture-in-Picture" },
];

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-lg border border-white/12 bg-[#121212] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/8 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#FF5A36]/10 text-[#FF5A36] border border-[#FF5A36]/20">
              <Keyboard size={15} />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-[#FAFAF8]">
                Keyboard Shortcuts
              </h3>
              <p className="font-mono text-[11px] text-[#71717A]">
                Quick cinema controls
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#71717A] hover:text-[#FAFAF8] transition cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {SHORTCUTS.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-md bg-[#18181B] px-3.5 py-2 text-xs font-mono"
            >
              <span className="text-[#A1A1AA] font-normal">
                {item.description}
              </span>
              <kbd className="inline-flex items-center rounded-xs bg-[#121212] border border-white/10 px-2 py-0.5 font-mono text-[11px] font-bold text-[#FF5A36]">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] py-2 font-mono text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
