import User from "../models/user.js";
import Spaces from "../models/chat.js";

export const createSpace = async (req, res) => {
  const { admin, members, spaceName, chatPic } = req.body;

  if (!spaceName || !members) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }

  try {
    const userFound = await User.findOne({ username: admin });

    if (!userFound) {
      return res.status(404).send("User Not Found!");
    }

    const foundSpaces = await Spaces.find();

    const filteredMembers = members.filter((member) => {
      return member !== admin;
    });

    const ChatHead = filteredMembers.toString();

    const userSpaces = foundSpaces.filter((userSpace) => {
      return (
        (userSpace.members[0] == admin || userSpace.members[1] == admin) &&
        (filteredMembers[0] == userSpace.members[0] ||
          filteredMembers[0] == userSpace.members[1])
      );
    });

    const count = userSpaces.length;

    if (userFound && count === 0) {
      const space = new Spaces({
        admin,
        members,
        spaceName,
        chatPic,
        chatHead: ChatHead,
      });
      const createdSpace = await space.save();
      res.status(200).send(createdSpace);
    } else {
      if (!userFound) {
        res.status(404).send("User Not Found!");
      } else if (count === 0) {
        res.status(404).send("You are already connected to this user.");
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const getUserSpaces = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }

  try {
    const Space = await Spaces.find();

    const SpaceFound = Space.map((elem) => {
      if (elem.members.includes(username)) {
        return elem;
      } else {
        return null;
      }
    });

    const filteredSpaceFound = SpaceFound.filter((elem) => {
      return elem !== null;
    });

    if (SpaceFound) {
      res.send(filteredSpaceFound);
    } else {
      res.json("You are not a part of any Space.");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const searchSpace = async (req, res) => {
  const { search, username } = req.body;

  if (!search || !username) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }

  try {
    const Space = await Spaces.find();

    const SpaceFound = Space.map((elem) => {
      if (elem.members.includes(username)) {
        return elem;
      } else {
        return null;
      }
    });

    const filteredSpaceFound = SpaceFound.filter((elem) => {
      return elem !== null;
    });

    const newSpaces = filteredSpaceFound.map((space) => {
      if (space.chatHead.toLowerCase()) {
        if (!space.chatHead.toLowerCase().search(search)) {
          return space;
        }
      }
    });

    const filteredNewSpaces = newSpaces.filter((space) => {
      return space != null;
    });

    if (newSpaces) {
      res.send(filteredNewSpaces);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const sendMessage = async (req, res) => {
  const { id, username, message } = req.body;

  if (!username || !message) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }

  try {
    const spaceFound = await Spaces.findOne({ _id: id });

    if (!spaceFound) {
      return res.status(404).send(`Could not find requested Space.`);
    }

    const spacename = spaceFound.spaceName;
    const embedMessages = await spaceFound.PostMessages(username, message, spacename);

    return res.status(200).send(embedMessages);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};