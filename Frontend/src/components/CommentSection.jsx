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
      <h3 className="comment-title">{comments?.length || 0} Comments</h3>

      {/* Add Comment */}
      {user && (
        <div className="comment-input-wrapper">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt={user.username}
            className="comment-user-avatar"
          />
          <div className="comment-input-container">
            <input
              type="text"
              className="comment-input"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
            />
            <div className="comment-input-actions">
              <button
                className="btn-cancel"
                onClick={() => setNewComment("")}
                disabled={!newComment.trim()}
              >
                Cancel
              </button>
              <button
                className="btn-comment"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment List */}
      <div className="comment-list">
        {comments?.length === 0 ? (
          <div className="no-comments">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            </svg>
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isOwner = user?._id === comment.owner._id;

            return (
              <div key={comment._id} className="comment-item">
                <img
                  src={comment.owner.avatar || "/default-avatar.png"}
                  alt={comment.owner.username}
                  className="comment-avatar"
                />

                <div className="comment-content-wrapper">
                  <div className="comment-header">
                    <span className="comment-author">
                      {comment.owner.username}
                    </span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {editingId === comment._id ? (
                    <div className="comment-edit">
                      <input
                        type="text"
                        className="edit-input"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        autoFocus
                      />
                      <div className="edit-actions">
                        <button
                          className="btn-cancel"
                          onClick={() => {
                            setEditingId(null);
                            setEditingText("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn-save"
                          onClick={() => handleUpdateComment(comment._id)}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="comment-text">{comment.content}</p>
                  )}

                  <div className="comment-actions">
                    <button
                      className={`action-btn like-btn ${
                        comment.isLiked ? "liked" : ""
                      }`}
                      onClick={() => dispatch(toggleCommentLike(comment._id))}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                      </svg>
                      <span>{comment.commentLikeCount || 0}</span>
                    </button>

                    {isOwner && (
                      <>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => {
                            setEditingId(comment._id);
                            setEditingText(comment.content);
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => dispatch(deleteComment(comment._id))}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                          </svg>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;
