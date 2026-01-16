import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAllHistory,
  getWatchHistory,
} from "../features/history/historyThunks";
import VideoCard from "../components/VideoCard";

const History = () => {
  const dispatch = useDispatch();
  const { videos, loading, error } = useSelector((state) => state.history);

  useEffect(() => {
    dispatch(getWatchHistory());
  }, [dispatch]);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your watch history?")) {
      dispatch(deleteAllHistory());
    }
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Watch History</h1>
          <p className="page-subtitle">{videos?.length || 0} videos</p>
        </div>

        {videos?.length > 0 && (
          <button className="clear-btn" onClick={handleClearHistory}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
            Clear All
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading history...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <h3>Error Loading History</h3>
          <p>{error}</p>
        </div>
      ) : videos?.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
          </svg>
          <h3>No History Yet</h3>
          <p>Videos you watch will appear here</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
