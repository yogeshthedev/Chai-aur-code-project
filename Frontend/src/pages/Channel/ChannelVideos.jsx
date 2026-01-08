import React from "react";

import VideoCard from "../../components/VideoCard";

const ChannelVideos = ({ videos }) => {
  if (!videos || videos.length === 0) {
    return (
      <div className="no-content">
        <svg viewBox="0 0 24 24" className="no-content-icon">
          <path
            d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM12 5.5v9l6-4.5z"
            fill="currentColor"
          />
        </svg>
        <p>No videos uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="videos-section">
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default ChannelVideos;
