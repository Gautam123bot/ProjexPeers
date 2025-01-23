import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import profile_img from "../../../src/assets/images/profile_img.jpg"
import random from "random-string-generator";

const Invitations = () => {
    const [invitations, setInvitations] = useState([]);

    const user_info = JSON.parse(localStorage.getItem("user_info"));
    const userId = user_info._id;
    const username = user_info.username;
    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/invitation/get-invite?recipientId=${userId}`);
                setInvitations(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (userId) {
            fetchInvitations();
        }
        else {
            console.log("user id not available");
        }
    }, []);

    const handleAction = async (id, action) => {
        try {
            const res = await axios.patch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/invitation/update-inviteStatus/${id}`, { status: action });
            setInvitations((prev) =>
                prev.filter((invitation) => invitation._id !== id)
            );
            if (action === "Accepted") {
                const spaceName = random();
                const receiverUserId = res?.data?.invitation?.senderId;
                const postUser = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/getUser`, { _id: receiverUserId })
                const postUsername = postUser?.data?.username;
                const members = [username, postUsername];

                await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/space/create-space`, {
                    admin: username,
                    members,
                    spaceName: spaceName,
                    chatPic: postUser?.data?.profilePic || profile_img,
                });
            }

            alert(`Request ${action}`)
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto py-10 px-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Invitations</h2>
                {invitations.length === 0 ? (
                    <p className="text-gray-500 text-center">No invitations available.</p>
                ) : (
                    <div className="space-y-6">
                        {invitations.map((invitation) => (
                            <div
                                key={invitation._id}
                                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                            >
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {invitation.teamName}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Competition: {invitation.competition}
                                </p>
                                <p className="text-gray-700 mb-4">{invitation.message}</p>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => handleAction(invitation._id, "Accepted")}
                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleAction(invitation._id, "Declined")}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Invitations;
