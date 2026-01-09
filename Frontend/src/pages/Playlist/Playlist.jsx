import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPlaylists } from "../../features/playlist/playlistThunks";
import PlaylistCard from "../../components/PlaylistCard";

const Playlist = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;

   
  const { userPlaylists, loading, error } = useSelector(
    (state) => state.playlist
  );

  useEffect(() => {
    if (userId) {
      dispatch(getUserPlaylists(userId));
    }
  }, [dispatch, userId]);

  if (loading) return <p>Loading playlists...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="playlist-page">
      <h2>My Playlists</h2>

      {userPlaylists.length === 0 ? (
        <p>No playlists created yet</p>
      ) : (
        <div className="playlist-grid">
          {userPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist._id}
              playlist={playlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlist;
