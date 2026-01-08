import React from "react";
import { useDispatch } from "react-redux";
import { toggleSubscription } from "../../features/channel/channelThunks";

const ChannelHeader = ({ profile, isOwner }) => {
  const dispatch = useDispatch();

  const formatSubscriberCount = (count) => {
    if (!count) return "0 subscribers";
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M subscribers`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K subscribers`;
    }
    return `${count} subscribers`;
  };

  return (
    <div className="channel-header">
      <div className="channel-avatar">
        <img src={profile.avatar} alt={profile.username} />
      </div>

      <div className="channel-meta">
        <h1 className="channel-name">
          {profile.fullName || profile.username}
        </h1>

        <div className="channel-details">
          <span className="channel-handle">@{profile.username}</span>
          <span className="separator">•</span>
          <span className="subscriber-count">
            {formatSubscriberCount(profile.subscribersCount)}
          </span>
          <span className="separator">•</span>
          <span className="video-count">
            {profile.channelVideosCount || 0} videos
          </span>
        </div>

        <p className="channel-description">
          {profile.description || "Welcome to my channel!"}
        </p>

        <div className="channel-actions">
          {!isOwner ? (
            <>
              <button
                className={`subscribe-btn ${profile.isSubscribed ? "subscribed" : ""}`}
                onClick={() => dispatch(toggleSubscription(profile._id))}
              >
                {profile.isSubscribed ? (
                  <>
                    <svg viewBox="0 0 24 24" className="bell-icon">
                      <path
                        d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
                        fill="currentColor"
                      />
                    </svg>
                    Subscribed
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
              <button className="join-btn">Join</button>
            </>
          ) : (
            <>
              <button className="customize-btn">Customize channel</button>
              <button className="manage-btn">Manage videos</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelHeader;
