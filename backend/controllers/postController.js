import User from "../models/user.js";
import Posts from "../models/posts.js";

export const postFeed = async (req, res) => {
  try {
    const { name, username, title, email, skills, year, date, city, state, country, competitionType, membersRequired, lastDateOfRegistration } = req.body;

    if (!username || !title || !email || !skills || !name) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

    const userFound = await User.findOne({ username: username });

    if (!userFound) {
      return res.status(404).json({ error: "User not found." });
    }

    const postsFound = await Posts.find({ username: username });
    const postsCount = postsFound.length;
    console.log("count of post is: ", postsCount)
    await userFound.updatePost(postsCount);

    const newPost = new Posts({
      name,
      username,
      date,
      title,
      email,
      skills,
      year,
      city,
      state, 
      country,
      competitionType,
      membersRequired,
      lastDateOfRegistration
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