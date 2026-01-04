import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getVideoById,
  toggleSubscription,
  toggleVideoLike,
} from "../features/video/videoThunks.js";
import CommentSection from "./../components/comment-section/CommentSection";

const VideoDetail = () => {
  const { id: videoId } = useParams();
  const dispatch = useDispatch();

  const { currentVideo, loading, error } = useSelector((state) => state.video);

  useEffect(() => {
    if (videoId) {
      dispatch(getVideoById(videoId));
    }
  }, [dispatch, videoId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!currentVideo) return <p>Video not found</p>;

  return (
    <div>
      <h1>{currentVideo.title}</h1>

      <video src={currentVideo.videoFile} controls width="600" />

      <p>{currentVideo.likeCount}</p>

      <div
        className="like"
        onClick={() => dispatch(toggleVideoLike(currentVideo._id))}
      >
        {currentVideo.isLiked ? "👍" : "❤"}
      </div>

      <p>{currentVideo.description}</p>

      <button
        onClick={() => dispatch(toggleSubscription(currentVideo.owner._id))}
        style={{
          background: currentVideo.owner.isSubscribed ? "gray" : "red",
          color: "black",
          marginLeft: "10px",
        }}
      >
        {currentVideo.owner.isSubscribed ? "Subscribed" : "Subscribe"}
      </button>
      <p>Views: {currentVideo.views}</p>

      <CommentSection videoId={currentVideo._id} />
    </div>
  );
};

export default VideoDetail;
