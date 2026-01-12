import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <div className="profile-page">
        <div className="empty-state">
          <h3>Please login to view your profile</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="cover-image">
          {user.coverImage && (
            <img src={user.coverImage} alt="Cover" />
          )}
        </div>

        <div className="profile-info">
          <div className="avatar-section">
            <img
              src={user.avatar || '/default-avatar.png'}
              alt={user.username}
              className="profile-avatar"
            />
          </div>

          <div className="user-details">
            <h1 className="username">{user.fullName || user.username}</h1>
            <p className="user-handle">@{user.username}</p>
            <div className="user-stats">
              <div className="stat-item">
                <span className="stat-value">{user.subscribersCount || 0}</span>
                <span className="stat-label">Subscribers</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{user.channelsSubscribedToCount || 0}</span>
                <span className="stat-label">Subscriptions</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <Link to={`/c/${user.username}`} className="btn-channel">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"/>
              </svg>
              View Channel
            </Link>
            <button className="btn-edit">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="info-card">
              <h3>Account Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Username</span>
                  <span className="info-value">@{user.username}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{user.fullName || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Joined</span>
                  <span className="info-value">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <h3>Settings</h3>
            <p className="coming-soon">Settings panel coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
