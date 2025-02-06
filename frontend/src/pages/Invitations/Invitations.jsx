import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import profile_img from "../../../src/assets/images/profile_img.jpg"
import random from "random-string-generator";
import useSocket from "../../hooks/useSocket";
import socket from "../../socket";

const Invitations = () => {
    const [invitations, setInvitations] = useState([]);
    const [expandedInvitations, setExpandedInvitations] = useState({});
    const toggleDetails = (id) => {
        setExpandedInvitations((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    const user_info = JSON.parse(localStorage.getItem("user_info"));
    const userId = user_info._id;
    const username = user_info.username;
    const { invitations: socketInvitations = [] } = useSocket();

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/invitation/get-invite?recipientUserName=${username}`);
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
    }, [userId]);

    useEffect(() => {
        if (Array.isArray(socketInvitations)) {
            setInvitations((prevInvites) => {
                const updatedInvites = [...prevInvites];
                let hasChanges = false;
    
                socketInvitations.forEach((newInvite) => {
                    const index = updatedInvites.findIndex((invite) => invite._id === newInvite._id);
                    if (index !== -1) {
                        if (updatedInvites[index] !== newInvite) {
                            updatedInvites[index] = newInvite;
                            hasChanges = true;
                        }
                    } else {
                        updatedInvites.push(newInvite);
                        hasChanges = true;
                    }
                });
    
                if (hasChanges) {
                    return updatedInvites;
                }
    
                return prevInvites; 
            });
        }
    }, [socketInvitations]);
    
    

    const handleAction = async (id, action) => {
        try {
            const res = await axios.patch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/invitation/update-inviteStatus/${id}`, { status: action });
            setInvitations((prev) =>
                prev.filter((invitation) => invitation._id !== id)
            );
            const spaceName = random();
            const senderUserName = res?.data?.invitation?.senderUserName;
            console.log("Fetching user with payload:", { username: senderUserName });
            const postUser = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/getUser`, { username: senderUserName })
            const postUsername = postUser?.data?.username;
            const members = [username, postUsername];
            if (action === "Accepted") {
                console.log("came for invite accepted");
                socket.emit("invite:accepted", { senderUserName, recipientUserName: username }, (ack) => {
                    if (!ack) {
                        console.error("No acknowledgment received from the server.");
                    } else {
                        console.log("Invite accepted event acknowledged:", ack);
                    }
                });

                await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/space/create-space`, {
                    admin: username,
                    members,
                    spaceName: spaceName,
                    chatPic: postUser?.data?.profilePic || profile_img,
                });
            }
            else if (action === "Declined") {
                socket.emit("invite:declined", { senderUserName, recipientUserName: username }, (ack) => {
                    console.log("Invite declined event acknowledged:", ack);
                });
            }

            alert(`Request ${action}`)
        } catch (error) {
            console.error(error);
        }
    };

    const InvitationCard = ({ invitation, onAction, onToggleDetails, isExpanded }) => (
        <div
            key={invitation._id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-800">
                Team Name: {invitation.teamName}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
                Competition: {invitation.competitionName}
            </p>
            <p className="text-sm text-gray-600 mb-2">
                Date: {new Date(invitation.dateOfCompetition).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-4">Message: {invitation.message}</p>

            <div className="flex justify-end space-x-4">
                <button
                    aria-label="View more details"
                    onClick={onToggleDetails}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                    More Details
                </button>
                <button
                    onClick={() => onAction(invitation._id, "Accepted")}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                >
                    Accept
                </button>
                <button
                    onClick={() => onAction(invitation._id, "Declined")}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                >
                    Decline
                </button>
            </div>

            {isExpanded && (
                <div className="mt-4 bg-gray-50 p-4 rounded-md shadow-inner">
                    <p className="text-sm text-gray-600">
                        <strong>Sender:</strong> {invitation.senderName} ({invitation.senderEmail})
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Duration:</strong> {invitation.durationOfCompetition} days
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Registration Deadline:</strong>{" "}
                        {new Date(invitation.registrationDeadlineOfCompetition).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Project Overview:</strong> {invitation.projectOverview}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Venue:</strong> {`${invitation.city}, ${invitation.state}, ${invitation.country}`}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Location:</strong> {`${invitation.location}`}
                    </p>
                </div>
            )}
        </div>
    )

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
                            <InvitationCard
                                key={invitation._id}
                                invitation={invitation}
                                onAction={handleAction}
                                onToggleDetails={() => toggleDetails(invitation._id)}
                                isExpanded={expandedInvitations[invitation._id]}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Invitations;
