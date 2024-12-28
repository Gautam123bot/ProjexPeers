//* All the AXIOS API calls will be made from here to the backend
//* These functions will be exported and then imported wherever needed

import Axios from "axios";

//^ `````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````

export const RegisterUser = async (credentials) => {
  try {
    console.log(credentials);

    const Post = await Axios.post(` http://localhost:3001/register`, credentials);

    return Post;
  } catch (error) {
    console.log(error);
    alert("Could not register user!");
  }
};

//^ `````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````

export const LoginUser = async (credentials) => {
  try {
    console.log(credentials);

    const Post = await Axios.post(` http://localhost:3001/login`, credentials);

    return Post;
  } catch (error) {
    console.log(error);
    alert("Could not login, please try again later!");
  }
};

//^ `````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````

export const PostFeed = async (details) => {
  try {
    console.log(details);

    const Post = await Axios.post(` http://localhost:3001/post-feed`, details);

    return Post;
  } catch (error) {
    console.log(error);
    alert("Could not post your feed, please try again later!");
  }
};

//^ `````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````

export const GetAllPosts = async () => {
  try {
    const Posts = await Axios.get(` http://localhost:3001/getAllPosts`);

    return Posts;
  } catch (error) {
    console.log(error);
    alert("Could not get all posts, please try again later!");
  }
};

//^ `````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
export const UpdateUser = async (userId, details) => {
  try {
    console.log(details);

    const Submission = await Axios.patch(`http://localhost:3001/updateUser/${userId}`, details);

    return Submission;
  } catch (error) {
    console.log(error);
    alert("Could not edit your profile, please try again later!");
  }
};