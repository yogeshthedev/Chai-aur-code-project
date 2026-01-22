import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../features/auth/authThunks";

const EditProfileModal = ({ user, onClose }) => {
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState(user.fullName || "");
  const [email, setEmail] = useState(user.email || "");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);

    try {
      await dispatch(updateAccountDetails({ fullName, email })).unwrap();

      if (avatar) {
        const avatarData = new FormData();
        avatarData.append("avatar", avatar);
        await dispatch(updateUserAvatar(avatarData)).unwrap();
      }

      if (coverImage) {
        const coverData = new FormData();
        coverData.append("coverImage", coverImage);
        await dispatch(updateUserCoverImage(coverData)).unwrap();
      }

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-overlay">
      <div className="edit-profile-modal">
        <h2>Edit Profile</h2>

        <div className="form-group">
          <label>Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Avatar</label>
          <input type="file" onChange={(e) => setAvatar(e.target.files[0])} />
        </div>

        <div className="form-group">
          <label>Cover Image</label>
          <input
            type="file"
            onChange={(e) => setCoverImage(e.target.files[0])}
          />
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="cancel">
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
