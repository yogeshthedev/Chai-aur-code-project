import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getChannelProfile,
  getChannelVideos,
} from "../../features/channel/channelThunks";

import ChannelBanner from "./ChannelBanner";
import ChannelHeader from "./ChannelHeader";
import ChannelTabs from "./ChannelTabs";
import ChannelVideos from "./ChannelVideos";

const Channel = () => {
  const { channelId } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("videos");

  const { profile, videos, loading, error } = useSelector(
    (state) => state.profile
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getChannelProfile(user.username));
    dispatch(getChannelVideos(channelId));
  }, [dispatch, channelId, user.username]);

  if (loading) {
    return (
      <div className="channel-page">
        <div className="channel-loading">
          <div className="loading-spinner"></div>
          <p>Loading channel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="channel-page">
        <div className="channel-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="channel-page">
        <div className="channel-not-found">
          <p>Channel not found</p>
        </div>
      </div>
    );
  }

  const isOwner = user?._id === profile._id;

  return (
    <div className="channel-page">
      <ChannelBanner coverImage={profile.coverImage} />

      <div className="channel-container">
        <ChannelHeader profile={profile} isOwner={isOwner} />
        <ChannelTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="channel-content">
          {activeTab === "videos" && <ChannelVideos videos={videos} />}
          {activeTab === "home" && (
            <div className="coming-soon">
              <p>Home content coming soon</p>
            </div>
          )}
          {activeTab !== "videos" && activeTab !== "home" && (
            <div className="coming-soon">
              <p>This section is coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Channel;
