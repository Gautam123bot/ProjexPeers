import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import "./FindATeammate.css";
import profile_img from "../../../src/assets/images/profile_img.jpg";
import down_arrow from "../../../src/assets/icons/down.png";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import Loader from "../../components/Loader/Loader";
import socket from "../../socket";

const FindATeammate = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loaderUser, setLoaderUser] = useState(false);
  const user_info = JSON.parse(localStorage.getItem("user_info"));
  const user_id = user_info?._id;
  const username = user_info?.username;
  const [sentRequests, setSentRequests] = useState(() => {
    try {
      const storedRequests = localStorage.getItem("sentRequests");
      return storedRequests ? JSON.parse(storedRequests) : [];
    } catch (e) {
      console.error("Error parsing sentRequests from localStorage:", e);
      return [];
    }
  });

  const [formData, setFormData] = useState({
    senderName: "",               // sender details
    senderEmail: "",
    competitionType: "",            // competition details
    competitionName: "",
    dateOfCompetition: "",
    durationOfCompetition: "",
    registrationDeadlineOfCompetition: "",
    currentTeamSize: "",                // team details
    teamName: "",
    country: "",                        // venue details
    state: "",
    city: "",
    location: "",
    projectOverview: "",                // project details
    message: "",                // other info
  });

  const [openSections, setOpenSections] = useState({
    senderDetails: false,
    competitionDetails: false,
    teamDetails: false,
    venueDetails: false,
    projectDetails: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleToggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null);
    setSelectedCity(null);
    setFormData({ ...formData, country: selectedOption ? selectedOption.name : "" });
  };

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    setSelectedCity(null);
    setFormData({ ...formData, state: selectedOption ? selectedOption.name : "" });
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    setFormData({ ...formData, city: selectedOption ? selectedOption.name : "" });
  };

  useEffect(() => {
    if (user_info) {
      setFormData((prevData) => ({
        ...prevData,
        senderName: user_info.fullname,
        senderEmail: user_info.email,
      }));
    }
  }, []);


  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    socket.on('invite:accepted', (data) => {
      const { senderUserName, recipientUserName } = data;

      if (!senderUserName || !recipientUserName) {
        console.error("Missing senderUserName or recipientUserName in accepted event!");
        return;
      }
      console.log("yehh! invite accepted");

      setSentRequests((prevRequests) => {
        const updatedRequests = prevRequests.filter((request) => request !== recipientUserName);
        localStorage.setItem("sentRequests", JSON.stringify(updatedRequests));
        return updatedRequests;
      });

      let acceptedUsers = JSON.parse(localStorage.getItem("acceptedUsers")) || [];
      acceptedUsers = [...new Set([...acceptedUsers, recipientUserName])];
      localStorage.setItem("acceptedUsers", JSON.stringify(acceptedUsers));
    });

    return () => {
      socket.off('invite:accepted');
    };
  }, []);


  socket.on('invite:declined', (data) => {
    const { senderUserName, recipientUserName, status } = data;

    if (!senderUserName || !recipientUserName) {
      console.error("Missing senderUserName or recipientUserName in declined event!");
      return;
    }

    console.log("😢 Invite declined by", recipientUserName);

    setSentRequests((prevRequests) => {
      const updatedRequests = prevRequests.filter((request) => request !== recipientUserName);
      localStorage.setItem("sentRequests", JSON.stringify(updatedRequests));
      return updatedRequests;
    });
    return () => {
      socket.off('invite:accepted');
    };

  });



  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
  }, []);

  useEffect(() => {
    try {
      const savedRequests = localStorage.getItem("sentRequests");
      if (savedRequests) {
        const parsedRequests = JSON.parse(savedRequests);
        if (Array.isArray(parsedRequests)) {
          setSentRequests(parsedRequests);
        } else {
          console.warn("Invalid data in localStorage, resetting sentRequests.");
          setSentRequests([]);
          localStorage.setItem("sentRequests", JSON.stringify([]));
        }
      }
    } catch (e) {
      console.error("Error reading sentRequests from localStorage:", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sentRequests", JSON.stringify(sentRequests));
  }, [sentRequests]);

  const handleSend = useCallback(async (recipientUserName) => {
    setError("");
    setSuccess("");

    const payload = {
      ...formData,
      senderUserName: username,
      recipientUserName,
    };

    const requiredFields = [
      "senderName",
      "senderEmail",
      "competitionType",
      "competitionName",
      "durationOfCompetition",
      "registrationDeadlineOfCompetition",
      "currentTeamSize",
    ];

    for (let field of requiredFields) {
      if (!payload[field]) {
        setError(`Field ${field} is required.`);
        alert(`Field ${field} is required.`);
        return;
      }
    }
    try {
      if (!socket || !socket.connected) {
        console.error("❌ Socket is not connected!");
        return;
      }

      socket.emit('invite:sent', { senderUserName: username, recipientUserName });
      console.log("📤 Emitting event: invite:sent", { senderUserName: username, recipientUserName });
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/invitation/send-invite`, payload);
      setSuccess(response.data.message);
      alert("Invitation sent successfully!");
      setSentRequests((prev) => {
        const updatedRequests = Array.isArray(prev) ? [...new Set([...prev, recipientUserName])] : [recipientUserName];
        localStorage.setItem("sentRequests", JSON.stringify(updatedRequests));
        return updatedRequests;
      });
      socket.on("invite:sent:confirmation", () => {
        console.log("✅ Server acknowledged the invite:sent event.");
      });
    } catch (error) {
      setError(error.response?.data?.error || "Failed to send the invitation.");
      alert("Failed to send invitation.");
    } finally {
      handleCloseModal();
    }
  }, [user_id, formData]);

  useEffect(() => {
    const fetchCurrentUser = () => {
      const user = JSON.parse(localStorage.getItem("user_info"));
      setCurrentUser(user?.username);
    };

    const fetchUsers = async () => {
      setLoaderUser(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/getallusers`);
        let users = response.data;

        const acceptedUsers = JSON.parse(localStorage.getItem("acceptedUsers")) || [];
        users = users.filter((user) => !acceptedUsers.includes(user.username));
        setUsers(users);
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setLoaderUser(false);
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

  const handleNameEditClick = () => {
    setIsNameEditable(true);
  };
  const handleEmailEditClick = () => {
    setIsEmailEditable(true);
  };

  return (
    <>
      {loaderUser && <Loader />}
      <Navbar />
      <div className="flex flex-wrap gap-6 p-8 justify-center">
        {users.length === 0 ? (
          <p>No users available</p>
        ) : (
          users
            .filter((user) => user.username !== currentUser)
            .map((user) => (
              <div key={user._id} className="bg-white p-4 rounded-lg shadow-lg text-center">
                <div className="flex justify-center">

                  <img src={user.profilePic || profile_img} alt={user.fullname} className="w-20 h-20 rounded-full object-cover" />
                </div>
                <div className="user-info">
                  <h3>{user.fullname}</h3>
                  <p>{user.about ? user.about : "No bio available"}</p>
                  <div className="availability-status">
                    {getAvailabilityIndicator(user.available)}
                    <span>{user.available ? "Available" : "Not Available"}</span>
                  </div>
                  <div className="flex mt-3">
                    {sentRequests.includes(user.username) ? (
                      <button className="bg-gray-400 text-white rounded-lg py-2 px-4 cursor-not-allowed">
                        Request Sent
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="connect-btn mr-2"
                        disabled={!user.available}
                      >
                        Send Invitation
                      </button>
                    )}
                    <Link to={`/${user.username}`} className="inline-block py-2 px-4 rounded-md text-decoration-none mr-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition duration-200 ease-in-out">
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
                      <form className="max-h-[400px] overflow-y-auto">
                        {/* Sender Details */}
                        <div className="border-b pb-4 mb-4 relative">
                          <button
                            type="button"
                            onClick={() => handleToggleSection("senderDetails")}
                            className="w-full text-left font-medium text-lg py-2"
                          >
                            Sender Details<span className="text-red-500">*</span>
                          </button>
                          <div
                            className={`transition-all duration-700 ease-in-out overflow-hidden ${openSections.senderDetails ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"}`}
                          >
                            {openSections.senderDetails && (
                              <div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-1 text-left ml-2.5" htmlFor="senderName">
                                    Sender Name<span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    id="senderName"
                                    name="senderName"
                                    value={formData.senderName}
                                    onChange={handleChange}
                                    disabled={!isNameEditable}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                                  />
                                  {!isNameEditable && (
                                    <button
                                      type="button"
                                      onClick={handleNameEditClick}
                                      className="text-blue-500 text-sm mt-2 absolute right-6 z-100 underline hover:text-blue-700 hover:underline"
                                    >
                                      Edit
                                    </button>
                                  )}
                                </div>

                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-1 text-left ml-2.5" htmlFor="senderEmail">
                                    Sender Email<span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="email"
                                    id="senderEmail"
                                    name="senderEmail"
                                    value={formData.senderEmail}
                                    onChange={handleChange}
                                    disabled={!isEmailEditable}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                                  />
                                  {!isEmailEditable && (
                                    <button
                                      type="button"
                                      onClick={handleEmailEditClick}
                                      className="text-blue-500 text-sm mt-2 absolute right-6 z-100 underline hover:text-blue-700 hover:underline"
                                    >
                                      Edit
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Competition Details */}
                        <div className="border-b pb-4 mb-4">
                          <button
                            type="button"
                            onClick={() => handleToggleSection("competitionDetails")}
                            className="w-full text-left font-medium text-lg py-2"
                          >
                            Competition Details<span className="text-red-500">*</span>
                          </button>
                          <div
                            className={`transition-all duration-700 ease-in-out overflow-hidden ${openSections.competitionDetails ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"}`}
                          >
                            {openSections.competitionDetails && (
                              <div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-1 text-left ml-2.5" htmlFor="competitionType">
                                    Competition Type<span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    id="competitionType"
                                    name="competitionType"
                                    placeholder="select competition type"
                                    value={formData.competitionType}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                                  />
                                </div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-1 text-left ml-2.5" htmlFor="competitionName">
                                    Competition Name<span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    id="competitionName"
                                    name="competitionName"
                                    placeholder="Enter competition name"
                                    value={formData.competitionName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                                  />
                                </div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-1 text-left ml-2.5" htmlFor="dateOfCompetition">
                                    Date of Competition
                                  </label>
                                  <input
                                    type="date"
                                    id="dateOfCompetition"
                                    name="dateOfCompetition"
                                    value={formData.dateOfCompetition}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                                  />
                                </div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-1 text-left ml-2.5" htmlFor="durationOfCompetition">
                                    Duration of Competition<span className="text-red-500">*</span> (in hrs)
                                  </label>
                                  <input
                                    type="number"
                                    id="durationOfCompetition"
                                    name="durationOfCompetition"
                                    placeholder="Enter duration of your competition"
                                    value={formData.durationOfCompetition}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                                  />
                                </div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-1 text-left ml-2.5" htmlFor="registrationDeadlineOfCompetition">
                                    Registration Deadline of Competition<span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="date"
                                    id="registrationDeadlineOfCompetition"
                                    name="registrationDeadlineOfCompetition"
                                    value={formData.registrationDeadlineOfCompetition}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Team Details */}
                        <div className="border-b pb-4 mb-4">
                          <button
                            type="button"
                            onClick={() => handleToggleSection("teamDetails")}
                            className="w-full text-left font-medium text-lg py-2"
                          >
                            Team Details<span className="text-red-500">*</span>
                          </button>
                          <div
                            className={`transition-all duration-700 ease-in-out overflow-hidden ${openSections.teamDetails ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"}`}
                          >
                            {openSections.teamDetails && (
                              <div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-1 text-left ml-2.5" htmlFor="currentTeamSize">
                                    Current Team Size<span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    id="currentTeamSize"
                                    name="currentTeamSize"
                                    value={formData.currentTeamSize}
                                    placeholder="Enter your team size"
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                                  />
                                </div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-1 text-left ml-2.5" htmlFor="teamName">
                                    Team Name
                                  </label>
                                  <input
                                    type="text"
                                    id="teamName"
                                    name="teamName"
                                    value={formData.teamName}
                                    placeholder="Enter your Team Name"
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Venue Details */}
                        <div className="border-b pb-4 mb-4">
                          <button
                            type="button"
                            onClick={() => handleToggleSection("venueDetails")}
                            className="w-full text-left font-medium text-lg py-2"
                          >
                            Venue Details<span className="text-red-500">*</span>
                          </button>
                          <div
                            className={`transition-all duration-700 ease-in-out overflow-hidden ${openSections.venueDetails ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"}`}
                          >
                            {openSections.venueDetails && (
                              <div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-1 text-left ml-2.5" htmlFor="country">
                                    Country
                                  </label>
                                  {/* <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    placeholder="Select Country"
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                                  /> */}
                                  <Select
                                    options={Country.getAllCountries()}
                                    getOptionLabel={(country) => country.name}
                                    getOptionValue={(country) => country.isoCode}
                                    value={selectedCountry}
                                    onChange={handleCountryChange}
                                  />
                                </div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-1 text-left ml-2.5" htmlFor="state">
                                    State
                                  </label>
                                  {/* <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    placeholder="Select State"
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                                  /> */}
                                  <Select
                                    options={
                                      selectedCountry
                                        ? State.getStatesOfCountry(selectedCountry.isoCode)
                                        : []
                                    }
                                    getOptionLabel={(state) => state.name}
                                    getOptionValue={(state) => state.isoCode}
                                    value={selectedState}
                                    onChange={handleStateChange}
                                  />
                                </div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-1 text-left ml-2.5" htmlFor="city">
                                    City
                                  </label>
                                  {/* <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    placeholder="Select City"
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                                  /> */}
                                  <Select
                                    options={
                                      selectedState
                                        ? City.getCitiesOfState(
                                          selectedCountry ? selectedCountry.isoCode : "",
                                          selectedState ? selectedState.isoCode : ""
                                        )
                                        : []
                                    }
                                    getOptionLabel={(city) => city.name}
                                    getOptionValue={(city) => city.name}
                                    value={selectedCity}
                                    onChange={handleCityChange}
                                  />
                                </div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-1 text-left ml-2.5" htmlFor="location">
                                    Location
                                  </label>
                                  <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Project Details */}
                        <div className="border-b pb-4 mb-4">
                          <button
                            type="button"
                            onClick={() => handleToggleSection("projectDetails")}
                            className="w-full text-left font-medium text-lg py-2"
                          >
                            Project Details<span className="text-red-500">*</span>
                          </button>
                          <div
                            className={`transition-all duration-700 ease-in-out overflow-hidden ${openSections.projectDetails ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"}`}
                          >
                            {openSections.projectDetails && (
                              <div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-1 text-left ml-2.5" htmlFor="projectOverview">
                                    Project Overview
                                  </label>
                                  <textarea
                                    id="projectOverview"
                                    name="projectOverview"
                                    value={formData.projectOverview}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Message */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1 text-left ml-2.5" htmlFor="message">
                            Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            placeholder="Enter other message that you want to deliver"
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSend(selectedUser.username)}
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
