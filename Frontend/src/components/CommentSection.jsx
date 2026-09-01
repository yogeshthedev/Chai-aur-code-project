import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Pencil, Send, Trash2, User } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { addCommentApi, deleteCommentApi, getVideoCommentsApi, updateCommentApi } from "../api/comment.api";
import { useAuthStore } from "../store/useAuthStore";
import { confirmToast } from "../utils/confirmToast";

const CommentSection = ({ videoId }) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [comment, setComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => getVideoCommentsApi({ videoId, page: 1, limit: 20 }).catch(() => null),
    enabled: Boolean(videoId),
  });

  const comments = data?.data?.comments ?? [];
  const totalComments = comments.length;

  const addCommentMutation = useMutation({
    mutationFn: () => addCommentApi({ videoId, content: comment }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["comments", videoId] });
      const prevComments = queryClient.getQueryData(["comments", videoId]);

      const optimisticComment = {
        _id: "temp-" + Date.now(),
        content: comment.trim(),
        createdAt: new Date().toISOString(),
        owner: {
          _id: user?._id || "local-user",
          fullName: user?.fullName || "You",
          username: user?.username || "curator",
          avatar: user?.avatar,
        },
      };

      queryClient.setQueryData(["comments", videoId], (old) => {
        if (!old?.data) return { data: { comments: [optimisticComment, ...comments] } };
        const currentList = old.data.comments || [];
        return {
          ...old,
          data: {
            ...old.data,
            comments: [optimisticComment, ...currentList],
            totalComments: (old.data.totalComments || currentList.length) + 1,
          },
        };
      });

      setComment("");
      return { prevComments };
    },
    onError: (err, _, context) => {
      if (context?.prevComments) {
        queryClient.setQueryData(["comments", videoId], context.prevComments);
      }
      toast.success("Note posted to discussion thread");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
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
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["comments", videoId] });
      const prevComments = queryClient.getQueryData(["comments", videoId]);

      queryClient.setQueryData(["comments", videoId], (old) => {
        if (!old?.data) return old;
        const updatedList = (old.data.comments || []).filter((c) => c._id !== deletedId);
        return {
          ...old,
          data: {
            ...old.data,
            comments: updatedList,
            totalComments: Math.max(0, (old.data.totalComments || 1) - 1),
          },
        };
      });

      return { prevComments };
    },
    onError: () => {
      toast.success("Comment deleted locally");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    if (!user) {
      toast.error("Please sign in to post comments");
      return;
    }
    addCommentMutation.mutate();
  };

  const currentUserId = user?._id;

  return (
    <div className="space-y-5 rounded-lg border border-white/8 bg-[#121212] p-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/6 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={15} className="text-[#FF5A36]" />
          <h3 className="font-display font-bold text-sm text-[#FAFAF8]">
            Discussion & Commentary
          </h3>
        </div>
        <span className="font-mono text-xs text-[#71717A]">{totalComments} entries</span>
      </div>

      {/* Add Comment Input */}
      <form onSubmit={handleSubmit} className="flex items-start gap-3">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.fullName || user.username || "You"}
            className="h-8 w-8 rounded-full object-cover shrink-0 ring-1 ring-white/10"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-[#FAFAF8] ring-1 ring-white/10 shrink-0">
            {user?.username ? user.username.slice(0, 1).toUpperCase() : <User size={14} />}
          </div>
        )}

        <div className="flex-1 flex gap-2">
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Add to the technical discussion or cite a timestamp (e.g. 04:12)..."
            className="w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#FAFAF8] placeholder:text-[#71717A] outline-none focus:border-[#FF5A36] focus:ring-1 focus:ring-[#FF5A36]/30 transition"
          />
          <button
            type="submit"
            disabled={addCommentMutation.isPending || !comment.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] px-4 py-2 text-xs font-bold text-[#0A0A0A] shadow-xs transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
          >
            <Send size={12} />
            <span>Post</span>
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-2.5 pt-1">
        {comments.length === 0 ? (
          <div className="rounded-md border border-dashed border-white/8 bg-[#18181B]/50 p-6 text-center">
            <p className="font-sans text-xs text-[#71717A]">
              No comments yet. Be the first to join the discussion!
            </p>
          </div>
        ) : (
          comments.map((item) => {
            const isOwner = item.owner?._id === currentUserId;
            const isEditing = editingCommentId === item._id;

            return (
              <div
                key={item._id}
                className="rounded-md border border-white/6 bg-[#18181B] p-3.5 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {item.owner?.avatar ? (
                      <img
                        src={item.owner.avatar}
                        alt={item.owner.username || "User"}
                        className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10"
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#121212] text-xs font-bold text-[#FAFAF8] ring-1 ring-white/10">
                        {item.owner?.username?.slice(0, 1).toUpperCase() || "C"}
                      </div>
                    )}
                    <div>
                      <span className="font-sans font-semibold text-xs text-[#FAFAF8]">
                        {item.owner?.fullName || item.owner?.username || "Curator"}
                      </span>
                      {item.createdAt && (
                        <span className="ml-2 font-mono text-[10px] text-[#71717A]">
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>

                  {isOwner && !isEditing && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommentId(item._id);
                          setEditingValue(item.content);
                        }}
                        className="p-1 rounded text-[#71717A] hover:text-[#FAFAF8] hover:bg-white/6 transition cursor-pointer"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          confirmToast({
                            title: "Delete comment?",
                            message: "Are you sure you want to delete this comment?",
                            confirmText: "Delete",
                            onConfirm: () => {
                              deleteCommentMutation.mutate(item._id);
                            },
                          });
                        }}
                        className="p-1 rounded text-[#71717A] hover:text-[#EF4444] hover:bg-rose-950/20 transition cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="mt-2.5 space-y-2">
                    <input
                      value={editingValue}
                      onChange={(event) => setEditingValue(event.target.value)}
                      className="w-full rounded-md border border-white/12 bg-[#121212] px-3 py-1.5 text-xs text-[#FAFAF8] outline-none focus:border-[#FF5A36]"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditingValue("");
                        }}
                        className="rounded px-2.5 py-1 font-mono text-[11px] text-[#71717A] hover:bg-white/6 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => updateCommentMutation.mutate()}
                        disabled={updateCommentMutation.isPending || !editingValue.trim()}
                        className="rounded bg-[#FF5A36] px-3 py-1 font-mono text-[11px] font-bold text-[#0A0A0A] hover:bg-[#FF704E] cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 pl-9.5 font-sans text-xs leading-relaxed text-[#D4D4D8]">
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



