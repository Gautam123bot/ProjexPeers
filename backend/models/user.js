import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email.");
      }
    },
  },
  is_verified:{
    type: Boolean,
    default: false
  },
  username: {
    type: String,
    required: false,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  cpassword: {
    type: String,
    required: true,
    trim: true,
  },
  institution: {
    type: String,
    required: false,
    trim: true,
  },

  profilePic: {
    type: String,
    default: "",
    trim: true,
  },
  coverPic: {
    type: String,
    default: "",
    trim: true,
  },
  collegeYear: {
    type: String,
    trim: true,
    required: false,
  },
  collegeStream: {
    type: String,
    trim: true,
    required: false,
  },
  linkedIn: {
    type: String,
    trim: true,
    required: false,
  },
  github: {
    type: String,
    trim: true,
    required: false,
  },
  about : {
    type: String,
    trim: true
  },
  experiences: [
    {
      type: String,
      required: false,
    },
  ],
  skills: [
    {
      type: String,
      required: false,
    },
  ],
  achievements: [
    {
      type: String,
      required: false,
    },
  ],
  projects: [
    {
      type: String,
      required: false,
    },
  ],
  posts : {
    type : Number
  },
  groups: [
    {
      type: String,
      required: false,
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: false,
      },
    },
  ],
});

// Hashing Passwords

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.cpassword = await bcrypt.hash(this.cpassword, 10);
    console.log(this.password);
  }
  next();
});

// Generating Auth Token

userSchema.methods.generateAuthToken = async function () {
  try {
    console.log("came here for generate token")
    let token = jwt.sign({ _id: this._id, username: this.username ,email: this.email }, process.env.SECRET_KEY, { expiresIn: '24h' });;
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (e) {
    console.log(`Failed to generate token --> ${e}`);
  }
};

userSchema.methods.updatePost = async function (postsCount) {
  try {
    this.posts = postsCount + 1;
    await this.save();
    return this.posts;
  } catch (e) {
    console.log(`Failed to generate token --> ${e}`);
  }
}

const User = mongoose.model("USER", userSchema);

export default User;