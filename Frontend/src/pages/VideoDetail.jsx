import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CommentSection from "./../components/CommentSection";
import {
  getVideoById,
  toggleSubscription,
  toggleVideoLike,
} from "../features/video/videoThunks.js";

const VideoDetail = () => {
  const { id: videoId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentVideo, loading, error } = useSelector((state) => state.video);
  const { user } = useSelector((state) => state.auth);

  
  useEffect(() => {
    if (videoId) {
      dispatch(getVideoById(videoId));
    }
  }, [dispatch, videoId]);
  
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!currentVideo) return <p>Video not found</p>;

  return (
    <div className="video-detail">
      <video className="video-player" src={currentVideo.videoFile} controls />

      <div className="video-actions">
        <h1
          className="video-title"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/c/${currentVideo.owner.username}`)}
        >
          {currentVideo.title}
        </h1>
        <button
          className={`like-btn ${currentVideo.isLiked ? "active" : ""}`}
          onClick={() => dispatch(toggleVideoLike(currentVideo._id))}
        >
          {currentVideo.isLiked ? "👍" : "❤"} {currentVideo.likeCount}
        </button>

        {!user._id === currentVideo.owner._id && (
          <button
            className={`subscribe-btn ${
              currentVideo.owner.isSubscribed ? "subscribed" : ""
            }`}
            onClick={() => dispatch(toggleSubscription(currentVideo.owner._id))}
          >
            {currentVideo.owner.isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        )}
      </div>

      <p className="video-description">{currentVideo.description}</p>
      <p className="video-views">Views: {currentVideo.views}</p>

      <CommentSection videoId={currentVideo._id} />
    </div>
  );
};

export default VideoDetail;
