import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  deleteComment,
  fetchVideoComments,
  updateComment,
} from "./../features/comment/commentThunks";

const CommentSection = ({ videoId }) => {
  const dispatch = useDispatch();

  const { comments } = useSelector((state) => state.comment);
  const { user } = useSelector((state) => state.auth);

  // 🔹 local UI state
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // 🔹 fetch comments
  useEffect(() => {
    if (videoId) {
      dispatch(fetchVideoComments(videoId));
    }
  }, [dispatch, videoId]);

  // 🔹 add comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    dispatch(addComment({ videoId, content: newComment }));
    setNewComment("");
  };

  // 🔹 update comment
  const handleUpdateComment = (commentId) => {
    if (!editingText.trim()) return;

    dispatch(updateComment({ commentId, content: editingText }));
    setEditingId(null);
    setEditingText("");
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Comments</h3>

      {/* 🔹 Add Comment */}
      <div>
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Post</button>
      </div>

    

      {/* 🔹 Comment List */}
      {comments.map((comment) => {
        const isOwner = user?._id === comment.owner._id;

        return (
          <div
            key={comment._id}
            style={{
              borderBottom: "1px solid #ccc",
              padding: "10px 0",
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <img
                src={comment.owner.avatar}
                alt="avatar"
                width={30}
                height={30}
              />
              <b>{comment.owner.username}</b>
            </div>

            {/* 🔹 Edit mode */}
            {editingId === comment._id ? (
              <>
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => handleUpdateComment(comment._id)}>
                  Save
                </button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <p>{comment.content}</p>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => dispatch(toggleCommentLike(comment._id))}>
                {comment.isLiked ? "👍" : "🤍"} {comment.likeCount}
              </button>

              {isOwner && (
                <>
                  <button
                    onClick={() => {
                      setEditingId(comment._id);
                      setEditingText(comment.content);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => dispatch(deleteComment(comment._id))}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentSection;
