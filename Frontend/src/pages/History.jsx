import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWatchHistory } from "../features/history/historyThunks";
import VideoCard from "../components/VideoCard";

const History = () => {
  const dispatch = useDispatch();

  const { videos, loading, error } = useSelector((state) => state.history);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getWatchHistory());
  }, [dispatch]);

  console.log("Watch History Videos:", videos);
  console.log("User:", user);

  if (loading) {
    return <p>Loading watch history...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="history-page">
      <h2>Watch History</h2>

      {videos.length === 0 ? (
        <p>You haven’t watched any videos yet</p>
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
