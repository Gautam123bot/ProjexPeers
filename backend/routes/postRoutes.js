import express from "express";
import {postFeed, getAllPosts, deletePost} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.post("/post-feed", postFeed);
postRouter.post("/delete-post/:id", deletePost);

export default postRouter;
