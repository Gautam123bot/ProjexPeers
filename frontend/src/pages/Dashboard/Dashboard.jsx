import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TeamFinderCard } from "../../components/TeamFinder/TeamFinderCard";
import Navbar from "../../components/Navbar/Navbar";

function Dashboard() {
    const [modal, setModal] = useState(false);
    return (
        <>
            <Navbar />
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">ProjexPeers Dashboard</h1>
                <p className="text-gray-600">Connect, Collaborate, and Grow</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
                    <h2 className="text-xl font-bold text-gray-800">Find a Member</h2>
                    <p className="text-gray-600 mt-2">
                        Search for peers with similar interests and skills to collaborate.
                    </p>
                    <Link to="/findateammate">
                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                            Explore
                        </button>
                    </Link>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
                    <h2 className="text-xl font-bold text-gray-800">Join a Team</h2>
                    <p className="text-gray-600 mt-2">
                        Browse team postings and find opportunities to join competitions.
                    </p>
                    <Link to="/feeds">
                        <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
                            Browse Posts
                        </button>
                    </Link>
                </div>

                {modal && <TeamFinderCard setModal={setModal} />}
                <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
                    <h2 className="text-xl font-bold text-gray-800">Create a Post</h2>
                    <p className="text-gray-600 mt-2">
                        Post your requirements and invite members to your team.
                    </p>
                    <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                        onClick={() => setModal(true)}
                    >
                        Create Post
                    </button>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
                    <h2 className="text-xl font-bold text-gray-800">Mentorship Portal</h2>
                    <p className="text-gray-600 mt-2">
                        Get guidance from mentors for placements or hackathon preparation.
                    </p>
                    <Link to="/mentorship">
                    <button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
                        Find Mentors
                    </button>
                    </Link>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
                    <h2 className="text-xl font-bold text-gray-800">Chat Section</h2>
                    <p className="text-gray-600 mt-2">
                        Communicate with your team members in real-time.
                    </p>
                    <Link to="/messages">
                        <button className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition">
                            Open Chat
                        </button>
                    </Link>
                </div>

            </div>
        </div>
        </>
    );
}

export default Dashboard;
