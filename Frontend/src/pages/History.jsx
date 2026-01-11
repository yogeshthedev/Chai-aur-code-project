import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWatchHistory } from "../features/history/historyThunks";
import VideoCard from "../components/VideoCard";

const History = () => {
  const dispatch = useDispatch();
  const { videos, loading, error } = useSelector((state) => state.history);

  useEffect(() => {
    dispatch(getWatchHistory());
  }, [dispatch]);

  return (
    <div>
      <div>
        <div>
          <h1>Watch History</h1>
          <p>{videos?.length || 0} videos</p>
        </div>

        <div>
          <button>Clear All</button>
        </div>
      </div>

      <div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div>
            {videos?.map((video) => (
              <div key={video._id}>
                <VideoCard video={video} showRemoveBtn />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
