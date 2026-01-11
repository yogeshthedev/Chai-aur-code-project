import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserPlaylists,
  createPlaylist,
  deletePlaylist,
} from "../../features/playlist/playlistThunks";
import PlaylistCard from "../../components/PlaylistCard";

const Playlist = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userPlaylists, loading, error } = useSelector(
    (state) => state.playlist
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserPlaylists(user._id));
    }
  }, [dispatch, user]);

  const handleCreate = () => {
    if (!name.trim()) return;

    dispatch(
      createPlaylist({
        name,
        description,
      })
    );

    setName("");
    setDescription("");
  };

  if (loading) return <p>Loading playlists...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="playlist-page">
      <h2>My Playlists</h2>

      {/* CREATE PLAYLIST */}
      <div className="create-playlist">
        <input
          type="text"
          placeholder="Playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleCreate}>Create</button>
      </div>

      {/* PLAYLIST LIST */}
      {userPlaylists.length === 0 ? (
        <p>No playlists yet</p>
      ) : (
        <div className="playlist-grid">
          {userPlaylists.map((playlist) => (
            <div key={playlist._id} className="playlist-item">
              <PlaylistCard playlist={playlist} />

              {/* DELETE */}
              <button
                className="delete-btn"
                onClick={() => dispatch(deletePlaylist(playlist._id))}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlist;
