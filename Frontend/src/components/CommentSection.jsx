import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  deleteComment,
  fetchVideoComments,
  toggleCommentLike,
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
   <div className="comment-section">
  <h3 className="comment-title">Comments</h3>

  {/* Add Comment */}
  <div className="comment-input">
    <input
      type="text"
      placeholder="Add a comment..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
    />
    <button onClick={handleAddComment}>Post</button>
  </div>

  {/* Comment List */}
  {comments.map((comment) => {
    const isOwner = user?._id === comment.owner._id;

    return (
      <div key={comment._id} className="comment-item">
        <div className="comment-header">
          <img
            src={comment.owner.avatar}
            alt="avatar"
            className="comment-avatar"
          />
          <b>{comment.owner.username}</b>
        </div>

        {editingId === comment._id ? (
          <div className="comment-edit">
            <input
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
            />
            <button onClick={() => handleUpdateComment(comment._id)}>
              Save
            </button>
            <button onClick={() => setEditingId(null)}>Cancel</button>
          </div>
        ) : (
          <p className="comment-content">{comment.content}</p>
        )}

        <div className="comment-actions">
          <button onClick={() => dispatch(toggleCommentLike(comment._id))}>
            {comment.isLiked ? "👍" : "🤍"} {comment.commentLikeCount}
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
