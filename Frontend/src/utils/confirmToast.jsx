import toast from "react-hot-toast";
import { AlertTriangle, Trash2, X } from "lucide-react";

export const confirmToast = ({
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  icon = "trash",
}) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-in fade-in zoom-in-95 duration-150" : "animate-out fade-out zoom-out-95 duration-150"
        } max-w-sm w-full bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl pointer-events-auto flex flex-col p-4 border border-slate-200/90 dark:border-zinc-800 ring-1 ring-black/5 z-50`}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            {icon === "trash" ? <Trash2 size={18} /> : <AlertTriangle size={18} />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
              {title}
            </h4>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400 leading-tight">
              {message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="rounded-full px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              if (onConfirm) onConfirm();
            }}
            className="rounded-full bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1 text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    ),
    { duration: 6000, position: "top-center" }
  );
};
