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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!videos) return <p>Videos not found</p>;

  return (
   <div className="home-page">
  <h1 className="page-title">Home</h1>

  <div className="video-grid">
    {videos.map((video) => (
      <VideoCard key={video._id} video={video} />
    ))}
  </div>
</div>

  );
};

export default Home;
