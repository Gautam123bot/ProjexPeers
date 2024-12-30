import { Server } from "socket.io";
import socketController from "../controllers/socketController.js";

const initializeSocket = (server) => {
  // Initialize Socket.IO with CORS settings
  const io = new Server(server, { 
    cors: { 
      origin: "*", // Allows all origins; consider restricting in production
      methods: ["GET", "POST"], // Restricts allowed HTTP methods for security
    } 
  });

  console.log("Socket.IO server initialized.");

  // Attach the controller to handle socket events
  socketController(io);

  // Optional: Handle errors globally at the IO level
  io.on("error", (err) => {
    console.error("Socket.IO error:", err);
  });
};

export default initializeSocket;
