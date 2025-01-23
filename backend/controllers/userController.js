import User from "../models/user.js";

export const updateUser = async (req, res) => {
  const _id = req.params.id;
  try {
    const updateUser = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.status(200).json({ updateUser, success: true });
  } catch (e) {
    res.status(500);
    res.json({ message: `Could not update user --> ${e}` });
  }
};

export const getUser = async (req, res) => {
  try {
    const { username, _id } = req.body;

    // Validate that at least one of username or _id is provided
    if (!username && !_id) {
      return res.status(400).json({ message: "Username or _id is required." });
    }

    if (_id) {
      const userFound = await User.findById(_id);
      if (userFound) {
        return res.status(200).json(userFound);
      } else {
        return res.status(400).json({ message: "User not found by _id!" });
      }
    }

    const userFound = await User.findOne({ username });
    if (userFound) {
      return res.status(200).json(userFound);
    } else {
      return res.status(400).json({ message: "User not found by username!" });
    }

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "An error occurred.", error: e.message });
  }
};


export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params; // Extract username from URL parameter
    const user = await User.findOne({ username }); // Find user in DB

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    res.status(200).json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "An error occurred while fetching users.", error: e.message });
  }
};