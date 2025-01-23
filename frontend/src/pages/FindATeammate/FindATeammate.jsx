import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import "./FindATeammate.css";
import profile_img from "../../../src/assets/images/profile_img.jpg";

const FindATeammate = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [competition, setCompetition] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const user_info = localStorage.getItem("user_info");
  const user_id = JSON.parse(user_info)?._id;

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTeamName("");
    setCompetition("");
    setMessage("");
  };

  const handleSend = async (recipientId) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/invitation/send-invite`, {
        senderId: user_id,
        recipientId,
        teamName,
        competition,
        message,
      });
      alert("Invitation sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to send invitation.");
    } finally {
      handleCloseModal();
    }
  };

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

  // const handleConnect = async (user) => {
  //   if (!currentUser) {
  //     alert("Please log in to connect with users.");
  //     return;
  //   }

  //   const payload = {
  //     admin: currentUser,
  //     members: [currentUser, user.username],
  //     spaceName: `${currentUser}-${user.username}`,
  //     chatPic: user.profilePic || profile_img,
  //   };

  //   try {
  //     const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/space/create-space`, payload);
  //     if (response.status === 200) {
  //       alert(`You are now connected with ${user.fullname}!`);
  //     }
  //   } catch (error) {
  //     console.error("Error connecting with user", error);
  //     alert("Failed to connect. Please try again later.");
  //   }
  // };

  return (
    <>
      <Navbar />
      <div className="users-list-container">
        {users.length === 0 ? (
          <p>No users available</p>
        ) : (
          users
            .filter((user) => user.username !== currentUser)
            .map((user) => (
              <div key={user._id} className="user-card">
                <div className="flex justify-center">

                <img src={user.profilePic || profile_img} alt={user.fullname} className="user-profile-pic" />
                </div>
                <div className="user-info">
                  <h3>{user.fullname}</h3>
                  <p>{user.about ? user.about : "No bio available"}</p>
                  <div className="availability-status">
                    {getAvailabilityIndicator(user.available)}
                    <span>{user.available ? "Available" : "Not Available"}</span>
                  </div>
                  <div className="flex mt-3">
                  
                  {/* <button
                    onClick={() => handleConnect(user)}
                    className="connect-btn"
                    disabled={!user.available}
                  >
                    Connect
                  </button> */}

                  <button
                    onClick={() => handleOpenModal(user)}
                    className="connect-btn mr-2"
                    disabled={!user.available}
                  >
                    Send Invitation
                  </button>
                  <Link to={`/${user.username}`} className="view-profile-btn mr-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition duration-200 ease-in-out">
                    View Profile
                  </Link>
                  </div>


                </div>
                {isModalOpen && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 space-y-6 relative">
                      <button
                        onClick={handleCloseModal}
                        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <h2 className="text-2xl font-semibold text-center text-gray-800">
                        Send Invitation to {selectedUser?.fullname}
                      </h2>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-gray-700">Team Name:</label>
                          <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter team name"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700">Competition:</label>
                          <input
                            type="text"
                            value={competition}
                            onChange={(e) => setCompetition(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter competition name"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700">Message:</label>
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="Write a message"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSend(selectedUser._id)}
                          disabled={!selectedUser.available}
                          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none"
                        >
                          Send Invitation
                        </button>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            ))
        )}
      </div>

    </>
  );
};

export default FindATeammate;
