import express from "express";
import {postFeed, getAllPosts, postLike, dislikePost, deletePost} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.post("/post-feed", postFeed);
postRouter.post("/post-like", postLike);
postRouter.post("/post-dislike", dislikePost);
postRouter.post("/delete-post/:id", deletePost);

export default postRouter;
