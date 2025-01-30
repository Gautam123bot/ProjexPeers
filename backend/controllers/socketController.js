import spaceUsers from "../helper/spaceUsers.js";
import User from "../models/user.js";
import Invitation from "../models/invitations.js";

const { addUser, getUser } = spaceUsers;

const socketController = (io) => {
  io.on("connection", (socket) => {
    console.log("New socket connection established!");

    socket.on("join", ({ username, selectedSpace }, callback) => {
      try {
        if (!username || !selectedSpace?.spaceName) {
          // Added validation for required fields
          return callback({ error: "Username and space name are required." });
        }
        const spacename = selectedSpace.spaceName;
        const { error, user } = addUser({ id: socket.id, username, spacename });

        if (error) {
          console.log(error);
          return callback({ error: "Unable to join space." });
        }

        socket.emit("message", {
          username: "admin",
          message: `Welcome ${user.username}`,
          spacename: user.spacename,
        });

        socket.broadcast.to(user.spacename).emit("message", {
          username: "admin",
          message: `${user.username} has joined!`,
        });

        socket.join(user.spacename);
        callback();
      } catch (err) {
        console.error("Error in join event:", err);
        callback({ error: "Internal server error." });
      }
    });

    socket.on("sendMessage", (message, callback) => {
      try {
        if (!message) {
          // Added validation for empty messages
          return callback({ error: "Message cannot be empty." });
        }
        const user = getUser(socket.id);

        if (!user) {
          return callback({ error: "User not found." });
        }

        io.to(user.spacename).emit("message", {
          username: user.username,
          message: message,
          spacename: user.spacename,
        });

        callback();
      } catch (err) {
        console.error("Error in sendMessage event:", err);
        callback({ error: "Internal server error." });
      }
    });

    socket.on("acceptRequest", async ({ invitationId }, callback) => {
      try {
        const invitation = await Invitation.findByIdAndUpdate(
          invitationId,
          { status: "Accepted" },
          { new: true }
        );

        if (!invitation) {
          return callback({ error: "Invitation not found." });
        }

        // Add users to each other's friend list
        await User.findByIdAndUpdate(invitation.senderId, { $addToSet: { friendList: invitation.recipientId } });
        await User.findByIdAndUpdate(invitation.recipientId, { $addToSet: { friendList: invitation.senderId } });

        // Notify both users
        io.to(invitation.senderId).emit("invitationAccepted", invitation);
        io.to(invitation.recipientId).emit("invitationAccepted", invitation);

        callback({ message: "Invitation accepted successfully!" });
      } catch (err) {
        console.error("Error in acceptRequest:", err);
        callback({ error: "Failed to accept invitation." });
      }
    });

    // Decline Invitation
    socket.on("declineRequest", async ({ invitationId }, callback) => {
      try {
        const invitation = await Invitation.findByIdAndUpdate(
          invitationId,
          { status: "Declined" },
          { new: true }
        );

        if (!invitation) {
          return callback({ error: "Invitation not found." });
        }

        // Notify both users
        io.to(invitation.senderId).emit("invitationDeclined", invitation);
        io.to(invitation.recipientId).emit("invitationDeclined", invitation);

        callback({ message: "Invitation declined successfully!" });
      } catch (err) {
        console.error("Error in declineRequest:", err);
        callback({ error: "Failed to decline invitation." });
      }
    });

    socket.on("disconnect", () => {
      console.log("User has disconnected.");
    });
  });
};

export default socketController;
