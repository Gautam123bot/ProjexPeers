import React, { useEffect, useState } from "react";
// import "./Feeds.css";
import TeamFinder from "../../components/TeamFinder/TeamFinder";
import { FeedCard } from "../../components/FeedCard/FeedCard";
import { useNavigate } from "react-router-dom";
import { TeamFinderCard } from "../../components/TeamFinder/TeamFinderCard";
import Loader from "../../components/Loader/Loader";
import Axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import peer from '../../assets/icons/peer.svg';
import writePost from '../../assets/icons/writePost.svg';

const Feeds = () => {
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
  const user = JSON.parse(localStorage.getItem("user_info"));
  const userspaces = JSON.parse(localStorage.getItem("user_spaces"));
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/login");
    }
  });

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
  <div className={`flex flex-wrap gap-8 p-8 ${modal ? "blurr" : ""} bg-gray-900`}>
    <div className="flex-1">
      <div className="flex flex-col">
        {/* Welcome Section */}
        <div className="welcome-con text-center mb-6 text-white">
          {user.fullname ? (
            <h1 className="text-3xl font-bold text-primary">Welcome, {user.fullname}</h1>
          ) : (
            <h1 className="text-3xl font-bold text-primary">Welcome, User</h1>
          )}
          <p className="text-gray-400 mt-2 text-sm">Find out what's new</p>
        </div>

        {/* Stats Section */}
        <div className="flex p-6 bg-gray-800 rounded-lg shadow-lg">
          <div className="flex justify-between gap-6 w-full">
            <div className="bg-gray-700 hover:bg-gray-600 transition-all rounded-md p-6 flex items-center shadow-md w-full">
              <img src={peer} alt="Peers" className="w-12 h-12 mr-4" />
              <div>
                <p className="text-lg font-semibold text-white">
                  {userspaces ? userspaces.length : 0}
                </p>
                <p className="text-xs text-gray-400">Peers</p>
              </div>
            </div>
            <div className="bg-gray-700 hover:bg-gray-600 transition-all rounded-md p-6 flex items-center shadow-md w-full">
              <img src={writePost} alt="Posts" className="w-12 h-12 mr-4" />
              <div>
                <p className="text-lg font-semibold text-white">{user.posts || 0}</p>
                <p className="text-xs text-gray-400">Posts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="write-con p-6 bg-gray-800 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold text-secondary text-white">Feed Search</h3>
          <div className="inp-box mt-4">
            <input
              type="text"
              placeholder="Type the skills you are looking for"
              className="inp px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="filter-section p-6 bg-gray-800 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold text-secondary text-white">Location Filters</h3>
          <div className="filters mt-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-6 flex flex-col items-center">
          {loader ? (
            <Loader />
          ) : posts.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-xl text-gray-400">
              <span className="mr-2">😞</span>
              <p>No posts available</p>
            </div>
          ) : (
            <div className="gap-6 w-full px-4">
              {posts.map((post, idx) => (
                <FeedCard post={post} recall={recall} key={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</>

  );

};

export default Feeds;
