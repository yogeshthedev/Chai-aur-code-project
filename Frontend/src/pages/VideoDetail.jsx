import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CommentSection from "./../components/CommentSection";
import {
  getVideoById,
  toggleSubscription,
  toggleVideoLike,
} from "../features/video/videoThunks.js";
import SaveToPlaylistModal from "../components/SaveToPlaylistModal.jsx";
import { formatViews } from "../utils/formatViews";
import { formatDate } from "../utils/formatDate";

const VideoDetail = () => {
  const { id: videoId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { currentVideo, loading, error } = useSelector((state) => state.video);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (videoId) {
      dispatch(getVideoById(videoId));
    }
  }, [dispatch, videoId]);

  if (loading) {
    return (
      <div className="video-detail">
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-detail">
        <div className="error-container">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <h3>Error Loading Video</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="video-detail">
        <div className="error-container">
          <h3>Video not found</h3>
        </div>
      </div>
    );
  }

  const isOwner = user?._id === currentVideo.owner?._id;

  return (
    <div className="video-detail">
      <div className="video-player-container">
        <video className="video-player" src={currentVideo.videoFile} controls autoPlay />
      </div>

      <div className="video-info-container">
        <h1 className="video-title">{currentVideo.title}</h1>

        <div className="video-metadata">
          <div className="video-stats">
            <span>{formatViews(currentVideo.views)}</span>
            <span className="separator">•</span>
            <span>{formatDate(currentVideo.createdAt)}</span>
          </div>

          <div className="video-action-buttons">
            <button
              className={`action-btn like-btn ${currentVideo.isLiked ? 'liked' : ''}`}
              onClick={() => dispatch(toggleVideoLike(currentVideo._id))}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
              <span>{currentVideo.likeCount || 0}</span>
            </button>

            <button
              className="action-btn save-btn"
              onClick={() => setShowSaveModal(true)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
              <span>Save</span>
            </button>

            <button className="action-btn share-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>

        <div className="channel-info">
          <div 
            className="channel-details"
            onClick={() => navigate(`/c/${currentVideo.owner.username}`)}
          >
            <img
              src={currentVideo.owner.avatar}
              alt={currentVideo.owner.username}
              className="channel-avatar"
            />
            <div className="channel-text">
              <h3 className="channel-name">{currentVideo.owner.username}</h3>
              <span className="subscriber-count">
                {formatViews(currentVideo.owner.subscribersCount || 0).replace(' views', ' subscribers')}
              </span>
            </div>
          </div>

          {!isOwner && (
            <button
              className={`subscribe-btn ${currentVideo.owner.isSubscribed ? 'subscribed' : ''}`}
              onClick={() => dispatch(toggleSubscription(currentVideo.owner._id))}
            >
              {currentVideo.owner.isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          )}
        </div>

        <div className={`video-description ${showFullDescription ? 'expanded' : ''}`}>
          <p>{currentVideo.description}</p>
          {currentVideo.description?.length > 200 && (
            <button
              className="show-more-btn"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        <CommentSection videoId={currentVideo._id} />
      </div>

      {showSaveModal && (
        <SaveToPlaylistModal
          videoId={currentVideo._id}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
};

export default VideoDetail;
