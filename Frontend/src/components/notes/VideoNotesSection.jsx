import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Download,
  Search,
  BookOpen,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  createNoteApi,
  deleteNoteApi,
  exportNotesApi,
  getVideoNotesApi,
  updateNoteApi,
} from "../../api/note.api";
import { useAuthStore } from "../../store/useAuthStore";
import NoteCard from "./NoteCard";
import CreateNoteModal from "./CreateNoteModal";
import { formatTime } from "../player/useVideoPlayer";

const VideoNotesSection = ({ videoId, currentTime = 0, onSeek }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Fetch Notes
  const { data, isLoading } = useQuery({
    queryKey: ["video-notes", videoId],
    queryFn: () => getVideoNotesApi(videoId),
    enabled: Boolean(videoId && user?._id),
    select: (response) => response?.data ?? [],
  });

  const notes = data ?? [];

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: createNoteApi,
    onSuccess: () => {
      toast.success("Note saved!");
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["video-notes", videoId] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to save note");
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: updateNoteApi,
    onSuccess: () => {
      toast.success("Note updated!");
      setEditingNote(null);
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["video-notes", videoId] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update note");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteNoteApi,
    onSuccess: () => {
      toast.success("Note deleted");
      queryClient.invalidateQueries({ queryKey: ["video-notes", videoId] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete note");
    },
  });

  // Export Notes to file
  const handleExport = async () => {
    try {
      const res = await exportNotesApi(videoId);
      const markdownContent = res?.data?.markdown;
      if (!markdownContent) {
        toast.error("No notes to export");
        return;
      }

      const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `video-notes.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Notes downloaded successfully!");
    } catch (error) {
      toast.error("Unable to export notes");
    }
  };

  const handleSaveNote = ({ noteId, timestamp, title, content }) => {
    if (noteId) {
      updateMutation.mutate({
        noteId,
        timestamp,
        title,
        content,
      });
    } else {
      createMutation.mutate({
        videoId,
        timestamp,
        title,
        content,
      });
    }
  };

  const handleOpenCreate = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      (n.title && n.title.toLowerCase().includes(q)) ||
      (n.content && n.content.toLowerCase().includes(q))
    );
  });

  if (!user) {
    return (
      <div className="flex min-h-52 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/20 p-8 text-center">
        <Lock size={28} className="mb-2 text-slate-400 dark:text-zinc-500" />
        <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Sign in to take personal notes</h4>
        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 max-w-xs">
          Capture your thoughts, ideas, takeaways, and bookmarks attached to timestamps.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Controls: Quick Add Note, Search, Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/70 dark:bg-zinc-900/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Note at {formatTime(currentTime)}</span>
          </button>

          {notes.length > 0 && (
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition cursor-pointer shadow-2xs"
              title="Download all notes as a file"
            >
              <Download size={13} />
              <span>Export</span>
            </button>
          )}
        </div>

        {/* Search Notes Filter */}
        {notes.length > 0 && (
          <div className="relative flex-1 sm:max-w-xs">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search your notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-8 pr-3 py-1 text-xs text-slate-900 dark:text-zinc-100 outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Notes List or Empty State */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, idx) => (
            <div
              key={idx}
              className="h-24 w-full animate-pulse rounded-2xl bg-slate-200/80 dark:bg-zinc-800/80"
            />
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex min-h-44 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/30 dark:bg-zinc-900/10 p-8 text-center text-slate-500 dark:text-zinc-400">
          <BookOpen size={28} className="mb-2 text-slate-400 dark:text-zinc-500" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
            {searchQuery ? "No matching notes found" : "No notes yet for this video"}
          </h4>
          <p className="mt-1 text-[11px] max-w-xs">
            {searchQuery
              ? "Try searching for another word."
              : "Click 'Add Note' to save your takeaways, ideas, and timestamps."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onSeek={onSeek}
              onEdit={handleOpenEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Note Modal */}
      <CreateNoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        currentTime={currentTime}
        editingNote={editingNote}
        onSave={handleSaveNote}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default VideoNotesSection;
