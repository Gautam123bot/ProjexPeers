import { Server } from "socket.io";
import socketController from "../controllers/socketController.js";

const initializeSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });
  socketController(io);
};

export default initializeSocket;
