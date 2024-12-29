import axios from "axios";

export const RegisterUser = async (credentials) => {
  try {
    console.log(credentials);

    const Post = await axios.post(` http://localhost:3001/auth/register`, credentials);

    return Post;
  } catch (error) {
    console.log(error);
    alert("Could not register user!");
  }
};

export const LoginUser = async (credentials) => {
  try {
    console.log(credentials);

    const Post = await axios.post(` http://localhost:3001/auth/login`, credentials);

    return Post;
  } catch (error) {
    console.log(error);
    alert("Could not login, please try again later!");
  }
};

export const PostFeed = async (details) => {
  try {
    console.log(details);

    const Post = await axios.post(` http://localhost:3001/post/post-feed`, details);

    return Post;
  } catch (error) {
    console.log(error);
    alert("Could not post your feed, please try again later!");
  }
};

export const GetAllPosts = async () => {
  try {
    const Posts = await axios.get(` http://localhost:3001/post/getAllPosts`);

    return Posts;
  } catch (error) {
    console.log(error);
    alert("Could not get all posts, please try again later!");
  }
};

export const UpdateUser = async (userId, details) => {
  try {
    console.log(details);

    const Submission = await axios.patch(`http://localhost:3001/user/updateUser/${userId}`, details);

    return Submission;
  } catch (error) {
    console.log(error);
    alert("Could not edit your profile, please try again later!");
  }
};

axios.interceptors.request.use((config) => {
  // List of routes that don't require the Authorization header
  const noAuthRoutes = [
    '/auth/register',
    '/auth/login',
    '/auth/login-with-google',
    '/otp/send-otp',
    '/otp/verify-otp',
    '/email/send-email',
    '/post/getAllPosts',
  ];

  // Check if the current request URL matches any of the noAuthRoutes
  const isNoAuthRoute = noAuthRoutes.some((route) => config.url.endsWith(route));

  if (!isNoAuthRoute) {
    const token = localStorage.getItem("token");
    if (token) {
      console.log('Adding token:', token); 
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});
