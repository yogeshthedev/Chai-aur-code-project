import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideoComments } from "../../features/comment/commentThunks";

const CommentSection = ({ videoId }) => {
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comment);

  useEffect(() => {
    dispatch(fetchVideoComments(videoId));
  }, [dispatch]);

  console.log(comments);

  return (
    <div>
      {comments.map((comment) => {
        return (
          <p key={comment._id} style={{ color: "red" }}>
            {comment.content}
          </p>
        );
      })}
    </div>
  );
};

export default CommentSection;
