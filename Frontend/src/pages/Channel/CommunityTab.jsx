import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserTweets,
  createTweet,
  updateTweet,
  deleteTweet,
} from "../../features/tweet/tweetThunks";

const CommunityTab = ({ channelUserId }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { tweets, loading, error } = useSelector((state) => state.tweet);

  const isOwner = user?._id === channelUserId;

  const [content, setContent] = useState("");
  const [editingTweetId, setEditingTweetId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  useEffect(() => {
    if (channelUserId) {
      dispatch(getUserTweets(channelUserId));
    }
  }, [dispatch, channelUserId]);

  const handleCreateTweet = () => {
    if (!content.trim()) return;

    dispatch(createTweet({ content })).then(() => {
      setContent("");
    });
  };

  const handleUpdateTweet = (tweetId) => {
    if (!editingContent.trim()) return;

    dispatch(
      updateTweet({
        tweetId,
        content: editingContent,
      })
    ).then(() => {
      setEditingTweetId(null);
      setEditingContent("");
    });
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="community-tab">
      {/* CREATE TWEET */}
      {isOwner && (
        <div className="create-tweet">
          <textarea
            placeholder="Write a community post..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={handleCreateTweet}>Post</button>
        </div>
      )}

      {/* TWEET LIST */}
      {tweets.length === 0 ? (
        <p>No community posts yet</p>
      ) : (
        <div className="tweet-list">
          {tweets.map((tweet) => (
            <div key={tweet._id} className="tweet-card">
              {editingTweetId === tweet._id ? (
                <>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <div className="tweet-actions">
                    <button onClick={() => handleUpdateTweet(tweet._id)}>
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingTweetId(null);
                        setEditingContent("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="tweet-content">{tweet.content}</p>

                  {isOwner && (
                    <div className="tweet-actions">
                      <button
                        onClick={() => {
                          setEditingTweetId(tweet._id);
                          setEditingContent(tweet.content);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => dispatch(deleteTweet(tweet._id))}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityTab;
