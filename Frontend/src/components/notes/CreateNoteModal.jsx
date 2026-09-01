import { useState, useEffect, useRef } from "react";
import { X, Clock, Sparkles, Check } from "lucide-react";
import { formatTime } from "../player/useVideoPlayer";

const CreateNoteModal = ({
  isOpen,
  onClose,
  currentTime = 0,
  editingNote = null,
  onSave,
  isPending = false,
}) => {
  const [timestamp, setTimestamp] = useState(currentTime);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editingNote) {
      setTimestamp(editingNote.timestamp || 0);
      setTitle(editingNote.title || "");
      setContent(editingNote.content || "");
    } else {
      setTimestamp(currentTime);
      setTitle("");
      setContent("");
    }
  }, [editingNote, currentTime, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSave({
      noteId: editingNote?._id,
      timestamp,
      title: title.trim(),
      content: content.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                {editingNote ? "Edit Note" : "Take Note"}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Saved at {formatTime(timestamp)} in this video
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Timestamp Indicator */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-zinc-800/60 p-2.5 px-3.5 border border-slate-200/60 dark:border-zinc-800 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-300 font-semibold">
              <Clock size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span>Video Timestamp:</span>
            </div>
            <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 font-mono text-[11px] font-bold text-white shadow-2xs">
              {formatTime(timestamp)}
            </span>
          </div>

          {/* Note Title (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
              Title <span className="font-normal text-slate-400">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Key concept, important formula, reminder..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50 px-3.5 py-2 text-xs text-slate-900 dark:text-zinc-100 outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition"
            />
          </div>

          {/* Note Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
              Your Note <span className="text-rose-500">*</span>
            </label>
            <textarea
              ref={textareaRef}
              rows={4}
              required
              placeholder="Write your notes, ideas, summary, points to remember..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50 px-3.5 py-2.5 text-xs text-slate-900 dark:text-zinc-100 outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition leading-relaxed"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2 text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition cursor-pointer"
            >
              {isPending ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check size={14} />
                  <span>{editingNote ? "Update Note" : "Save Note"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNoteModal;
