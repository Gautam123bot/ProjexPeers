import React from 'react';
import profile_pic from '../../assets/images/profile_img.jpg';
import peer from '../../assets/icons/peer.svg';
import writePost from '../../assets/icons/writePost.svg';

const ProfileSummary = () => {
  const user = JSON.parse(localStorage.getItem("user_info"));
  const userspaces = JSON.parse(localStorage.getItem("user_spaces"));

  return (
    <div className="bg-gray-900 rounded-lg p-5 text-white shadow-md">
      <div className="text-center mb-5">
        <h1 className="text-xl font-semibold">Profile</h1>
        <img
          src={user.profilePic ? user.profilePic : profile_pic}
          alt="avatar"
          className="w-28 h-28 rounded-full border-4 border-yellow-400 mx-auto my-3"
        />
        <p className="text-lg font-bold">{user.fullname}</p>
        <p className="text-sm text-gray-400">{user.title ? user.title : 'Developer'}</p>
      </div>

      <div className="flex justify-between gap-3">
        <div className="bg-gray-800 rounded-md p-4 flex items-center shadow">
          <img src={peer} alt="Peers" className="w-10 h-10 mr-3" />
          <div>
            <p className="text-lg font-semibold">{userspaces ? userspaces.length : 0}</p>
            <p className="text-xs text-gray-400">Peers</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-md p-4 flex items-center shadow">
          <img src={writePost} alt="Posts" className="w-10 h-10 mr-3" />
          <div>
            <p className="text-lg font-semibold">{user.posts || 0}</p>
            <p className="text-xs text-gray-400">Posts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;
