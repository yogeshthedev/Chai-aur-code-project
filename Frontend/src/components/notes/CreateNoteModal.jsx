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
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-lg border border-white/12 bg-[#121212] p-6 shadow-2xl z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#FF5A36]/10 text-[#FF5A36] border border-[#FF5A36]/20">
              <Sparkles size={14} />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-[#FAFAF8]">
                {editingNote ? "Edit Timestamped Note" : "Take Code Note"}
              </h3>
              <p className="font-mono text-[11px] text-[#71717A]">
                Timestamped bookmark at {formatTime(timestamp)}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Timestamp Indicator */}
          <div className="flex items-center justify-between rounded-md bg-[#18181B] p-2.5 px-3 border border-white/8 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#A1A1AA]">
              <Clock size={13} className="text-[#FF5A36]" />
              <span>Video Timestamp:</span>
            </div>
            <span className="rounded-xs bg-[#FF5A36]/10 px-2 py-0.5 font-mono text-[11px] font-bold text-[#FF5A36] border border-[#FF5A36]/20">
              {formatTime(timestamp)}
            </span>
          </div>

          {/* Note Title (Optional) */}
          <div className="space-y-1">
            <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
              Title <span className="text-[10px] text-[#71717A] lowercase">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Memory Layout Benchmark, Rust Borrow Checker insight..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#FAFAF8] placeholder:text-[#71717A] outline-none focus:border-[#FF5A36]"
            />
          </div>

          {/* Note Content */}
          <div className="space-y-1">
            <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
              Note & Code Takeaways <span className="text-[#FF5A36]">*</span>
            </label>
            <textarea
              ref={textareaRef}
              rows={4}
              required
              placeholder="Record takeaways, formulas, or code architecture notes..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full resize-none rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#FAFAF8] placeholder:text-[#71717A] outline-none focus:border-[#FF5A36] leading-relaxed"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/8">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md font-mono text-xs text-[#71717A] hover:text-[#FAFAF8] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] disabled:opacity-50 text-[#0A0A0A] px-4 py-1.5 font-mono text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer"
            >
              {isPending ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check size={13} />
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
