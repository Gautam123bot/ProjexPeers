import User from "../models/user.js";
import Posts from "../models/posts.js";

export const postFeed = async (req, res) => {
  try {
    const { name, username, title, email, skills, year, date } = req.body;

    if (!username || !title || !email || !skills || !name) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

    const userFound = await User.findOne({ username: username });

    if (!userFound) {
      return res.status(404).json({ error: "User not found." });
    }

    const postsFound = await Posts.find({ username: username });
    const postsCount = postsFound.length;

    await userFound.updatePost(postsCount);

    const newPost = new Posts({
      name,
      username,
      date,
      title,
      email,
      skills,
      year,
    });

    const postedFeed = await newPost.save();
    res.status(201).json({ posts: postedFeed, success: true });
  } catch (e) {
    res.status(500).send(e);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Posts.find();
    res.send(allPosts);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const postLike = async (req, res) => {
  const { id, username } = req.body;

  if (!id || !username) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }

  try {
    const likePost = await Posts.findOne({ _id: id });

    if (!likePost) {
      return res.status(404).json({ error: "Post not found." });
    }

    const upvoted = await likePost.upvote(username);

    if (upvoted) {
      res.json({ message: "Upvoted Successfully!" });
    } else {
      res.json({ message: "Could not upvote!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const dislikePost = async (req, res) => {
  const { id, username } = req.body;

  if (!username || !id) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }

  try {
    const dislikePost = await Posts.findOne({ _id: id });

    if (!dislikePost) {
      return res.status(404).json({ message: "Post not found!" });
    }

    const downvoted = await dislikePost.downvote(username);

    if (downvoted) {
      return res.status(200).json({ message: "Downvoted Successfully!" });
    } else {
      return res.status(200).json({ message: "Already Downvoted!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const deletePost = async (req, res) => {
  const _id = req.params.id;

  try {
    const deletePost = await Posts.findByIdAndDelete(_id);

    if (!deletePost) {
      return res.status(404).json({ message: "Post not found!" });
    }

    return res.status(200).json({ message: "Post Deleted Successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: `Could not delete post --> ${e}` });
  }
};