import React, { useEffect, useState } from "react";
// import "./FeedCard.css";
import feed_avatar from "../../assets/images/profile_img.jpg";
import heart_outlined from "../../assets/icons/heart_outlined.png";
import heart_filled from "../../assets/icons/heart_filled.png";
import Axios from "axios";
import { Chips } from "../../components/Chips/Chips";
import random from "random-string-generator";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Loader from "../Loader/Loader"

export const FeedCard = ({ post, recall }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes?.length);
  const [requestSent, setRequestSent] = useState(false);
  const [postUser, setPostUser] = useState({});
  const [friendRequestLoader, setFriendRequestLoader] = useState(false);
  const username = JSON.parse(localStorage.getItem("user_info")).username;
  const fullname = JSON.parse(localStorage.getItem("user_info")).fullname;
  const userspace = JSON.parse(localStorage.getItem("user_spaces"));
  // const liked = post.likes.some(like => like.username === username);
  const obj = {
    id: post?._id,
    username: username,
  };

  useEffect(() => {
    if (post?.likes.some((like) => like.username === username)) {
      setLiked(true);
    }
  }, []);

  useEffect(() => {
    const setUserDetails = async () => {
      const res = await Axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/getUser`, {
        username: post?.username,
      });
      setPostUser(res.data);
      // localStorage.setItem('user_info', JSON.stringify(res.data));
    };
    setUserDetails();
  }, [recall]);

  const handleLike = () => {
    if (liked) {
      return;
    }
    // console.log(randomstring.generate(7));
    Axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/post/post-like`, obj).then((res) => {
      console.log(res.data.message);
      setLiked(true);
      setLikeCount(likeCount + 1);
    });
  };

  const handleDislike = () => {
    if (!liked) {
      return;
    }
    // console.log("dislike clicked!")
    Axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/post/post-dislike`, obj).then((res) => {
      console.log(res.data.message);
      setLiked(false);
      setLikeCount(likeCount - 1);
    });
  };

  const deletePost = () => {
    Axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/post/delete-post/${post._id}`).then(
      (res) => {
        console.log(res.data.message);
        window.location.reload();
      }
    );
  };

  function userAlreadyConnected(postUsername) {
    //iterate userspace
    for (let i = 0; i < userspace.length; i++) {
      //if user is in userspace
      if (userspace[i].members[1] === postUsername) {
        return true;
      }
    }
    return false;
  }

  async function handleConnect(postUsername) {
    if (userAlreadyConnected(postUsername)) {
      alert("User already connected!");
      navigate("/messages");
      return;
    }
    const admin = username;
    const spaceName = random();
    const members = [username, postUsername];

    const obj = {
      admin: admin,
      spaceName: spaceName,
      members: members,
      chatPic: postUser?.profilePic,
    };

    setFriendRequestLoader(true);
    try {
      // Create space
      const res = await Axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/space/create-space`, obj);

      // Send email
      const emailPayload = { email: post?.email, name: fullname };
      console.log("Email payload:", emailPayload);

      if (!emailPayload.email || !emailPayload.name) {
        throw new Error("Invalid email or name provided");
      }

      const sendMessage = await Axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/email/send-email`,
        emailPayload
      );
      console.log("Email sent response:", sendMessage.data.message);

      alert(`Request sent to ${post.email}`);
      setRequestSent(true);
      navigate("/messages");
    } catch (error) {
      console.error("Error occurred:", error.response?.data || error.message);
      alert("An error occurred while processing your request.");
    } finally {
      setFriendRequestLoader(false);
    }
  }

  return (
    <>
      {friendRequestLoader ? <Loader /> :

        <div className="feed-card-con bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out mb-6">
          {post?.username === username && (
            <div
              className="delete-con absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-white"
              onClick={deletePost}
            >
              <i className="fas fa-trash-alt text-xl"></i>
            </div>
          )}

          <div className="flex space-x-6">
            {/* Left: Avatar */}
            <div className="left flex-shrink-0">
              <img
                src={postUser.profilePic ? postUser.profilePic : feed_avatar}
                alt="Avatar"
                className="feed_avatar w-16 h-16 rounded-full object-cover border-4 border-gray-700"
              />
            </div>

            {/* Right: Content */}
            <div className="right flex-1">
              <p
                className="feed-name text-2xl font-semibold text-white cursor-pointer hover:text-indigo-400 transition-all"
                onClick={() => navigate(`/${post?.username}`)}
              >
                {post?.name}
              </p>
              <p className="feed-time text-gray-400 text-sm">{moment(post?.date).format("LLL")}</p>

              <div className="proj-desc mt-4">
                <p className="feed-title text-xl text-white font-semibold mt-2">{post?.title}</p>

                <div className="skillss-con mt-3">
                  <p className="text-gray-400">Skills Required: </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post?.skills.map((skill, idx) => (
                      <Chips className="feed-skill bg-gray-700 text-white px-3 py-1 rounded-full" name={skill} key={idx} />
                    ))}
                  </div>
                </div>
                <div className="flex pt-2"><div className="text-gray-400">Country:</div><div className="text-white">
                  {post?.country}
                </div></div>
                <div className="flex pt-2"><div className="text-gray-400">State:</div><div className="text-white">
                  {post?.state}
                </div></div>
                <div className="flex pt-2"><div className="text-gray-400">City:</div><div className="text-white">
                  {post?.city}
                </div></div>
                <div className="flex pt-2"><div className="text-gray-400">Competition tyep: </div>
                <div className="text-white">{post?.competitionType}</div></div>
                <div className="flex pt-2"><div className="text-gray-400">Members Required</div>
                <div className="text-white">{post?.membersRequired}</div></div>
                <div className="flex pt-2"><div className="text-gray-400">Last date of registration</div>
                <div className="text-white">{post?.lastDateOfRegistration}</div></div>

                <p className="yoe text-gray-400 mt-4">Year of Education: {post?.year}</p>
              </div>

              {/* Bottom: Actions */}
              <div className="bottom-con flex justify-between items-center mt-6">
                {post?.username !== username && (
                  <div
                    className="connect-btn bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-full cursor-pointer transition-all"
                    onClick={() => handleConnect(post?.username)}
                  >
                    <p>{requestSent ? "Request Sent" : "Connect"}</p>
                  </div>
                )}

                <div className="like-con flex items-center space-x-3">
                  {liked ? (
                    <img
                      src={heart_filled}
                      alt="liked"
                      className="cursor-pointer w-6 h-6"
                      onClick={handleDislike}
                    />
                  ) : (
                    <img
                      src={heart_outlined}
                      alt="not liked"
                      className="cursor-pointer w-6 h-6"
                      onClick={handleLike}
                    />
                  )}
                  <p className="likes text-white text-lg font-semibold">{post?.likes ? likeCount : 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};
