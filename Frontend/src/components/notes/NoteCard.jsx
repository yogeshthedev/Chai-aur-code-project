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
    <div className="group relative rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-4 sm:p-5 shadow-2xs hover:border-indigo-500/40 hover:shadow-md transition-all duration-200">
      {/* Header: Timestamp Pill & Action Buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onSeek && onSeek(note.timestamp)}
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition active:scale-95 cursor-pointer shadow-2xs group/btn"
          title="Jump to this moment in video"
        >
          <Play size={11} className="fill-current group-hover/btn:scale-110 transition-transform" />
          <span className="font-mono">{formatTime(note.timestamp)}</span>
        </button>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit && onEdit(note)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition cursor-pointer"
            aria-label="Edit note"
            title="Edit note"
          >
            <Pencil size={13} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition cursor-pointer"
            aria-label="Delete note"
            title="Delete note"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Note Title (if present) */}
      {note.title && (
        <h4 className="mt-2.5 text-sm font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
          {note.title}
        </h4>
      )}

      {/* Note Content - Formatted Text */}
      <p className="mt-1.5 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
        {note.content}
      </p>
    </div>
  );
};

export default NoteCard;
