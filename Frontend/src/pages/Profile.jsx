import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  console.log(user);

  return (
    <div>
      <h3>{user?.username}</h3>
      <img src={user?.avatar} alt="avatar" />
    </div>
  );
};

export default Profile;
