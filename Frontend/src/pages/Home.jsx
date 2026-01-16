import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideos } from "../features/video/videoThunks.js";
import VideoCard from "../components/VideoCard.jsx";

const Home = () => {
  const dispatch = useDispatch();
  const { videos, loading, error } = useSelector((state) => state.video);

  useEffect(() => {
    dispatch(getAllVideos());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error-state">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <h3>Error Loading Videos</h3>
          <p>{error}</p>
          <button onClick={() => dispatch(getAllVideos())} className="btn-retry">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="home-page">
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
          <h3>No Videos Found</h3>
          <p>Check back later for new content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">

      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Home;
