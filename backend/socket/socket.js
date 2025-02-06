import { Server } from "socket.io";
import socketController from "../controllers/socketController.js";

const initializeSocket = (server) => {
  global.io = new Server(server, { 
    cors: { 
      origin: "*",
      methods: ["GET", "POST"],
    } 
  });

  console.log("Socket.IO server initialized.");
  socketController(io);

  global.io.on("error", (err) => {
    console.error("Socket.IO error:", err);
  });
};

export default initializeSocket;
