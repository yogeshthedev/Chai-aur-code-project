import React from "react";
import { useNavigate } from "react-router-dom";

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();

  const videoCount = playlist.videos?.length || 0;

  // Use first video's thumbnail if exists
  const thumbnail =
    playlist.videos?.[0]?.thumbnail ||
    "https://via.placeholder.com/300x180?text=Playlist";

  return (
    <div
      className="playlist-card"
      onClick={() => navigate(`/playlist/${playlist._id}`)}
    >
      <div className="playlist-thumbnail">
        <img src={thumbnail} alt={playlist.name} />
        <span className="playlist-count">{videoCount} videos</span>
      </div>

      <div className="playlist-info">
        <h3 className="playlist-title">{playlist.name}</h3>
        {playlist.description && (
          <p className="playlist-description">
            {playlist.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PlaylistCard;
