import axios from "axios";

export const RegisterUser = async (credentials) => {
  try {
    console.log(credentials);

    const Post = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/register`, credentials);

    return Post;
  } catch (error) {
    console.log(error);
    alert("Could not register user!");
  }
};

export const LoginUser = async (credentials) => {
  try {
    console.log("credentials entered: ", credentials);

    const Post = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/login`, credentials);

    return Post;
  } catch (error) {
    console.log(error);
    alert("Could not login, please try again later!");
  }
};

export const PostFeed = async (details) => {
  try {
    console.log(details);

    const Post = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/post/post-feed`, details);

    return Post;
  } catch (error) {
    console.log(error);
    alert("Could not post your feed, please try again later!");
  }
};

export const GetAllPosts = async () => {
  try {
    const Posts = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/post/getAllPosts`);

    return Posts;
  } catch (error) {
    console.log(error);
    alert("Could not get all posts, please try again later!");
  }
};

export const UpdateUser = async (userId, details) => {
  try {
    console.log(details);

    const Submission = await axios.patch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/updateUser/${userId}`, details);

    return Submission;
  } catch (error) {
    console.log(error);
    alert("Could not edit your profile, please try again later!");
  }
};

export const sendOtp = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/otp/send-otp`, data);
    return response;
  } catch (error) {
    console.error(error);
    alert("Could not send OTP, please try again later!");
  }
};

export const verifyOtp = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/otp/verify-otp`, data);
    return response;
  } catch (error) {
    console.error(error);
    alert("Could not verify OTP, please try again later!");
  }
};

export const sendForgetPasswordOtp = async (email) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/forgot-password`, { email });
    return response;
  } catch (error) {
    console.error(error);
    alert("Could not send OTP for password reset, please try again later!");
  }
};

export const resetToNewPassword = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/reset-password`, data);
    console.log("resonse in api file is: ", response);
    return response;
  } catch (error) {
    console.error(error);
    alert("Could not reset the password, please try again later!");
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
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});
