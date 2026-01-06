import React from "react";
import { useNavigate } from "react-router-dom";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const { title, thumbnail, description, _id } = video;
  return (
     <div
      className="video-card"
      onClick={() => navigate(`/watch/${_id}`)}
    >
      <div className="video-thumb">
        <img src={thumbnail} alt={title} />
      </div>

      <div className="video-info">
        <h3 className="video-card-title">{title}</h3>
        <p className="video-card-desc">{description}</p>
      </div>
    </div>
  );
};

export default VideoCard;
