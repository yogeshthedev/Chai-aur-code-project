import { Play, Pencil, Trash2 } from "lucide-react";
import { formatTime } from "../player/useVideoPlayer";
import { confirmToast } from "../../utils/confirmToast";

const NoteCard = ({ note, onSeek, onEdit, onDelete }) => {
  const handleDelete = () => {
    confirmToast({
      title: "Delete Note?",
      message: `Delete note at ${formatTime(note.timestamp)}?`,
      confirmText: "Delete",
      onConfirm: () => {
        onDelete(note._id);
      },
    });
  };

  return (
    <div className="group relative rounded-lg border border-white/8 bg-[#121212] p-4 hover:border-white/16 transition-all space-y-2">
      {/* Header: Timestamp Pill & Action Buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onSeek && onSeek(note.timestamp)}
          className="inline-flex items-center gap-1.5 rounded-xs bg-[#FF5A36]/10 px-2.5 py-0.5 text-xs font-mono font-bold text-[#FF5A36] border border-[#FF5A36]/20 hover:bg-[#FF5A36] hover:text-[#0A0A0A] transition active:scale-95 cursor-pointer shadow-2xs group/btn"
          title="Jump to this moment in video"
        >
          <Play size={10} className="fill-current group-hover/btn:scale-110 transition-transform" />
          <span>{formatTime(note.timestamp)}</span>
        </button>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit && onEdit(note)}
            className="p-1 rounded text-[#71717A] hover:text-[#FAFAF8] hover:bg-white/6 transition cursor-pointer"
            aria-label="Edit note"
            title="Edit note"
          >
            <Pencil size={13} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="p-1 rounded text-[#71717A] hover:text-[#EF4444] hover:bg-white/6 transition cursor-pointer"
            aria-label="Delete note"
            title="Delete note"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Note Title (if present) */}
      {note.title && (
        <h4 className="font-display font-bold text-sm text-[#FAFAF8] leading-snug">
          {note.title}
        </h4>
      )}

      {/* Note Content */}
      <p className="font-sans text-xs text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
        {note.content}
      </p>
    </div>
  );
};

export default NoteCard;
