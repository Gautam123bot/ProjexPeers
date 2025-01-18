import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import "./FindATeammate.css";
import profile_img from "../../../src/assets/images/profile_img.jpg";

const FindATeammate = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = () => {
      const user = JSON.parse(localStorage.getItem("user_info"));
      setCurrentUser(user?.username);
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/getallusers`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchCurrentUser();
    fetchUsers();
  }, []);

  const getAvailabilityIndicator = (isAvailable) => {
    return isAvailable ? (
      <span className="status-indicator available"></span>
    ) : (
      <span className="status-indicator not-available"></span>
    );
  };

  const handleConnect = async (user) => {
    if (!currentUser) {
      alert("Please log in to connect with users.");
      return;
    }

    const payload = {
      admin: currentUser,
      members: [currentUser, user.username],
      spaceName: `${currentUser}-${user.username}`, // Example space name
      chatPic: user.profilePic || profile_img,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/space/create-space`, payload);
      if (response.status === 200) {
        alert(`You are now connected with ${user.fullname}!`);
      }
    } catch (error) {
      console.error("Error connecting with user", error);
      alert("Failed to connect. Please try again later.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="users-list-container">
        {users.length === 0 ? (
          <p>No users available</p>
        ) : (
          users
            .filter((user) => user.username !== currentUser) // Exclude current user
            .map((user) => (
              <div key={user._id} className="user-card">
                <img src={user.profilePic || profile_img} alt={user.fullname} className="user-profile-pic" />
                <div className="user-info">
                  <h3>{user.fullname}</h3>
                  <p>{user.about ? user.about : "No bio available"}</p>
                  <div className="availability-status">
                    {getAvailabilityIndicator(user.available)}
                    <span>{user.available ? "Available" : "Not Available"}</span>
                  </div>
                  <Link to={`/${user.username}`} className="view-profile-btn">
                    View Profile
                  </Link>
                  <button
                    onClick={() => handleConnect(user)}
                    className="connect-btn"
                    disabled={!user.available} // Disable button if user is not available
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </>
  );
};

export default FindATeammate;
