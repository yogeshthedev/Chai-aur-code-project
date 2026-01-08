import React from "react";

const ChannelBanner = ({ coverImage }) => {
  return (
    <div className="channel-banner">
      {coverImage ? (
        <img src={coverImage} alt="Channel banner" />
      ) : (
        <div className="banner-placeholder"></div>
      )}
    </div>
  );
};

export default ChannelBanner;
