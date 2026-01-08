import React from "react";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../utils/formatTime";
import { formatDate } from "../utils/formatDate";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  return (
    <div
      key={video._id}
      className="video-card"
      onClick={() => navigate(`/watch/${video._id}`)}
    >
      <div className="thumbnail-container">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="video-thumbnail"
        />
        <span className="video-duration"> {formatTime(video.duration)}</span>
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <div className="video-meta">
          <span>{video.views || 0} views</span>
          <span className="separator">•</span>
       <span>{formatDate(video.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
