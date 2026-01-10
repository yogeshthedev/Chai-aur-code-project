import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPlaylistById } from "../../features/playlist/playlistThunks";
import VideoCard from "../../components/VideoCard";

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const dispatch = useDispatch();

  const { currentPlaylist, loading, error } = useSelector(
    (state) => state.playlist
  );

  useEffect(() => {
    if (playlistId) {
      dispatch(getPlaylistById(playlistId));
    }
  }, [dispatch, playlistId]);
  console.log(currentPlaylist);

  if (loading) return <p>Loading playlist...</p>;
  if (error) return <p>{error}</p>;
  if (!currentPlaylist) return <p>Playlist not found</p>;

  return (
    <div className="playlist-detail">
      {/* HEADER */}
      <div className="playlist-header">
        <h2>{currentPlaylist.name}</h2>
        <p>{currentPlaylist.description}</p>
        <p>{currentPlaylist.videos.length} videos</p>
      </div>

      {/* VIDEOS */}
      {currentPlaylist.videos.length === 0 ? (
        <p>No videos in this playlist</p>
      ) : (
        <div className="playlist-videos">
          {currentPlaylist.videos.map((video) => (
            <div key={video._id} className="playlist-video-item">
              <VideoCard key={video._id} video={video} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;
