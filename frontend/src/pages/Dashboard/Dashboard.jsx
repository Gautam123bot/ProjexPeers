import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import ProfileSummary from '../../components/ProfileSummary/ProfileSummary'
import TeamFinder from '../../components/TeamFinder/TeamFinder'
import { FeedCard } from '../../components/FeedCard/FeedCard'
import { useNavigate } from 'react-router-dom'
import { TeamFinderCard } from '../../components/TeamFinder/TeamFinderCard'
import loader_img from '../../assets/images/loader.svg'
import Axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('token') === null) {
      navigate('/login')
    }
  });
  const [modal, setModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [recall, setRecall] = useState(true);
  const [loader, setLoader] = useState(false);
  const user = JSON.parse(localStorage.getItem("user_info"));
  // console.log(user);
  useEffect(() => {
    Axios.get("http://localhost:3001/getAllPosts").then((res) => {
      console.log(res.data);
      setPosts(res.data.reverse());

    });
    setRecall(!recall);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const getUserSpaces = async () => {
    const res = await Axios.post(`http://localhost:3001/get-users-spaces`, {
      username: user.username,
    });
    localStorage.setItem("user_spaces", JSON.stringify(res.data));
    console.log(res.data);
  };

  const searchFeed = () => {
    if (search === "") {
      setRecall(!recall);
      return;
    }
    console.log(search);
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 2000);
    setPosts(posts.filter((post) => {
      return post.skills.some((skill) => {
        return skill.toLowerCase().includes(search.toLowerCase());
      })
    }))
    setRecall(!recall);
  }

  useEffect(() => {
    getUserSpaces();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <div className='dashboard-con' id={modal ? 'blurr' : null}>
    <div className="dashboard-main">
      <div className="welcome-con">
        {user.fullname ? <h1>Welcome, {user.fullname}</h1> : <h1>Welcome, User</h1>}
        <p>Find out what's new</p>
      </div>

      <TeamFinder setModal={setModal} />

      {modal && <TeamFinderCard setModal={setModal} />}

      <div className="write-con">
        <h3>Feed Search</h3>
        <div className="inp-box">
          {/* <textarea name="" id="" cols="30" rows="auto" className='inp'></textarea> */}
          <input type="text" placeholder='Type the skills you are looking for' className='inp' onChange={(e) => { setSearch(e.target.value) }} />
          <div className="search-btn" onClick={searchFeed}>Search</div>
        </div>
      </div>


      {loader? <img className="loader-img" src={loader_img} alt="Loading..."/>: posts.map((post, idx) => {
        return <FeedCard post={post} recall={recall} key={idx} />
      })}

    </div>

    <div className="dashboard-summary">
      <ProfileSummary />
    </div>
  </div>
}

export default Dashboard