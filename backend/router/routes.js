const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Posts = require("../models/posts.js");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const Spaces = require("../models/chat");
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

router.get("/", (req, res) => {
  res.json({ message: "This is the api" });
});

router.post("/register", async (req, res) => {
  const {
    fullname,
    username,
    email,
    password,
    cpassword,
    institution,
    profilePic,
    collegeStream,
    collegeYear,
    linkedIn,
    github,
    experience,
    skills,
    achievements,
  } = req.body;

  if (
    !fullname ||
    !username ||
    !email ||
    !password ||
    !cpassword
  ) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }

  try {
    const userSearchByEmail = await User.findOne({ email: email });
    const userSearchByUsername = await User.findOne({ username: username });

    if (userSearchByEmail || userSearchByUsername) {
      return res.status(422).json({ error: "user already exists." });
    }

    if (password !== cpassword) {
      return res.status(422).json({ error: "passwords dont match." });
    } else {
      const user = new User({
        fullname,
        email,
        password,
        cpassword,
        username,
      });

      const registered = await user.save();

      res.status(201).json({ message: "Registered Successfully!", sucess: true });
    }
  } catch (e) {
    res.status(500).json({ message: `Could not create account! --> ${e}`, sucess: false });
  }
});

router.post("/login", async (req, res) => {
  try {
    const logEmail = req.body.email;
    const logPass = req.body.password;

    if (!logEmail || !logPass) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

    const userEmail = await User.findOne({ email: logEmail });
    const passCheck = await bcrypt.compare(logPass, userEmail.password);
    const user = await User.findOne({ email: logEmail });

    const token = await userEmail.generateAuthToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 60000000),
      httpOnly: true,
    });

    // res.send(token);

    if (passCheck) {
      res.json({
        message: "Logged In Successfully!",
        token: token,
        sucess: true,
        user: user,
      });
    } else {
      res.status(400).json({ message: "Invalid login credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Invalid login credentials" });
  }
});

router.post("/post-feed", async (req, res) => {
  try {
    const { name, username, title, email, skills, year, date } = req.body;

    if (!username || !title || !email || !skills || !name) {
      return res.status(422).json({ error: "Please fill all the fields." });
    } else {

      const userFound = await User.findOne({username : username});

      const postsFound = await Posts.find({username : username});

      const postsCount = postsFound.length;

      const updatePostCount = await userFound.updatePost(postsCount);

      const posts = new Posts({
        name,
        username,
        date,
        title,
        email,
        skills,
        year
      });

    
      const postedFeed = await posts.save();
 

      res.status(201).json({ posts: posts, success: true });
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/getAllPosts", async (req, res) => {
  try {
    const allPosts = await Posts.find();
    res.send(allPosts);
  } catch (e) {
    res.send(e);
  }
});

router.post("/post-like", async (req, res) => {
  const { id, username } = req.body;

  if (!id || !username) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }
  try {
    const likePost = await Posts.findOne({ _id: id });

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
});



router.patch("/updateUser/:id", async (req, res) => {
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
});

router.post("/send-email", async (req, res) => {
  const { email, name } = req.body;
  const msg = {
    to: email,
    from: "0101gautamkumar@gmail.com",
    subject: "New Notification from ProjexPeers",
    text: `${name} wants to connect with you!`,
  }
  try {
    await sgMail.send(msg)
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (e) {
    res.status(500).json({ message: `Could not send email --> ${e}` });
  }

});

router.post("/create-space", async (req, res) => {
  try {
    const {admin, members, spaceName, chatPic } = req.body;

    if (!spaceName || !members) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }
    const userFound = await User.findOne({ username: admin });

    const foundSpaces = await Spaces.find();

  

    // const saveSpaces = await userFound.EmbedSpaces(spaceName);

   

    const filteredMembers = members.filter((member) => {
      return member !== admin
    })

    const ChatHead = filteredMembers.toString();

    const userSpaces = foundSpaces.filter((userSpace) => {
      return ((userSpace.members[0] == admin || userSpace.members[1] == admin) && (filteredMembers[0] == userSpace.members[0] || filteredMembers[0] == userSpace.members[1]))
    })

    const count = userSpaces.length;

    if (userFound && count === 0) {
      const space = new Spaces({
        admin,
        members,
        spaceName,
        chatPic,
        chatHead : ChatHead
      });
      const createdSpace = await space.save();
      res.status(200).send(createdSpace);
    } 
    else {
      if(!userFound){
        res.status(404).send("User Not Found!");
      }else if(count === 0){
        res.status(404).send("You are already connected to this user.");
      }
      
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/get-users-spaces", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

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
});

router.post("/search-space", async (req, res) => {
  try {
    const { search,username } = req.body;

    if (!search) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

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
      return space != null
    })

    if (newSpaces) {
      res.send(filteredNewSpaces);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});



router.post("/send-message", async (req, res) => {
  try {
    const { id, username, message } = req.body;

    if (!username || !message) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

    const spaceFound = await Spaces.findOne({ _id: id });

    const spacename = spaceFound.spaceName;

    if (spaceFound) {
      const embedMessages = await spaceFound.PostMessages(
        username,
        message,
        spacename
      );
      return res.status(200).send(embedMessages);
    } else {
      return res.status(404).send(`Could not find requested Space.`);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/post-dislike", async (req, res) => {
  const { id, username } = req.body;

  if (!username || !id) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }
  try {
    const dislikePost = await Posts.findOne({ _id: id });

    const downvoted = await dislikePost.downvote(username);

    if (downvoted) {
      res.json({ message: "Downvoted Successfully!" });
    } else {
      res.json({ message: "Already Downvoted!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

//delete post
router.post("/delete-post/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const deletePost = await Posts.findByIdAndDelete(_id);
    res.status(200).json({message: "Post Deleted Successfully!"});
  } catch (e) {
    res.status(500);
    res.json({ message: `Could not delete post --> ${e}` });
  }
});


router.post("/getUser", async (req, res) => {
  const {username} = req.body;
  const userFound = await User.findOne({ username : username});
  if(userFound){
    res.status(200).json(userFound);
  }else{
    console.log(e);
    res.status(500).send(e);
  }
});

router.get("/logout", auth, async (req, res) => {
  try {
    console.log(req.rootUser.tokens);
    req.rootUser.tokens = req.rootUser.tokens.filter((currElem) => {
      return currElem.token != req.token;
    });
    res.clearCookie("jwt", { path: "/" });
    res.status(200).send({ message: "logged out successfully!" });
    await req.rootUser.save();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/login-with-google", async (req, res) => {
  try {
    const logEmail = req.body.email;


    if (!logEmail) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }


    const user = await User.findOne({ email: logEmail });
    const userEmail = await User.findOne({ email: logEmail });

    const token = await userEmail.generateAuthToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 60000000),
      httpOnly: true,
    });

    // res.send(token);

    if (user) {
      res.json({
        message: "Logged In Successfully!",
        token: token,
        sucess: true,
        user: user,
      });
    } else {
      res.status(400).json({ message: "Invalid login credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Invalid login credentials" });
  }
});

module.exports = router;
