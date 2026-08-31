import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Pencil, Send, Trash2, User } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { addCommentApi, deleteCommentApi, getVideoCommentsApi, updateCommentApi } from "../api/comment.api";
import { useAuthStore } from "../store/useAuthStore";

const CommentSection = ({ videoId }) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [comment, setComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => getVideoCommentsApi({ videoId, page: 1, limit: 20 }),
    enabled: Boolean(videoId),
  });

  const comments = data?.data?.comments ?? [];
  const totalComments = data?.data?.totalComments ?? comments.length;

  const addCommentMutation = useMutation({
    mutationFn: () => addCommentApi({ videoId, content: comment }),
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: () => updateCommentApi({ commentId: editingCommentId, content: editingValue }),
    onSuccess: () => {
      setEditingCommentId(null);
      setEditingValue("");
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => deleteCommentApi(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    addCommentMutation.mutate();
  };

  const currentUserId = user?._id;

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-5 md:p-6 shadow-xs">
      {/* Section Header */}
      <div className="flex items-center gap-2 text-slate-900 dark:text-zinc-100">
        <MessageSquare size={18} className="text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-base font-bold">Comments</h3>
        <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">({totalComments})</span>
      </div>

      {/* Add Comment Input */}
      <form onSubmit={handleSubmit} className="flex items-start gap-3">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.fullName || user.username || "You"}
            className="h-9 w-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-zinc-800"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-zinc-800 text-xs font-bold text-indigo-700 dark:text-zinc-200 shrink-0">
            {user?.username ? user.username.slice(0, 1).toUpperCase() : <User size={15} />}
          </div>
        )}

        <div className="flex-1 flex gap-2">
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Add a friendly comment..."
            className="w-full rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-800/80 px-4 py-2.5 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/80 transition"
          />
          <button
            type="submit"
            disabled={addCommentMutation.isPending || !comment.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0 cursor-pointer"
          >
            <Send size={13} />
            <span>{addCommentMutation.isPending ? "Posting..." : "Comment"}</span>
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-16 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-zinc-800/70" />
            <div className="h-16 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-zinc-800/70" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center py-6 text-xs text-slate-500 dark:text-zinc-400">
            No comments yet. Start the conversation!
          </p>
        ) : (
          comments.map((item) => {
            const isOwner = item.owner?._id === currentUserId;
            const isEditing = editingCommentId === item._id;

            return (
              <div
                key={item._id}
                className="rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/60 dark:bg-zinc-800/40 p-4 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {item.owner?.avatar ? (
                      <img
                        src={item.owner.avatar}
                        alt={item.owner.username || "User"}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-zinc-800 text-xs font-bold text-indigo-700 dark:text-zinc-200">
                        {item.owner?.username?.slice(0, 1).toUpperCase() || "U"}
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                        {item.owner?.fullName || item.owner?.username || "User"}
                      </span>
                      {item.createdAt && (
                        <span className="ml-2 text-[11px] text-slate-500 dark:text-zinc-400">
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>

                  {isOwner && !isEditing && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommentId(item._id);
                          setEditingValue(item.content);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg p-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-700 transition cursor-pointer"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCommentMutation.mutate(item._id)}
                        className="inline-flex items-center gap-1 rounded-lg p-1.5 text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="mt-3 space-y-2">
                    <input
                      value={editingValue}
                      onChange={(event) => setEditingValue(event.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-slate-900 dark:text-zinc-100 outline-none focus:border-indigo-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditingValue("");
                        }}
                        className="rounded-full border border-slate-200 dark:border-zinc-700 px-3.5 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => updateCommentMutation.mutate()}
                        disabled={updateCommentMutation.isPending || !editingValue.trim()}
                        className="rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer shadow-xs"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 pl-10.5 text-xs leading-relaxed text-slate-700 dark:text-zinc-300">
                    {item.content}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;


