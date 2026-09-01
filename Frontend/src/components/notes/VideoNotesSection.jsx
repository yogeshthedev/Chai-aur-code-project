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
      <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 bg-[#121212] p-8 text-center">
        <Lock size={24} className="mb-2 text-[#71717A]" />
        <h4 className="font-display text-xs font-bold text-[#FAFAF8]">Sign in to take personal code notes</h4>
        <p className="mt-1 font-mono text-[11px] text-[#71717A] max-w-xs">
          Capture takeaways, architecture ideas, and code references linked to video timestamps.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Controls: Quick Add Note, Search, Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#121212] p-3 rounded-lg border border-white/8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] px-3.5 py-1.5 font-mono text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Note at {formatTime(currentTime)}</span>
          </button>

          {notes.length > 0 && (
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#18181B] hover:bg-[#222226] px-3 py-1.5 text-xs font-mono text-[#FAFAF8] transition cursor-pointer"
              title="Download all notes as markdown"
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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]"
            />
            <input
              type="text"
              placeholder="Filter notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-[#18181B] pl-8 pr-3 py-1 text-xs text-[#FAFAF8] placeholder:text-[#71717A] outline-none focus:border-[#FF5A36]"
            />
          </div>
        )}
      </div>

      {/* Notes List or Empty State */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }, (_, idx) => (
            <div
              key={idx}
              className="h-20 w-full animate-pulse rounded-lg bg-[#18181B] border border-white/6"
            />
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 bg-[#121212] p-8 text-center text-[#71717A]">
          <BookOpen size={24} className="mb-2 text-[#71717A]" />
          <h4 className="font-display text-xs font-bold text-[#FAFAF8]">
            {searchQuery ? "No matching notes found" : "No notes yet for this video"}
          </h4>
          <p className="mt-1 font-mono text-[11px] max-w-xs text-[#71717A]">
            {searchQuery
              ? "Try searching for another keyword."
              : "Click 'Add Note' to save code snippets and takeaways with timestamp markers."}
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
