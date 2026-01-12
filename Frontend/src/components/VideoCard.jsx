import React from "react";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../utils/formatTime";
import { formatDate } from "../utils/formatDate";
import { formatViews } from "../utils/formatViews";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const handleChannelClick = (e) => {
    e.stopPropagation();
    navigate(`/c/${video.owner?.username}`);
  };

  return (
    <div
      className="video-card"
      onClick={() => navigate(`/watch/${video._id}`)}
    >
      <div className="thumbnail-container">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="video-thumbnail"
        />
        <span className="video-duration">{formatTime(video.duration)}</span>
      </div>
      
      <div className="video-info">
        <div className="video-details">
          {video.owner?.avatar && (
            <img
              src={video.owner.avatar}
              alt={video.owner.username}
              className="channel-avatar"
              onClick={handleChannelClick}
            />
          )}
          
          <div className="video-content">
            <h3 className="video-title">{video.title}</h3>
            
            <div className="video-metadata">
              {video.owner?.username && (
                <span className="channel-name" onClick={handleChannelClick}>
                  {video.owner.username}
                </span>
              )}
              
              <div className="video-meta">
                <span>{formatViews(video.views || 0)} views</span>
                <span className="separator">•</span>
                <span>{formatDate(video.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
