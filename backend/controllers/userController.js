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
    // const { username: tokenUsername } = req.rootUser;
    const { username } = req.body;

    // if (username !== tokenUsername) {
    //   return res.status(403).json({ message: "Unauthorized: Access denied." });
    // }
    const userFound = await User.findOne({ username });

    if (userFound) {
      return res.status(200).json(userFound);
    } else {
      return res.status(404).json({ message: "User not found!" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "An error occurred.", error: e.message });
  }
};
