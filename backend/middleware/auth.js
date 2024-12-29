import jwt from "jsonwebtoken";
import User from "../models/user.js";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith("Bearer ") 
      ? authHeader.split(" ")[1]
      : req.cookies?.jwt;

    console.log("Yours auth token is: ", token);
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      return res.status(401).json({message: "User Not Found."});
    }

    // req.token = token;
    // req.rootUser = rootUser;

    req.rootUser = {
      ...rootUser.toObject(), // Include all rootUser properties
      username: decoded.username, // Add username from the token
    };

    next();
  } catch (error) {
    res.status(401).send("Unauthorized : No token provided");
    console.log(error);
  }
};

export default auth;
