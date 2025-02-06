import React, { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import socket from "../../socket";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hasNew, setHasNew] = useState(false);

    useEffect(() => {
        const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
        setNotifications(storedNotifications);

        const storedHasNew = JSON.parse(localStorage.getItem("hasNew")) || false;
        setHasNew(storedHasNew);
    }, []);

    useEffect(() => {
        const handleInviteAccepted = ({ senderUserName, recipientUserName }) => {
            addNotification(`${recipientUserName} accepted your invitation.`, "success");
        };

        const handleInviteDeclined = ({ senderUserName, recipientUserName }) => {
            addNotification(`${recipientUserName} declined your invitation.`, "error");
        };

        socket.on("invite:accepted", handleInviteAccepted);
        socket.on("invite:declined", handleInviteDeclined);

        return () => {
            socket.off("invite:accepted", handleInviteAccepted);
            socket.off("invite:declined", handleInviteDeclined);
        };
    }, []);

    const addNotification = (message, type) => {
        const newNotification = { id: Date.now(), message, type };
        const updatedNotifications = [newNotification, ...notifications];

        setNotifications(updatedNotifications);
        setHasNew(true);
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
        localStorage.setItem("hasNew", JSON.stringify(true));
    };

    const removeNotification = (id) => {
        const updatedNotifications = notifications.filter((notif) => notif.id !== id);
        setNotifications(updatedNotifications);
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    };

    const handleBellClick = () => {
        setIsOpen(!isOpen);
        if (isOpen) return;

        setHasNew(false);
        localStorage.setItem("hasNew", JSON.stringify(false));
    };

    return (
        <div className="relative">
            <button 
                className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition" 
                onClick={handleBellClick}
            >
                <Bell className="w-6 h-6 text-gray-700" />
                {hasNew && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg p-3 z-50">
                    <h3 className="text-lg text-gray-800 font-semibold mb-2">Notifications</h3>
                    {notifications.length === 0 ? (
                        <p className="text-gray-500">No new notifications</p>
                    ) : (
                        <ul className="space-y-2">
                            {notifications.map((notif) => (
                                <li key={notif.id} className="flex items-center justify-between p-2 rounded-md shadow-sm">
                                    <span className={`${notif.type === "success" ? "text-green-600" : "text-red-600"}`}>
                                        {notif.message}
                                    </span>
                                    <button onClick={() => removeNotification(notif.id)}>
                                        <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;
