import Notification from "../models/notifications.js";

export const getNotification = async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
      }
      const notifications = await Notification.find({userId: userId});
      res.status(200).json(notifications);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch invitations." });
    }
  };