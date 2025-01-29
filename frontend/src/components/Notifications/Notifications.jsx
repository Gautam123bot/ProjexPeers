import { useEffect, useState } from "react";
import axios from "axios";

const Notifications = ({ user_id }) => {
    const [notifications, setNotifications] = useState([]); // State for storing notifications

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (!user_id) return; // Ensure user_id is available before making the request

                // Make a POST request to fetch notifications
                const response = await axios.post(
                    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/notifications/get-notifications`,
                    {
                        userId: user_id, // Pass userId in the request body
                    }
                );
                if (response) {
                    setNotifications(response.data[0].messages); // Update state with fetched notifications
                } else {
                    console.warn("No notifications received from the server.");
                }
            } catch (error) {
                console.error("Failed to fetch notifications:", error.message || error); // Log specific error message
            }
        };

        fetchNotifications(); // Call the function to fetch notifications
    }, [user_id]); // Re-run effect when user_id changes

    return (
        <div>
            <h2>Notifications</h2>
            {notifications?.length > 0 ? (
                <ul>
                    {notifications.map((notification, index) => (
                        <li key={index}>
                            {notification.message} - {notification.status}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No notifications found.</p>
            )}
        </div>
    );
};

export default Notifications;
