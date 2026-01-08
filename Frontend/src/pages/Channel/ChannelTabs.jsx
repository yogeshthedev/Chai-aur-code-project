import React from "react";

const ChannelTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["Home", "Videos", "Shorts", "Live", "Playlists", "Community"];

  return (
    <nav className="channel-tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab-btn ${activeTab === tab.toLowerCase() ? "active" : ""}`}
          onClick={() => setActiveTab(tab.toLowerCase())}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
};

export default ChannelTabs;
