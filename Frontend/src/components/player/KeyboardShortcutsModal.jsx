import { X, Keyboard } from "lucide-react";

const SHORTCUTS = [
  { key: "Space / K", description: "Play or Pause video" },
  { key: "J / L", description: "Seek backward or forward 10 seconds" },
  { key: "← / →", description: "Seek backward or forward 5 seconds" },
  { key: "↑ / ↓", description: "Increase or decrease volume by 10%" },
  { key: "M", description: "Mute or Unmute audio" },
  { key: "F", description: "Toggle Fullscreen" },
  { key: "T", description: "Toggle Theater Mode" },
  { key: "P", description: "Toggle Picture-in-Picture (PiP)" },
];

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400">
              <Keyboard size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                Keyboard Shortcuts
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Quick commands for video control
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {SHORTCUTS.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-zinc-800/50 px-3.5 py-2 text-xs"
            >
              <span className="text-slate-600 dark:text-zinc-400 font-medium">
                {item.description}
              </span>
              <kbd className="inline-flex items-center rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 px-2 py-0.5 font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400 shadow-2xs">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
