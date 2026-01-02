import React from "react";
import { useNavigate } from "react-router-dom";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const { title, thumbnail, description, _id } = video;
  return (
    <div onClick={() => navigate(`/watch/${_id}`)}>
      <img src={thumbnail} alt={title} />
      <h1>{title}</h1>
      <h1>{description}</h1>
    </div>
  );
};

export default VideoCard;
