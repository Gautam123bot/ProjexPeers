import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import avatar_pic from '../../assets/images/avatar2.png';
import Navbar from '../../components/Navbar/Navbar';

const ProfilePage = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/getUser/${username}`);
        setUserData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user data');
      } finally{
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        {/* Fast Moving Circular Loader */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-500 rounded-full animate-spin"></div>
          <div className="mt-4 text-lg font-semibold">Loading Profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-red-400">
        <div className="text-lg font-semibold">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 shadow-xl rounded-lg p-6">
          <div className="flex items-center space-x-6">
            <img
              src={userData.profilePic || avatar_pic}
              alt={`${userData.fullname}'s profile`}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-600"
            />
            <div>
              <h1 className="text-3xl font-bold">{userData.fullname}</h1>
              <p className="text-gray-400">@{userData.username}</p>
              <p className="mt-2">{userData.about || 'No bio provided'}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Details */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            <p className="mb-2">
              <span className="font-semibold">Email:</span> {userData.email}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Institution:</span> {userData.institution || 'N/A'}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Year:</span> {userData.collegeYear || 'N/A'}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Stream:</span> {userData.collegeStream || 'N/A'}
            </p>
          </div>

          {/* Links */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Links</h2>
            <div className="space-y-2">
              {userData.linkedIn && (
                <a
                  href={userData.linkedIn}
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              )}
              {userData.github && (
                <a
                  href={userData.github}
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Skills, Projects, Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Skills */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Skills</h2>
            {userData.skills.length > 0 ? (
              <ul className="list-disc list-inside">
                {userData.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p>No skills listed</p>
            )}
          </div>

          {/* Projects */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Projects</h2>
            {userData.projects.length > 0 ? (
              <ul className="list-disc list-inside">
                {userData.projects.map((project, index) => (
                  <li key={index}>{project}</li>
                ))}
              </ul>
            ) : (
              <p>No projects listed</p>
            )}
          </div>

          {/* Achievements */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
            {userData.achievements.length > 0 ? (
              <ul className="list-disc list-inside">
                {userData.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            ) : (
              <p>No achievements listed</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProfilePage;
