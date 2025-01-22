import React, { useEffect, useState } from "react";
import "./Feeds.css";
import ProfileSummary from "../../components/ProfileSummary/ProfileSummary";
import TeamFinder from "../../components/TeamFinder/TeamFinder";
import { FeedCard } from "../../components/FeedCard/FeedCard";
import { useNavigate } from "react-router-dom";
import { TeamFinderCard } from "../../components/TeamFinder/TeamFinderCard";
import Loader from "../../components/Loader/Loader";
import Axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
// import { useParams } from "react-router-dom";

const Feeds = () => {
  // const { username } = useParams();
  // console.log("user name from params is: ", username);
  const [modal, setModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [recall, setRecall] = useState(true);
  const [loader, setLoader] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();
  const username = localStorage.getItem("username")
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/login");
    }
  });
  // const fetchUserDetails = async () => {
  //   try {
  //     const res = await Axios.get(
  //       `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/getUser/${username}`
  //     );
  //     setUserDetails(res.data);
  //   } catch (err) {
  //     console.error("Error fetching user details:", err);
  //     navigate("/login"); // Redirect to login if user not found
  //   }
  // };

  const user = JSON.parse(localStorage.getItem("user_info"));

  const fetchPosts = async () => {
    setLoader(true);
    try {
      const res = await Axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/post/getAllPosts`);
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
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/space/get-users-spaces`,
        {
          username,
        }
      );
      localStorage.setItem("user_spaces", JSON.stringify(res.data));
    } catch (err) {
      console.error("Error fetching user spaces:", err);
    }
  };

  // const handleSearch = (e) => {
  //   const value = e.target.value.toLowerCase();
  //   setSearch(value);
  //   if (value === "") {
  //     setPosts(allPosts);
  //   }
  //   const filteredPosts = allPosts.filter((post) =>
  //     post.skills.some((skill) => skill.toLowerCase().includes(value))
  //   );
  //   setPosts(filteredPosts);
  // };
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    filterPosts(value, country, state, city);
  };

  // Filter posts by search term, country, state, and city
  const filterPosts = (searchTerm, countryFilter, stateFilter, cityFilter) => {
    const filtered = allPosts.filter((post) => {
      const matchesSearch =
        post.skills.some((skill) => skill.toLowerCase().includes(searchTerm)) ||
        post.title.toLowerCase().includes(searchTerm);
      const matchesLocation =
        (countryFilter ? post.country.toLowerCase() === countryFilter.toLowerCase() : true) &&
        (stateFilter ? post.state.toLowerCase() === stateFilter.toLowerCase() : true) &&
        (cityFilter ? post.city.toLowerCase() === cityFilter.toLowerCase() : true);
      return matchesSearch && matchesLocation;
    });
    setPosts(filtered);
  };

  useEffect(() => {
    filterPosts(search, country, state, city);
  }, [search, country, state, city]);

  useEffect(() => {
    // fetchUserDetails();
    fetchPosts();
    fetchUserSpaces();
  }, [username]);

  return (
    <>
    <Navbar />
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

        {/* <TeamFinder setModal={setModal} />

        {modal && <TeamFinderCard setModal={setModal} />} */}

        <div className="write-con">
          <h3>Feed Search</h3>
          <div className="inp-box">
            <input
              type="text"
              placeholder="Type the skills you are looking for"
              className="inp px-4 py-2"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="filter-section">
          <h3>Location Filters</h3>
          <div className="filters mt-2">
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="p-2 border-2 border-gray-300 mr-3 rounded-lg"
            />
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="p-2 border-2 border-gray-300 mr-3 rounded-lg"
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="p-2 border-2 border-gray-300 mr-3 rounded-lg"
            />
          </div>
        </div>
        <div className="mt-5 flex flex-col items-center">
          {loader ? (
            <Loader />
          ) : posts.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-xl text-gray-600">
              <span className="mr-2">😞</span>
              <p>No posts available</p>
            </div>
          ) : (

            <div className="grid grid-cols-1 gap-6 w-full px-4">
              {posts.map((post, idx) => (
                <FeedCard post={post} recall={recall} key={idx} />
              ))}
            </div>
          )}
        </div>

      </div>

      <div className="dashboard-summary">
        <ProfileSummary />
      </div>
    </div>
    </>
  );
};

export default Feeds;
