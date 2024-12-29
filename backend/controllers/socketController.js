import spaceUsers from "../middleware/spaceUsers.js";

const { addUser, getUser } = spaceUsers;

const socketController = (io) => {
  io.on("connection", (socket) => {
    console.log("New socket connection established!");

    socket.on("join", ({ username, selectedSpace }, callback) => {
      try {
        const spacename = selectedSpace.spaceName;
        const { error, user } = addUser({ id: socket.id, username, spacename });

        if (error) {
          console.log(error);
          return callback({ error: "Unable to join space." });
        }

        socket.emit("message", {
          username: "admin",
          message: `Welcome ${user.username}`,
          spacename: `${user.spacename}`,
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

    socket.on("disconnect", () => {
      console.log("User has disconnected.");
    });
  });
};

export default socketController;
