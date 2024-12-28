import React from 'react'
import './ProfileSummary.css'
import profile_pic from '../../assets/images/avatar2.png'
import peer from '../../assets/icons/peer.svg'
import writePost from '../../assets/icons/writePost.svg'

const ProfileSummary = () => {
  const user = JSON.parse(localStorage.getItem("user_info"));
  const userspaces = JSON.parse(localStorage.getItem("user_spaces"));

  return <div className='profile-conn'>
    <div className='profile-summary-con'>
      <h1>Profile</h1>
      <img src={user.profilePic?user.profilePic:profile_pic} alt="avatar" className='profile-pic' />
      <p className='username'>{user.fullname}</p>
      {user.title? <p className='title'>{user.title}</p>: <p className='title'>Developer</p>}
    </div>

    <div className="profile-stats">
      <div className="mini-card">
        <img src={peer} alt="Peers" className='iconn' />
        <div className="statss">
          <p className='count'>{userspaces? userspaces.length: 0}</p>
          <p className='count-sub'>Peers</p>
        </div>
      </div>
      <div className="mini-card">
        <img src={writePost} alt="Posts" className='iconn' />
        <div className="statss">
          <p className='count'>{user.posts}</p>
          <p className='count-sub'>Posts</p>
        </div>
      </div>
    </div>
  </div>
}

export default ProfileSummary