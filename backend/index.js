import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectionToDb from "./db/conn.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import spaceRoutes from "./routes/spaceRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import auth from "./middleware/auth.js";
import { logoutUser } from "./controllers/authController.js";
import { getAllPosts } from "./controllers/postController.js";
import http from "http";
import initializeSocket from "./socket/socket.js";
import User from "./models/user.js";
import Posts from "./models/posts.js";
import invitationRoutes from "./routes/invitationRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const Router = express.Router();

app.use(cors({
  allowedHeaders: 'Content-Type, Authorization',
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

connectionToDb()
  .then(() => {
    console.log("✅ Database connection established.");
  })
  .catch((error) => {
    console.error("❌ Failed to connect to the database: ");
    console.error(error.message || error);
  });

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the ProjexPeers Backend!</h1>");
});
app.use("/user", auth, userRoutes);
app.use(Router.get("/post/getAllPosts", getAllPosts));
app.use("/post", auth, postRoutes);
app.use("/space", auth, spaceRoutes);
app.use("/invitation", auth, invitationRoutes);

app.use("/auth", authRoutes);
app.use(Router.get("/auth/logout", auth, logoutUser));
app.use("/otp", otpRoutes);
app.use("/email", emailRoutes);

const updatePostsCountForAllUsers = async () => {
  try {
    const users = await User.find();
    for (let user of users) {
      const postsFound = await Posts.find({ username: user.username });
      const postsCount = postsFound.length;
      console.log(`Updating posts count for user ${user.username} to ${postsCount}`);
      await user.initialUpdatePost(postsCount);
    }
  } catch (e) {
    console.log(`Error while updating posts count for users: ${e}`);
  }
};

const server = http.createServer(app);
initializeSocket(server);

server.listen(port, async() => {
  console.log(`Listening to port ${port}`);
  await updatePostsCountForAllUsers();
});
