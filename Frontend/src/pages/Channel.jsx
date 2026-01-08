import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getChannelProfile,
  getChannelVideos,
  toggleSubscription,
} from "../features/channel/channelThunks";

const Channel = () => {
  const { channelId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, videos, loading, error } = useSelector(
    (state) => state.profile
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getChannelProfile(user.username));
    dispatch(getChannelVideos(channelId));
  }, [dispatch, channelId, user.username]);

  if (loading) return <p>Loading channel...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>Channel not found</p>;

  const isOwner = user?._id === profile._id;

  return (
    <div className="channel-page">
      {/* CHANNEL HEADER */}
      <div className="channel-cover">
        <img src={profile.coverImage} alt="cover" />
      </div>

      <div className="channel-header">
        <img src={profile.avatar} alt="avatar" className="channel-avatar" />

        <div className="channel-info">
          <h2>{profile.username}</h2>
          <p>{profile.subscribersCount} subscribers</p>

          {!isOwner && (
            <button
              className="subscribe-btn"
              onClick={() => dispatch(toggleSubscription(profile._id))}
              style={{
                background: profile.isSubscribed ? "gray" : "red",
                color: "white",
              }}
            >
              {profile.isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}
        </div>
      </div>

      {/* CHANNEL VIDEOS */}
      <div className="channel-videos">
        {videos?.length === 0 ? (
          <p>No videos uploaded yet</p>
        ) : (
          <div className="video-grid">
            {videos?.map((video) => (
              <div
                key={video._id}
                className="video-card"
                onClick={() => navigate(`/watch/${video._id}`)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="video-thumb"
                />
                <h4>{video.title}</h4>
                <p>{video.views} views</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;
