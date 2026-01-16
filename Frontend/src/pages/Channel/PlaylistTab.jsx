import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPlaylists } from "../../features/playlist/playlistThunks";
import PlaylistCard from './../../components/PlaylistCard';


const PlaylistTab = ({ channelUserId }) => {
  const dispatch = useDispatch();

  const { userPlaylists, loading, error } = useSelector(
    (state) => state.playlist
  );

  useEffect(() => {
    if (channelUserId) {
      dispatch(getUserPlaylists(channelUserId));
    }
  }, [dispatch, channelUserId]);

  if (loading) return <p>Loading playlists...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="playlist-tab">
      {userPlaylists.length === 0 ? (
        <p>No playlists available</p>
      ) : (
        <div className="playlist-grid">
          {userPlaylists.map((playlist) => (
            <PlaylistCard key={playlist._id} playlist={playlist} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistTab;
