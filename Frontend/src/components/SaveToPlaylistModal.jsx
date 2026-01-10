import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserPlaylists,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  createPlaylist,
} from "../features/playlist/playlistThunks";

const SaveToPlaylistModal = ({ videoId, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userPlaylists } = useSelector((state) => state.playlist);

  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserPlaylists(user._id));
    }
  }, [dispatch, user]);

  const handleToggle = (playlist) => {
    const exists = playlist.videos.includes(videoId);

    if (exists) {
      dispatch(
        removeVideoFromPlaylist({
          playlistId: playlist._id,
          videoId,
        })
      );
    } else {
      dispatch(
        addVideoToPlaylist({
          playlistId: playlist._id,
          videoId,
        })
      );
    }
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;

    dispatch(
      createPlaylist({
        name: newPlaylistName,
        description: "",
      })
    ).then(() => {
      setNewPlaylistName("");
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Save to playlist</h3>

        {/* EXISTING PLAYLISTS */}
        {userPlaylists.map((playlist) => {
          const isAdded = playlist.videos.includes(videoId);

          return (
            <label key={playlist._id}>
              <input
                type="checkbox"
                checked={isAdded}
                onChange={() => handleToggle(playlist)}
              />
              {playlist.name}
            </label>
          );
        })}

        {/* CREATE NEW PLAYLIST */}
        <div className="create-playlist">
          <input
            placeholder="New playlist name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          <button onClick={handleCreatePlaylist}>Create</button>
        </div>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SaveToPlaylistModal;
