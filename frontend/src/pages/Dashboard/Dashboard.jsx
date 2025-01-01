import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import ProfileSummary from "../../components/ProfileSummary/ProfileSummary";
import TeamFinder from "../../components/TeamFinder/TeamFinder";
import { FeedCard } from "../../components/FeedCard/FeedCard";
import { useNavigate } from "react-router-dom";
import { TeamFinderCard } from "../../components/TeamFinder/TeamFinderCard";
import loader_img from "../../assets/images/loader.svg";
import Axios from "axios";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const { username } = useParams();
  console.log("user name from params is: ", username);
  const [modal, setModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [recall, setRecall] = useState(true);
  const [loader, setLoader] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/login");
    }
  });
  const fetchUserDetails = async () => {
    try {
      const res = await Axios.get(
        `http://localhost:3001/user/getUser/${username}`
      );
      setUserDetails(res.data);
    } catch (err) {
      console.error("Error fetching user details:", err);
      navigate("/login"); // Redirect to login if user not found
    }
  };

  const user = JSON.parse(localStorage.getItem("user_info"));

  const fetchPosts = async () => {
    try {
      setLoader(true);
      const res = await Axios.get("http://localhost:3001/post/getAllPosts");
      setPosts(res.data.reverse());
      setAllPosts(res.data.reverse());
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoader(false);
    }
  };

  const fetchUserSpaces = async () => {
    try {
      const res = await Axios.post(
        "http://localhost:3001/space/get-users-spaces",
        {
          username,
        }
      );
      localStorage.setItem("user_spaces", JSON.stringify(res.data));
    } catch (err) {
      console.error("Error fetching user spaces:", err);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    if (value === "") {
      setPosts(allPosts);
    }
    const filteredPosts = allPosts.filter((post) =>
      post.skills.some((skill) => skill.toLowerCase().includes(value))
    );
    setPosts(filteredPosts);
  };

  useEffect(() => {
    fetchUserDetails();
    fetchPosts();
    fetchUserSpaces();
  }, [username]);

  return (
    <div className="dashboard-con" id={modal ? "blurr" : null}>
      <div className="dashboard-main">
        <div className="welcome-con">
          {user.fullname ? (
            <h1>Welcome, {user.fullname}</h1>
          ) : (
            <h1>Welcome, User</h1>
          )}
          <p>Find out what's new</p>
        </div>

        <TeamFinder setModal={setModal} />

        {modal && <TeamFinderCard setModal={setModal} />}

        <div className="write-con">
          <h3>Feed Search</h3>
          <div className="inp-box">
            <input
              type="text"
              placeholder="Type the skills you are looking for"
              className="inp"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        {loader ? (
          <img className="loader-img" src={loader_img} alt="Loading..." />
        ) : (
          posts.map((post, idx) => {
            return <FeedCard post={post} recall={recall} key={idx} />;
          })
        )}
      </div>

      <div className="dashboard-summary">
        <ProfileSummary />
      </div>
    </div>
  );
};

export default Dashboard;
